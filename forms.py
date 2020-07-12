from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, BooleanField, SelectField, HiddenField, PasswordField
from wtforms.validators import InputRequired, Email, Length

class SearchForm(FlaskForm):
  """Form for searching cities"""
  search = StringField("search", validators=[InputRequired()])
  city_code = HiddenField("city_code", validators=[InputRequired()])

class FilterForm(FlaskForm):
  """Form for filtering machine learning models"""

  type_ = SelectField("type", validators=[InputRequired()])
  area = FloatField("area", validators=[InputRequired()])
  floor_plan = SelectField("floor_plan", validators=[InputRequired()])

class SignupForm(FlaskForm):
  """Form for adding users."""

  username = StringField('Username', validators=[InputRequired()])
  email = StringField('E-mail', validators=[InputRequired(), Email()])
  password = PasswordField('Password', validators=[Length(min=6)])
