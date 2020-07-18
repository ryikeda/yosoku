import os
from unittest import TestCase
from models import db, User
from sqlalchemy import exc
from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///yosoku-test'))
db.create_all()


class UserModelTestCase(TestCase):
    """Tests user model"""

    def setUp(self):
        """Create test client"""
        db.drop_all()
        db.create_all()

        u = User.signup("test", "test@test.com", "password")
        uid = 111
        u.id = uid

        u2 = User.signup("test2", "test2@test.com", "password")
        uid2 = 222
        u2.id = uid2

        self.u = User.query.get(uid)
        self.u2 = User.query.get(uid2)
        self.uid = uid
        self.uid2 = uid2

        self.client = app.test_client()

    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res

    def test_user_signup(self):
        """Test if the user is created"""

        user = self.u
        user2 = self.u2

        self.assertEqual(user.username, "test")
        self.assertEqual(user.email, "test@test.com")
        self.assertNotEqual(user.password, "password")
        self.assertTrue(user.password.startswith("$2b$"))

        self.assertEqual(user2.username, "test2")
        self.assertEqual(user2.email, "test2@test.com")
        self.assertNotEqual(user2.password, "password")
        self.assertTrue(user2.password.startswith("$2b$"))

    def test_invalid_username_signup(self):
        invalid_usermame = User.signup(
            None, "testinvalidusername@test.com", "password")

        with self.assertRaises(exc.IntegrityError) as context:
            db.session.commit()

    def test_invalid_email_signup(self):
        invalid_email = User.signup(
            "invalidemailsignup", None, "password")

        with self.assertRaises(exc.IntegrityError) as context:
            db.session.commit()

    def test_invalid_password_signup(self):

        with self.assertRaises(ValueError) as context:
            invalid_password = User.signup(
                "invalidpasswordsignup", "invalidpasswordsignup@test.com", None)

    def test_user_login(self):
        """Test if user is being authenticated"""

        user = User.authenticate("test", "password")
        self.assertIsNotNone(user)
        self.assertEqual(user.id, self.u.id)

    def test_invalid_username_login(self):
        invalid_usermame = User.authenticate("badusername", "password")
        self.assertFalse(invalid_usermame)

    def test_invalid_password_login(self):
        invalid_password = User.authenticate("test", "badpassword")
        self.assertFalse(invalid_password)
