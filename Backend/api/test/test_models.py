from django.test import TestCase
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import *

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





class IssueModelTest(TestCase):

    def setUp(self):
        # Create users for student, lecturer, and registrar
        self.student = CustomUser.objects.create_user(
            username="student1",
            email="student@example.com",
            password="pass1234",
            role="student",
            staff_id_or_student_no=50000
        )

        self.lecturer = CustomUser.objects.create_user(
            username="lecturer1",
            email="lecturer@example.com",
            password="pass1234",
            role="lecturer",
            staff_id_or_student_no=880
        )

        self.registrar = CustomUser.objects.create_user(
            username="registrar1",
            email="registrar@example.com",
            password="pass1234",
            role="registrar",
            staff_id_or_student_no=39
        )

    def test_issue_creation(self):
        issue = Issue.objects.create(
            student=self.student,
            programme="software_engineering",
            course_name="Software Engineering 101",
            course_code="SE101",
            year_of_study="year_1",
            lecturer=self.lecturer,
            category="Missing_Marks",
            description="Marks not added for SE101 coursework",
            registrar=self.registrar,
            department="computer_science"
        )

        self.assertEqual(issue.student, self.student)
        self.assertEqual(issue.lecturer, self.lecturer)
        self.assertEqual(issue.registrar, self.registrar)
        self.assertEqual(issue.status, "pending")  # default status
        self.assertEqual(str(issue), "Missing_Marks")  # __str__ returns category
        self.assertIsNone(issue.attachment.name)  # should be None since we didn’t provide it

    def test_optional_fields(self):
        # Creating an issue without lecturer and attachment
        issue = Issue.objects.create(
            student=self.student,
            programme="computer_science",
            course_name="CS101",
            course_code="CS101",
            year_of_study="year_2",
            category="other",
            description="General complaint",
            registrar=self.registrar,
            department="information_technology"
        )
        self.assertIsNone(issue.lecturer)
        self.assertIsNone(issue.attachment.name)
        self.assertEqual(issue.status, "pending")
