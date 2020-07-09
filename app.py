import os
import requests
from flask import Flask, render_template, request,jsonify, redirect, session
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db
from forms import SearchForm, FilterForm
import utils


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///yosoku'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "Thisisasecretkey")
toolbar = DebugToolbarExtension(app)
connect_db(app)

############################################################

@app.route("/", methods=["GET","POST"])
def index():
  form = SearchForm()

  if form.validate_on_submit():
        city_code = form.city_code.data
        # model = Query.query.filter_by(city_code=city_code).first()
        # if not model:
        model =  utils.load_model(city_code)
        session["city_code"] = city_code
        return redirect("/filter")
  else:
        return render_template(
            "home.html", form=form)

@app.route("/filter")
def filter():

  city_code = session["city_code"]
  model = utils.load_model(city_code)
  form = FilterForm()
  
  form.type_.choices = model.model.type_
  form.floor_plan.choices = model.model.floor_plan

  return render_template("filter.html",form=form )


@app.route("/load_model", methods=["POST"])
def train_model():
  # city_code = request.get_json()["city_code"]
  # model = utils.load_model(city_code)
  return jsonify(code = "ok")



@app.route("/api/predict_price")
def predict_price_api():

  city_code = request.get_json()["city_code"]
  type_ = request.get_json()["type"]
  area = request.get_json()["area"]
  floor_plan = request.get_json()["floor_plan"]

  model = utils.load_model(city_code)
  prediction = model.model.predict_price(type_,area,floor_plan)
  
  return jsonify(data= prediction)

