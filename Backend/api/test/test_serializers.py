from django.test import TestCase
from api.serializers import DepartmentSerializer, ProgrammeSerializer, UserSerializer
from api.models import *
from api.serializers import *



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
