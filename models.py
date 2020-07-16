from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = SQLAlchemy()


def connect_db(app):
    """Connect this database to provided Flask app.
    """
    db.app = app
    db.init_app(app)


class User(db.Model):
    """User in the system"""

    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    @classmethod
    def signup(cls, username, email, password):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            email=email,
            password=hashed_pwd
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False


class Query(db.Model):
    __tablename__ = "queries"

    city_code = db.Column(db.Text, primary_key=True)
    model = db.Column(db.PickleType, nullable=False)


class UserQuery(db.Model):
    __tablename__ = "users_queries"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.id", ondelete="cascade"))
    location = db.Column(db.Text, nullable=False)
    type_ = db.Column(db.Text, nullable=False)
    area = db.Column(db.Integer, nullable=False)
    layout = db.Column(db.Text)
    price_estimate = db.Column(db.Text, nullable=False)
    comment = db.Column(db.Text)
