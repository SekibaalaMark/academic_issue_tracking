from django.test import SimpleTestCase
from django.urls import reverse, resolve
from api.views import *

class TestLecturerUsernameListURL(SimpleTestCase):
    def test_lecturer_username_list_url_resolves(self):
        url = reverse('lecturer-username-list')
        self.assertEqual(resolve(url).func.view_class, LecturerUsernameListView)

class TestUserRegistrationURL(SimpleTestCase):
    def test_user_registration_url_resolves(self):
        url = reverse('register_users')
        self.assertEqual(resolve(url).func.view_class, UserRegistrationView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve
from django.contrib.auth.views import LoginView  # or adjust if you're using a custom login view

# If `login` is your custom view, import it instead:
# from users.views import login

class TestLoginURL(SimpleTestCase):
    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func, login)
