from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from api.models import CustomUser

class LecturerUsernameListViewTest(TestCase):

    def setUp(self):
        self.client = Client()

        # Create a lecturer user
        self.lecturer = CustomUser.objects.create_user(
            username='lecturer_user',
            password='password123',
            role='lecturer'
        )

        # Create a non-lecturer user
        self.student = CustomUser.objects.create_user(
            username='student_user',
            password='password123',
            role='student'
        )

        # Authenticated user (e.g. registrar) to access the view
        self.registrar = CustomUser.objects.create_user(
            username='registrar_user',
            password='password123',
            role='registrar'
        )
        self.client.login(username='registrar_user', password='password123')

        # URL for the view (make sure this name matches your urls.py)
        self.url = reverse('lecturer-username-list')  # update this name if different

    def test_authenticated_user_can_view_lecturer_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        usernames = [user['username'] for user in response.json()]
        self.assertIn('lecturer_user', usernames)
        self.assertNotIn('student_user', usernames)

    def test_unauthenticated_user_cannot_view_lecturer_list(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from api.models import Department, CustomUser

class DepartmentViewSetTest(TestCase):

    def setUp(self):
        self.client = Client()

        # Authenticated user (e.g., registrar)
        self.user = CustomUser.objects.create_user(
            username='registrar_user',
            password='password123',
            role='registrar'
        )
        self.client.login(username='registrar_user', password='password123')

        # Sample department
        self.department = Department.objects.create(name='Computer Science')

        # Base URL for viewset (update this if your urls.py uses a different name)
        self.list_url = reverse('department-list')  # typically comes from DefaultRouter
        self.detail_url = reverse('department-detail', kwargs={'pk': self.department.pk})

    def test_list_departments_authenticated(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_retrieve_single_department(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], 'Computer Science')

    def test_create_department(self):
        data = {'name': 'Mathematics'}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Department.objects.filter(name='Mathematics').exists())

    def test_update_department(self):
        data = {'name': 'Computer Engineering'}
        response = self.client.put(self.detail_url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.department.refresh_from_db()
        self.assertEqual(self.department.name, 'Computer Engineering')

    def test_delete_department(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Department.objects.filter(pk=self.department.pk).exists())

    def test_unauthenticated_access_denied(self):
        self.client.logout()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from api.models import CustomUser, Issue, Department, Programme

class IssueViewSetTest(TestCase):

    def setUp(self):
        self.client = Client()

        # Create department and programme for linking issues
        self.department = Department.objects.create(name="Science")
        self.programme = Programme.objects.create(name="Physics", department=self.department)

        # Student user (allowed to raise issues)
        self.student = CustomUser.objects.create_user(
            username='student1',
            password='password123',
            role='student'
        )

        # Lecturer user (should NOT be able to raise issues)
        self.lecturer = CustomUser.objects.create_user(
            username='lecturer1',
            password='password123',
            role='lecturer'
        )

        # Sample issue
        self.issue = Issue.objects.create(
            title='Wi-Fi not working',
            description='Wi-Fi is down in the lab',
            student=self.student,
            programme=self.programme
        )

        self.list_url = reverse('issue-list')  # from DefaultRouter
        self.detail_url = reverse('issue-detail', kwargs={'pk': self.issue.pk})

    def test_student_can_create_issue(self):
        self.client.login(username='student1', password='password123')
        data = {
            'title': 'Broken projector',
            'description': 'The projector in Room 5 is broken',
            'programme': self.programme.pk
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Issue.objects.count(), 2)

    def test_lecturer_cannot_create_issue(self):
        self.client.login(username='lecturer1', password='password123')
        data = {
            'title': 'Should not work',
            'description': 'Lecturers can’t raise issues',
            'programme': self.programme.pk
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('Only students can raise issues.', response.json().get('detail', ''))

    def test_authenticated_user_can_list_issues(self):
        self.client.login(username='student1', password='password123')
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_retrieve_single_issue(self):
        self.client.login(username='student1', password='password123')
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], 'Wi-Fi not working')

    def test_unauthenticated_access_denied(self):
        self.client.logout()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

