from flask_sqlalchemy import SQLAlchemy

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

class Query(db.Model):
  __tablename__ = "queries"

  city_code = db.Column(db.Text, primary_key=True)
  model = db.Column(db.PickleType, nullable= False)

class UserQuery(db.Model):
  __tablename__ = "users_queries"

  id = db.Column(
      db.Integer,
      primary_key=True,
  ) 

  user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="cascade"))
  query_id = db.Column(db.Text, db.ForeignKey("queries.city_code", ondelete="cascade"))
