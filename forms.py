from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, SelectField, HiddenField, PasswordField, TextAreaField
from wtforms.validators import InputRequired, Email, Length, DataRequired, ValidationError

from models import db, User


class SearchForm(FlaskForm):
    """Form for searching cities"""
    search = StringField("search")
    city_code = HiddenField("city_code", validators=[InputRequired()])
    city_name = HiddenField("city_name", validators=[InputRequired()])


class FilterForm(FlaskForm):
    """Form for filtering machine learning models"""

    type_ = SelectField("type", validators=[InputRequired()])
    area = IntegerField("area", validators=[
                        DataRequired("Please input a valid number.")])
    floor_plan = SelectField("floor_plan")


class SignupForm(FlaskForm):
    """Form for adding users."""

    def validate_username(form, field):
        user = User.query.filter_by(username=field.data).first()
        if user:
            raise ValidationError("Username already taken.")

    def validate_email(form, field):
        user = User.query.filter_by(email=field.data).first()
        if user:
            raise ValidationError("Email already taken.")

    username = StringField('Username', validators=[
                           DataRequired(
                               "Username is required.")])
    email = StringField('E-mail', validators=[DataRequired(
        "Email is required."), Email()])
    password = PasswordField('Password', validators=[DataRequired(
        "Password must be at least 6 characters long."), Length(min=6)])


class LoginForm(FlaskForm):
    """Login form"""

    username = StringField('Username', validators=[DataRequired(
        "Username is required.")])
    password = PasswordField('Password', validators=[DataRequired(
        "Password must be at least 6 characters long."), Length(min=6)])


class EditQueryForm(FlaskForm):
    """Delete form"""
    comment = TextAreaField("Comment", validators=[
        InputRequired(), Length(max=23)])


class BlankForm(FlaskForm):
    """Blank form"""
