import os
import requests
from flask import Flask, render_template, request, jsonify, redirect, session, make_response, flash, url_for, g
from flask_debugtoolbar import DebugToolbarExtension
from flask_wtf.csrf import CSRFProtect
from models import db, connect_db, User, UserQuery
from forms import SearchForm, FilterForm, SignupForm, LoginForm, LogoutForm, DeleteForm, EditQueryForm
from flask import send_from_directory
import utils
from sqlalchemy.exc import IntegrityError

CURR_USER_KEY = "curr_user"

app = Flask(__name__)
csrf = CSRFProtect(app)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///yosoku'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "Thisisasecretkey")
toolbar = DebugToolbarExtension(app)
connect_db(app)

############################################################


@app.route("/", methods=["GET", "POST"])
def index():

    form = SearchForm()

    if form.validate_on_submit():
        city_code = form.city_code.data
        city_name = form.city_name.data
        model = utils.load_model(city_code)
        session["city_code"] = city_code
        session["city_name"] = city_name

        return jsonify(data="ok")
    else:
        return render_template(
            "home.html", form=form)


@app.route("/filters", methods=["GET", "POST"])
def show_filters():

    city_code = session["city_code"]
    city_name = session["city_name"]

    if city_code and city_name:
        form = FilterForm()
        model = utils.load_model(city_code)
        btn = {"id": "predict-btn", "text": "Predict Price!"}
        form.type_.choices = [(choice, choice) for choice in model.model.type_]
        form.floor_plan.choices = [(floor_plan, floor_plan)
                                   for floor_plan in model.model.floor_plan]

        return render_template("modal_form.html", form=form, btn=btn, city_name=city_name)

    else:
        flash("Start by searching for a city ...")
        return render_template("message.html")


@app.route("/results")
def get_query_results():

    if g.user:
        results = UserQuery.query.filter_by(
            user_id=g.user.id).order_by(UserQuery.id.desc()).all()
    else:
        results = UserQuery.query.filter_by(
            user_id=1).order_by(UserQuery.id.desc()).all()

    return render_template("table.html", results=results)


@app.route("/predict", methods=["GET", "POST"])
def filter():
    form = FilterForm()

    city_code = session["city_code"]
    city_name = session["city_name"]

    model = utils.load_model(city_code)
    btn = {"id": "predict-btn", "text": "Predict Price!"}
    form.type_.choices = [(choice, choice) for choice in model.model.type_]
    form.floor_plan.choices = [(floor_plan, floor_plan)
                               for floor_plan in model.model.floor_plan]
    form.floor_plan.choices.append(("", ""))

    if form.validate_on_submit():
        type_ = form.type_.data
        area = form.area.data
        floor_plan = form.floor_plan.data

        price_prediction = model.model.predict_price(
            type_=type_, area=area, floor_plan=floor_plan)

        flash(f"The price estimate is {price_prediction}")

        if g.user:
            # add results to user database
            query = UserQuery(user_id=g.user.id, location=city_name, type_=type_,
                              area=area, layout=floor_plan, price_estimate=price_prediction, comment="")
            db.session.add(query)
            db.session.commit()

        return render_template("message.html")

    else:
        print("Form not being validated -----------------")
        return render_template("modal_form.html", form=form, city_name=city_name, btn=btn)


@app.route("/delete/query", methods=["GET", "POST"])
def delete_query():

    form = DeleteForm()
    btn = {"id": "delete-query-btn", "text": "Delete!"}
    if form.validate_on_submit():
        query_id = int(request.get_json()["queryId"])
        query = UserQuery.query.filter_by(id=query_id).first()
        db.session.delete(query)
        db.session.commit()
        flash("Query deleted!")
        return render_template("message.html")

    return render_template("modal_form.html", form=form, btn=btn)


@app.route("/edit/query", methods=["GET", "POST"])
def edit_query():

    form = EditQueryForm()
    btn = {"id": "edit-query-btn", "text": "Edit!"}
    if form.validate_on_submit():
        comment = form.comment.data
        query_id = int(request.get_json()["queryId"])

        query = UserQuery.query.filter_by(id=query_id).first()
        query.comment = comment
        db.session.add(query)
        db.session.commit()

        flash("Comment added!")
        return render_template("message.html")

    return render_template("modal_form.html", form=form, btn=btn)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """Handle user signup. It creates new user and add to DB
    """
    form = SignupForm()
    btn = {"id": "signup-btn", "text": "Sign me up!"}

    if form.validate_on_submit():
        try:
            user = User.signup(username=form.username.data,
                               password=form.password.data, email=form.email.data)
            db.session.commit()

        except IntegrityError:
            # Handle if username aready taken
            return render_template("/forms/signup_form.html")

        flash("User Created! Please login.")
        return render_template('message.html')

    else:
        return render_template("modal_form.html", form=form, btn=btn)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Handle user loging"""
    form = LoginForm()
    btn = {"id": "login-btn", "text": "Login!"}

    if form.validate_on_submit():
        user = User.authenticate(
            form.username.data, form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!")
            return render_template("message.html")

        # Clear form before resending
        form.username.data = ""
        form.password.data = ""
        flash("Invalid credentials")

    return render_template("modal_form.html", form=form, btn=btn)


@app.route("/logout", methods=["GET", "POST"])
def logout():
    """Handle logout of user"""
    form = LogoutForm()
    btn = {"id": "logout-btn", "text": "Logout!"}

    if form.validate_on_submit():
        do_logout()
        flash(f"You are logged out!")
        return render_template("message.html")

    return render_template("modal_form.html", form=form, btn=btn)


@app.before_request
def add_user_to_g():
    """If user is logged in add it to flask global"""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None


def do_login(user):
    """Log in user"""
    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user"""
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]
