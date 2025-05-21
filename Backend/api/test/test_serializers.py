from django.test import TestCase
from api.serializers import DepartmentSerializer, ProgrammeSerializer, UserSerializer
from api.models import *
from api.serializers import *
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime
from io import BytesIO
from rest_framework.exceptions import ValidationError



class DepartmentSerializerTest(TestCase):
    def test_department_serialization(self):
        dept = Department.objects.create(name="computer_science")  # use valid choice key
        serializer = DepartmentSerializer(dept)
        self.assertEqual(serializer.data['name'], "computer_science")

    def test_department_deserialization(self):
        data = {'name': 'computer_science'}  # valid DEPT_CHOICES key
        serializer = DepartmentSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        dept = serializer.save()
        self.assertEqual(dept.name, 'computer_science')

    def test_department_invalid_choice(self):
        data = {'name': 'invalid_department'}
        serializer = DepartmentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

class ProgrammeSerializerTest(TestCase):
    def test_programme_serialization(self):
        programme = Programme.objects.create(programme_name='computer_science')  # valid PROGRAMME_CHOICES key
        serializer = ProgrammeSerializer(programme)
        self.assertEqual(serializer.data['programme_name'], 'computer_science')

    def test_programme_deserialization(self):
        data = {'programme_name': 'software_engineering'}  # valid PROGRAMME_CHOICES key
        serializer = ProgrammeSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        programme = serializer.save()
        self.assertEqual(programme.programme_name, 'software_engineering')

    def test_programme_invalid_choice(self):
        data = {'programme_name': 'invalid_programme'}
        serializer = ProgrammeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('programme_name', serializer.errors)

class UserSerializerTest(TestCase):
    def test_user_serialization(self):
        user = CustomUser.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="pass1234",
            role="student",
            staff_id_or_student_no=40000
        )
        serializer = UserSerializer(user)
        data = serializer.data
        self.assertEqual(data['username'], "user1")
        self.assertEqual(data['email'], "user1@example.com")
        self.assertEqual(data['role'], "student")
        self.assertNotIn('password', data)  # password should not be serialized (write_only)

    def test_user_deserialization_with_password(self):
        data = {
            "username": "user2",
            "email": "user2@example.com",
            "password": "newpass123",
            "role": "lecturer",
            "first_name": "First",
            "last_name": "Last"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.username, "user2")
        #self.assertTrue(user.check_password("newpass123"))  # password saved correctly

    def test_user_invalid_role(self):
        data = {
            "username": "user3",
            "email": "user3@example.com",
            "password": "pass123",
            "role": "invalid_role"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('role', serializer.errors)





class LecturerUsernameSerializerTest(TestCase):
    def setUp(self):
        self.lecturer = CustomUser.objects.create_user(
            username="lecturer001",
            email="lecturer@example.com",
            password="pass1234",
            role="lecturer",
            staff_id_or_student_no=770
        )

    def test_lecturer_username_serialization(self):
        serializer = LecturerUsernameSerializer(self.lecturer)
        self.assertEqual(serializer.data, {'username': 'lecturer001'})

    def test_lecturer_username_deserialization(self):
        data = {'username': 'lecturer002'}
        serializer = LecturerUsernameSerializer(instance=self.lecturer, data=data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_lecturer = serializer.save()
        self.assertEqual(updated_lecturer.username, 'lecturer002')



class StudentDashboardCountSerializerTest(TestCase):
    
    def test_valid_student_dashboard_data(self):
        data = {
            "total_issues": 12,
            "pending_count": 5,
            "in_progress_count": 4,
            "resolved_count": 3
        }
        serializer = StudentDashboardCountSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['total_issues'], 12)
        self.assertEqual(serializer.validated_data['pending_count'], 5)
        self.assertEqual(serializer.validated_data['in_progress_count'], 4)
        self.assertEqual(serializer.validated_data['resolved_count'], 3)

    def test_missing_required_field(self):
        data = {
            "total_issues": 10,
            "pending_count": 4,
            # Missing in_progress_count
            "resolved_count": 3
        }
        serializer = StudentDashboardCountSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('in_progress_count', serializer.errors)

    def test_invalid_data_type(self):
        data = {
            "total_issues": "twelve",  # should be int
            "pending_count": 4,
            "in_progress_count": 3,
            "resolved_count": 5
        }
        serializer = StudentDashboardCountSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('total_issues', serializer.errors)


class LecturerDashboardCountSerializerTest(TestCase):
    
    def test_valid_lecturer_dashboard_data(self):
        data = {
            "total_assigned": 8,
            "in_progress_count": 5,
            "resolved_count": 3
        }
        serializer = LecturerDashboardCountSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['total_assigned'], 8)
        self.assertEqual(serializer.validated_data['in_progress_count'], 5)
        self.assertEqual(serializer.validated_data['resolved_count'], 3)

    def test_missing_required_field(self):
        data = {
            "total_assigned": 10,
            "resolved_count": 4  # Missing in_progress_count
        }
        serializer = LecturerDashboardCountSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('in_progress_count', serializer.errors)

    def test_invalid_data_type(self):
        data = {
            "total_assigned": 10,
            "in_progress_count": "five",  # invalid type
            "resolved_count": 2
        }
        serializer = LecturerDashboardCountSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('in_progress_count', serializer.errors)

from django.test import TestCase
from api.serializers import RegistrarDashboardCountSerializer

class RegistrarDashboardCountSerializerTest(TestCase):

    def test_valid_registrar_dashboard_data(self):
        data = {
            "total_issues": 12,
            "category_counts": {
                "Network": 4,
                "System": 5,
                "Hardware": 3
            },
            "status_counts": {
                "Pending": 6,
                "In Progress": 3,
                "Resolved": 3
            }
        }
        serializer = RegistrarDashboardCountSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['total_issues'], 12)
        self.assertIn('category_counts', serializer.validated_data)
        self.assertIn('status_counts', serializer.validated_data)

    def test_missing_required_field(self):
        data = {
            "total_issues": 10,
            "category_counts": {"Software": 4}
            # Missing status_counts
        }
        serializer = RegistrarDashboardCountSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('status_counts', serializer.errors)

    def test_invalid_data_type(self):
        data = {
            "total_issues": "ten",  # Should be int
            "category_counts": ["Network", "Hardware"],  # Should be dict
            "status_counts": {"Pending": 2}
        }
        serializer = RegistrarDashboardCountSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('total_issues', serializer.errors)
        self.assertIn('category_counts', serializer.errors)




class IssueSerializerTest(TestCase):
    def setUp(self):
        self.registrar = CustomUser.objects.create_user(
            username='registrar1',
            email='registrar@example.com',
            password='testpass123',
            role='registrar',
            staff_id_or_student_no=1001
        )
        self.student = CustomUser.objects.create_user(
            username='student1',
            email='student@example.com',
            password='testpass123',
            role='student',
            staff_id_or_student_no=2001
        )
        self.lecturer = CustomUser.objects.create_user(
            username='lecturer1',
            email='lecturer@example.com',
            password='testpass123',
            role='lecturer',
            staff_id_or_student_no=3001
        )
        self.department = Department.objects.create(name="computer_science")
        self.programme = Programme.objects.create(programme_name="computer_science")
        self.issue = Issue.objects.create(
            student=self.student,
            lecturer=self.lecturer,
            registrar=self.registrar,
            status="pending",
            department=self.department,
            description="Issue with system access",
            category="Network",
            year_of_study="Year 2",
            course_code="CSC2104",
            course_name="Operating Systems",
            programme=self.programme
        )

    def test_issue_serialization(self):
        serializer = IssueSerializer(self.issue)
        data = serializer.data
        self.assertEqual(data['status'], "pending")
        self.assertEqual(data['description'], "Issue with system access")
        self.assertEqual(data['course_code'], "CSC2104")
        self.assertIn('student', data)
        self.assertIn('lecturer', data)
        self.assertIn('registrar', data)
        self.assertEqual(data['student']['username'], self.student.username)
        self.assertEqual(data['lecturer']['username'], self.lecturer.username)
        self.assertEqual(data['registrar']['username'], self.registrar.username)

    def test_issue_missing_required_fields(self):
        invalid_data = {
            "status": "pending",  # missing student, registrar, lecturer, department, etc.
        }
        serializer = IssueSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("department", serializer.errors)
        self.assertIn("description", serializer.errors)
        self.assertIn("category", serializer.errors)

    def test_read_only_fields(self):
        serializer = IssueSerializer(self.issue)
        for field in IssueSerializer.Meta.read_only_fields:
            self.assertIn(field, serializer.data)



from django.test import TestCase
from api.models import CustomUser, Issue
from api.serializers import AssignIssueSerializer

class AssignIssueSerializerTest(TestCase):

    def setUp(self):
        # Create users for roles
        self.registrar = CustomUser.objects.create_user(
            username='registrar1',
            email='registrar1@example.com',
            password='testpass123',
            role='registrar'
        )
        self.student = CustomUser.objects.create_user(
            username='student1',
            email='student1@example.com',
            password='testpass123',
            role='student'
        )
        self.lecturer = CustomUser.objects.create_user(
            username='lecturer1',
            email='lecturer1@example.com',
            password='testpass123',
            role='lecturer'
        )
        self.non_lecturer = CustomUser.objects.create_user(
            username='nonlecturer',
            email='nonlecturer@example.com',
            password='testpass123',
            role='student'  # deliberately not lecturer
        )

        # Create an Issue without lecturer assigned
        self.issue = Issue.objects.create(
            student=self.student,
            programme='computer_science',
            course_name='Intro to CS',
            course_code='CS101',
            year_of_study='year_1',
            category='Missing_Marks',
            description='Missing marks in exam',
            registrar=self.registrar,
            department='computer_science',
            status='pending'
        )

    def test_assign_lecturer_valid(self):
        data = {'lecturer': self.lecturer.username}
        serializer = AssignIssueSerializer(instance=self.issue, data=data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_issue = serializer.save()
        self.assertEqual(updated_issue.lecturer, self.lecturer)
        self.assertEqual(updated_issue.status, 'in_progress')


    def test_assign_lecturer_missing(self):
        # lecturer is required, so empty or null should be invalid
        data = {'lecturer': None}
        serializer = AssignIssueSerializer(instance=self.issue, data=data, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('lecturer', serializer.errors)





class CreateIssueSerializerTest(TestCase):
    def setUp(self):
        self.registrar = CustomUser.objects.create_user(
            username='registrar1',
            role='registrar',
            email='reg@example.com',
            password='pass1234'
        )
        self.student = CustomUser.objects.create_user(
            username='reg1',
            role='student',
            email='re@example.com',
            password='pass1234'
        )
        self.valid_data = {
            'department': 'computer_science',
            'registrar': self.registrar.username,
            'description': 'Test issue description',
            'category': 'Missing_Marks',
            'year_of_study': 'year_2',
            'course_code': 'CS101',
            'course_name': 'Intro to CS',
            'programme': 'computer_science',
            'student':self.student.username,
        }

    def test_valid_serializer_creates_issue(self):
        serializer = CreateIssueSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        issue = serializer.save()
        self.assertEqual(issue.registrar, self.registrar)
        self.assertEqual(issue.department, self.valid_data['department'])
        self.assertEqual(issue.status, 'pending')  # default status
        self.assertIsNone(issue.student)  # student not set here

    def test_invalid_registrar_username_raises_validation_error(self):
        invalid_data = self.valid_data.copy()
        invalid_data['registrar'] = 'nonexistent_user'
        serializer = CreateIssueSerializer(data=invalid_data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_registrar_with_wrong_role_raises_validation_error(self):
        # Create a user with role other than registrar
        non_registrar = CustomUser.objects.create_user(
            username='wrongrole',
            role='student',
            email='student@example.com',
            password='pass1234'
        )
        invalid_data = self.valid_data.copy()
        invalid_data['registrar'] = non_registrar.username
        serializer = CreateIssueSerializer(data=invalid_data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)



class LoginSerializerTest(TestCase):

    def test_serializer_valid_data(self):
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_missing_username(self):
        data = {
            'password': 'testpass123'
        }
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_serializer_missing_password(self):
        data = {
            'username': 'testuser',
        }
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

    def test_password_write_only(self):
        data = {
            'username': 'testuser',
            'password': 'secretpass'
        }
        serializer = LoginSerializer(data=data)
        serializer.is_valid()
        self.assertNotIn('password', serializer.data)



class VerifyEmailSerializerTest(TestCase):

    def test_serializer_valid_data(self):
        data = {
            'code': 123456,
            'email': 'user@example.com'
        }
        serializer = VerifyEmailSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_missing_code(self):
        data = {
            'email': 'user@example.com'
        }
        serializer = VerifyEmailSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)

    def test_serializer_missing_email(self):
        data = {
            'code': 123456
        }
        serializer = VerifyEmailSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_serializer_invalid_email_format(self):
        data = {
            'code': 123456,
            'email': 'invalid-email'
        }
        serializer = VerifyEmailSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_serializer_invalid_code_type(self):
        data = {
            'code': 'abc123',
            'email': 'user@example.com'
        }
        serializer = VerifyEmailSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)



class ResendVerificationCodeSerializerTest(TestCase):

    def test_valid_email(self):
        data = {
            'email': 'user@example.com'
        }
        serializer = ResendVerificationCodeSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_missing_email(self):
        data = {}
        serializer = ResendVerificationCodeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_invalid_email_format(self):
        data = {
            'email': 'invalid-email'
        }
        serializer = ResendVerificationCodeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)



class PasswordResetRequestSerializerTest(TestCase):

    def test_valid_email(self):
        data = {
            'email': 'user@example.com'
        }
        serializer = PasswordResetRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_missing_email(self):
        data = {}
        serializer = PasswordResetRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_invalid_email_format(self):
        data = {
            'email': 'not-an-email'
        }
        serializer = PasswordResetRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)



class VerifyPasswordResetCodeSerializerTest(TestCase):

    def test_valid_data(self):
        data = {
            'email': 'user@example.com',
            'code': 123456
        }
        serializer = VerifyPasswordResetCodeSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_missing_email(self):
        data = {
            'code': 123456
        }
        serializer = VerifyPasswordResetCodeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_missing_code(self):
        data = {
            'email': 'user@example.com'
        }
        serializer = VerifyPasswordResetCodeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)

    def test_invalid_email_format(self):
        data = {
            'email': 'not-an-email',
            'code': 123456
        }
        serializer = VerifyPasswordResetCodeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_non_integer_code(self):
        data = {
            'email': 'user@example.com',
            'code': 'not-a-number'
        }
        serializer = VerifyPasswordResetCodeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)
