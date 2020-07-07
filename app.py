import os
import requests
from flask import Flask, render_template, request,jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db
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

@app.route("/")
def index():
  return render_template("home.html")

@app.route("/load_model")
def train_model():
  city_code = request.get_json()["city_code"]
  model = utils.load_model(city_code)
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