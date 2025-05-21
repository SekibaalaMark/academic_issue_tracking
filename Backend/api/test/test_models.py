from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import CustomUser

class CustomUserModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password123",
            role="student",
            staff_id_or_student_no=70000
        )

    def test_user_creation(self):
        """Test that a user is created successfully with correct defaults"""
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertEqual(self.user.role, "student")
        self.assertEqual(self.user.staff_id_or_student_no, 70000)
        self.assertFalse(self.user.is_email_verified)

    def test_str_representation(self):
        """Test the __str__ method returns username"""
        self.assertEqual(str(self.user), "testuser")

    def test_email_uniqueness(self):
        """Test that duplicate emails are not allowed"""
        with self.assertRaises(Exception):  # Can be IntegrityError or ValidationError
            CustomUser.objects.create_user(
                username="anotheruser",
                email="test@example.com",  # same as self.user
                password="anotherpass",
                role="lecturer",
                staff_id_or_student_no=990
            )

    def test_role_immutable_on_update(self):
        """Test that role cannot be changed after creation"""
        self.user.role = "lecturer"
        self.user.save()
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, "student")  # Should not have changed

    def test_username_uniqueness(self):
        """Test that duplicate usernames are not allowed"""
        with self.assertRaises(Exception):
            CustomUser.objects.create_user(
                username="testuser",  # duplicate
                email="unique@example.com",
                password="test1234",
                role="student",
                staff_id_or_student_no=60000
            )
