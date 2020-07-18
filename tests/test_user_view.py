import os
from unittest import TestCase
from models import db, User, UserQuery
from app import app, CURR_USER_KEY


app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///yosoku-test'))
db.create_all()

app.config['WTF_CSRF_ENABLED'] = False


class UserViewTestCase(TestCase):
    """Test view functions for user"""

    def setUp(self):
        """Create test client"""
        db.drop_all()
        db.create_all()

        self.create_users()

        self.client = app.test_client()

    def create_users(self):
        """Create users"""
        self.user = User.signup("user", "user@test.com", "password")
        self.user_id = 1
        self.user.id = self.user_id

        self.user2 = User.signup("user2", "user2@test.com", "password")
        self.user2_id = 2
        self.user2.id = self.user2_id
        db.session.commit()

    def setup_table(self):
        query = UserQuery(user_id=1, location="location1", type_="type1", area=100,
                          layout="layout1", price_estimate="price1", comment="comment1")

        db.session.add(query)
        db.session.commit()

    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res

    def test_results_table(self):
        """Test if correct table is shown for not logged in user"""
        self.setup_table()

        with self.client as c:
            resp = c.get("/results")
            self.assertEqual(resp.status_code, 200)
            self.assertIn("location1", str(resp.data))
            self.assertIn("type1", str(resp.data))
            self.assertIn("100", str(resp.data))
            self.assertIn("layout1", str(resp.data))
            self.assertNotIn("comment1", str(resp.data))

    def test_results_table_logged_user(self):
        """Test if correct table is shown for logged in user"""

        query = UserQuery(user_id=2, location="location2", type_="type2", area=200,
                          layout="layout2", price_estimate="price2", comment="comment2")
        db.session.add(query)
        db.session.commit()

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.user2_id

            resp = c.get("/results")
            self.assertEqual(resp.status_code, 200)
            self.assertIn("location2", str(resp.data))
            self.assertIn("type2", str(resp.data))
            self.assertIn("200", str(resp.data))
            self.assertIn("layout2", str(resp.data))
            self.assertIn("comment2", str(resp.data))
