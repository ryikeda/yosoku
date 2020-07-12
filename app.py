import os
import requests
from flask import Flask, render_template, request,jsonify, redirect, session
from flask_debugtoolbar import DebugToolbarExtension
from flask_wtf.csrf import CSRFProtect
from models import connect_db
from forms import SearchForm, FilterForm, SignupForm
from flask import send_from_directory
import utils

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

SAMPLE_TABLE = [
  {"Location":"Shinagawa", "Type":"Pre-owned Condominiums, etc.", "Area m2":"120", "Layout":"2LDK"},
  {"Location":"Taito", "Type":"Residential Land(Land and Building)", "Area m2":"150", "Layout":""},
  {"Location":"Shizuoka", "Type":"Residential Land(Land Onlya)", "Area m2":"180", "Layout":""}
]


@app.route("/", methods=["GET","POST"])
def index():
  
  search_form = SearchForm()
  filter_form = FilterForm()
  
  if search_form.validate_on_submit():
        city_code = search_form.city_code.data
        model =  utils.load_model(city_code)
        session["city_code"] = city_code

        filter_form.type_.choices = [(choice,choice) for choice in model.model.type_]
        filter_form.floor_plan.choices = [(floor_plan,floor_plan) for floor_plan in model.model.floor_plan]

        return render_template("filters.html",filter_form=filter_form)
  else:
        return render_template(
            "home.html", search_form=search_form, table=SAMPLE_TABLE)


@app.route("/predict", methods=["GET","POST"])
def filter():
  form = FilterForm()

  city_code = session["city_code"]
  model = utils.load_model(city_code)
  form.type_.choices = [(choice,choice) for choice in model.model.type_]
  form.floor_plan.choices = [(floor_plan,floor_plan) for floor_plan in model.model.floor_plan]

  if form.validate_on_submit():
    type_ = form.type_.data
    area = form.area.data
    floor_plan = form.floor_plan.data
    print("Form is validated ************************")
    print(type_)
    print(area)
    print(floor_plan)
    return "ok"

  else:
      print("Form not being validated -----------------")
      return render_template("predict.html",form=form )





@app.route("/api/predict_price", methods=["GET","POST"])
def predict_price_api():

  # city_code = request.get_json()["city_code"]
  city_code = session["city_code"]
  type_ = request.get_json()["type"]
  area = request.get_json()["area"]
  floor_plan = request.get_json()["floorPlan"]

  model = utils.load_model(city_code)
  prediction = model.model.predict_price(type_,area,floor_plan)
  
  return jsonify(data= prediction)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico',mimetype='image/vnd.microsoft.icon')



@app.route("/signup", methods=["GET", "POST"])
def signup():
  """Handle user signup. It creates new user and add to DB
  """
  singup_form = SignupForm()

  if signup_form.validate_on_submit():
    pass
  else:
    return render_template("signup_form.html", signup_form=signup_form)