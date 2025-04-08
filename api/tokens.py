from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from django.core.mail import send_mail
from django.conf import settings



def generate_verification_token(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    return uid, token



def send_verification_email(user):
    uid, token = generate_verification_token(user)
    verification_link = f"http://yourdomain.com/verify-email/{uid}/{token}/"
    
    subject = "Verify Your Email"
    message = f"Click the link to verify your email: {verification_link}"
    send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])