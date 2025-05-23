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




class TestLoginURL(SimpleTestCase):
    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func, login)


class TestLogoutURL(SimpleTestCase):
    def test_logout_url_resolves(self):
        url = reverse('logout')
        self.assertEqual(resolve(url).func, logout)




class TestFilterIssuesURL(SimpleTestCase):
    def test_filter_issues_url_resolves(self):
        url = reverse('filter_issues')
        self.assertEqual(resolve(url).func, filter_issues)





class TestVerifyEmailURL(SimpleTestCase):
    def test_verify_email_url_resolves(self):
        url = reverse('email-verification')
        self.assertEqual(resolve(url).func.view_class, VerifyEmailView)




class TestResendVerificationCodeURL(SimpleTestCase):
    def test_resend_verification_code_url_resolves(self):
        url = reverse('student-resend-code')
        self.assertEqual(resolve(url).func, resend_verification_code)



class TestRequestPasswordResetURL(SimpleTestCase):
    def test_request_password_reset_url_resolves(self):
        url = reverse('request-password-reset')
        self.assertEqual(resolve(url).func, request_password_reset)




class TestVerifyPasswordResetCodeURL(SimpleTestCase):
    def test_verify_password_reset_code_url_resolves(self):
        url = reverse('verify-password-reset-code')
        self.assertEqual(resolve(url).func, verify_password_reset_code)




class TestSetNewPasswordURL(SimpleTestCase):
    def test_set_new_password_url_resolves(self):
        url = reverse('set-new-password')
        self.assertEqual(resolve(url).func, set_new_password)




class TestRegistrarIssuesDashboardURL(SimpleTestCase):
    def test_registrar_issues_dashboard_url_resolves(self):
        url = reverse('registrar-issues-dashboard')
        self.assertEqual(resolve(url).func.view_class, RegistrarDashboardCountView)




class TestStudentIssuesDashboardURL(SimpleTestCase):
    def test_student_issues_dashboard_url_resolves(self):
        url = reverse('student-issues-dashboard')
        self.assertEqual(resolve(url).func.view_class, StudentDashboardCountView)




class TestLecturerIssuesDashboardURL(SimpleTestCase):
    def test_lecturer_issues_dashboard_url_resolves(self):
        url = reverse('lecturer-issues-dashboard')
        self.assertEqual(resolve(url).func.view_class, LecturerDashboardCountView)




class TestStudentProfileURL(SimpleTestCase):
    def test_student_profile_url_resolves(self):
        url = reverse('student-profile')
        self.assertEqual(resolve(url).func.view_class, StudentProfileView)




class TestLecturerProfileURL(SimpleTestCase):
    def test_lecturer_profile_url_resolves(self):
        url = reverse('lecturer-profile')
        self.assertEqual(resolve(url).func.view_class, LecturerProfileView)



class TestRegistrarProfileURL(SimpleTestCase):
    def test_registrar_profile_url_resolves(self):
        url = reverse('registrar-profile')
        self.assertEqual(resolve(url).func.view_class, RegistrarProfileView)



class TestRegistrarDashboardURL(SimpleTestCase):
    def test_registrar_dashboard_url_resolves(self):
        url = reverse('registrar-dashboard')
        self.assertEqual(resolve(url).func.view_class, RegistrarDashboardCountView)




class TestStudentDashboardURL(SimpleTestCase):
    def test_student_dashboard_url_resolves(self):
        url = reverse('student-dashboard')
        self.assertEqual(resolve(url).func.view_class, StudentDashboardCountView)




class TestLecturerDashboardURL(SimpleTestCase):
    def test_lecturer_dashboard_url_resolves(self):
        url = reverse('lecturer-dashboard')
        self.assertEqual(resolve(url).func.view_class, LecturerDashboardCountView)



from rest_framework_simplejwt.views import TokenObtainPairView

class TestTokenURL(SimpleTestCase):
    def test_token_url_resolves(self):
        url = reverse('get_token')
        self.assertEqual(resolve(url).func.view_class, TokenObtainPairView)



from rest_framework_simplejwt.views import TokenRefreshView

class TestTokenRefreshURL(SimpleTestCase):
    def test_token_refresh_url_resolves(self):
        url = reverse('refresh_token')
        self.assertEqual(resolve(url).func.view_class, TokenRefreshView)




class TestDRFAuthURLs(SimpleTestCase):
    def test_login_url_reverse(self):
        url = reverse('login')  # 'login' is provided by rest_framework.urls
        self.assertEqual(url, '/auth/login/')

    def test_logout_url_reverse(self):
        url = reverse('logout')  # 'logout' is provided by rest_framework.urls
        self.assertEqual(url, '/auth/logout/')
