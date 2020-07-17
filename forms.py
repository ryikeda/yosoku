from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, BooleanField, SelectField, HiddenField, PasswordField, TextAreaField
from wtforms.validators import InputRequired, Email, Length


class SearchForm(FlaskForm):
    """Form for searching cities"""
    search = StringField("search", validators=[InputRequired()])
    city_code = HiddenField("city_code", validators=[InputRequired()])
    city_name = HiddenField("city_name", validators=[InputRequired()])


class FilterForm(FlaskForm):
    """Form for filtering machine learning models"""

    type_ = SelectField("type", validators=[InputRequired()])
    area = FloatField("area", validators=[InputRequired()])
    floor_plan = SelectField("floor_plan")


class SignupForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[InputRequired()])
    email = StringField('E-mail', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[Length(min=6)])


class LoginForm(FlaskForm):
    """Login form"""

    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])


class LogoutForm(FlaskForm):
    """Logout form"""


class DeleteForm(FlaskForm):
    """Delete form"""


class EditQueryForm(FlaskForm):
    """Delete form"""
    comment = TextAreaField("Comment", validators=[
        InputRequired(), Length(max=23)])
