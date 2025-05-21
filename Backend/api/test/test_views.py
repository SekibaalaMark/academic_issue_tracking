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
