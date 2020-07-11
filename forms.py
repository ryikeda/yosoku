from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, BooleanField, SelectField, HiddenField
from wtforms.validators import InputRequired

class SearchForm(FlaskForm):
  """Form for searching cities"""
  search = StringField("search", validators=[InputRequired()])
  city_code = HiddenField("city_code", validators=[InputRequired()])

class FilterForm(FlaskForm):
  """Form for filtering machine learning models"""

  type_ = SelectField("type", validators=[InputRequired()])
  area = FloatField("area", validators=[InputRequired()])
  floor_plan = SelectField("floor_plan", validators=[InputRequired()])
