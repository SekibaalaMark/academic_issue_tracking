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


from django.test import SimpleTestCase
from django.urls import reverse, resolve
from django.contrib.auth.views import LogoutView  # Adjust if it's a custom logout view

# If it's a custom function view, import it instead:
# from users.views import logout

class TestLogoutURL(SimpleTestCase):
    def test_logout_url_resolves(self):
        url = reverse('logout')
        self.assertEqual(resolve(url).func, logout)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestFilterIssuesURL(SimpleTestCase):
    def test_filter_issues_url_resolves(self):
        url = reverse('filter_issues')
        self.assertEqual(resolve(url).func, filter_issues)


from django.test import SimpleTestCase
from django.urls import reverse, resolve


class TestVerifyEmailURL(SimpleTestCase):
    def test_verify_email_url_resolves(self):
        url = reverse('email-verification')
        self.assertEqual(resolve(url).func.view_class, VerifyEmailView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestResendVerificationCodeURL(SimpleTestCase):
    def test_resend_verification_code_url_resolves(self):
        url = reverse('student-resend-code')
        self.assertEqual(resolve(url).func, resend_verification_code)


from django.test import SimpleTestCase
from django.urls import reverse, resolve


class TestRequestPasswordResetURL(SimpleTestCase):
    def test_request_password_reset_url_resolves(self):
        url = reverse('request-password-reset')
        self.assertEqual(resolve(url).func, request_password_reset)


from django.test import SimpleTestCase
from django.urls import reverse, resolve


class TestVerifyPasswordResetCodeURL(SimpleTestCase):
    def test_verify_password_reset_code_url_resolves(self):
        url = reverse('verify-password-reset-code')
        self.assertEqual(resolve(url).func, verify_password_reset_code)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestSetNewPasswordURL(SimpleTestCase):
    def test_set_new_password_url_resolves(self):
        url = reverse('set-new-password')
        self.assertEqual(resolve(url).func, set_new_password)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestRegistrarIssuesDashboardURL(SimpleTestCase):
    def test_registrar_issues_dashboard_url_resolves(self):
        url = reverse('registrar-issues-dashboard')
        self.assertEqual(resolve(url).func.view_class, RegistrarDashboardCountView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestStudentIssuesDashboardURL(SimpleTestCase):
    def test_student_issues_dashboard_url_resolves(self):
        url = reverse('student-issues-dashboard')
        self.assertEqual(resolve(url).func.view_class, StudentDashboardCountView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestLecturerIssuesDashboardURL(SimpleTestCase):
    def test_lecturer_issues_dashboard_url_resolves(self):
        url = reverse('lecturer-issues-dashboard')
        self.assertEqual(resolve(url).func.view_class, LecturerDashboardCountView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestStudentProfileURL(SimpleTestCase):
    def test_student_profile_url_resolves(self):
        url = reverse('student-profile')
        self.assertEqual(resolve(url).func.view_class, StudentProfileView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestLecturerProfileURL(SimpleTestCase):
    def test_lecturer_profile_url_resolves(self):
        url = reverse('lecturer-profile')
        self.assertEqual(resolve(url).func.view_class, LecturerProfileView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestRegistrarProfileURL(SimpleTestCase):
    def test_registrar_profile_url_resolves(self):
        url = reverse('registrar-profile')
        self.assertEqual(resolve(url).func.view_class, RegistrarProfileView)

from django.test import SimpleTestCase
from django.urls import reverse, resolve


class TestRegistrarDashboardURL(SimpleTestCase):
    def test_registrar_dashboard_url_resolves(self):
        url = reverse('registrar-dashboard')
        self.assertEqual(resolve(url).func.view_class, RegistrarDashboardCountView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestStudentDashboardURL(SimpleTestCase):
    def test_student_dashboard_url_resolves(self):
        url = reverse('student-dashboard')
        self.assertEqual(resolve(url).func.view_class, StudentDashboardCountView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve

class TestLecturerDashboardURL(SimpleTestCase):
    def test_lecturer_dashboard_url_resolves(self):
        url = reverse('lecturer-dashboard')
        self.assertEqual(resolve(url).func.view_class, LecturerDashboardCountView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve
from rest_framework_simplejwt.views import TokenObtainPairView

class TestTokenURL(SimpleTestCase):
    def test_token_url_resolves(self):
        url = reverse('get_token')
        self.assertEqual(resolve(url).func.view_class, TokenObtainPairView)


from django.test import SimpleTestCase
from django.urls import reverse, resolve
from rest_framework_simplejwt.views import TokenRefreshView

class TestTokenRefreshURL(SimpleTestCase):
    def test_token_refresh_url_resolves(self):
        url = reverse('refresh_token')
        self.assertEqual(resolve(url).func.view_class, TokenRefreshView)


from django.test import SimpleTestCase
from django.urls import reverse

class TestDRFAuthURLs(SimpleTestCase):
    def test_login_url_reverse(self):
        url = reverse('login')  # 'login' is provided by rest_framework.urls
        self.assertEqual(url, '/auth/login/')

    def test_logout_url_reverse(self):
        url = reverse('logout')  # 'logout' is provided by rest_framework.urls
        self.assertEqual(url, '/auth/logout/')
