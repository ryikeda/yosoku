import os
import requests
from flask import Flask, render_template, request,jsonify
from flask_debugtoolbar import DebugToolbarExtension
from functions import get_data

app = Flask(__name__)

app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "Thisisasecretkey")
toolbar = DebugToolbarExtension(app)

@app.route("/")
def index():
  return render_template("base.html")

@app.route("/api/predict")
def predict_price_api():
  user_input = request.get_json()
  
  data = get_data(user_input)
  
  
  return jsonify(response="200", data=data )