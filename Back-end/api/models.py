from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Custom User model
class CustomUser(AbstractUser):
    USER_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
        ('administrator', 'Administrator'),
    ]
    role = models.CharField(max_length=20, choices=USER_CHOICES, default='student')
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

# Department model
class Department(models.Model):
    DEPT_CHOICES = [
        ('computer_science', 'Computer Science Department'),
        ('networks', 'Networks Department'),
        ('information_systems', 'Information Systems'),
        ('information_technology', 'Information Technology'),
    ]
    name = models.CharField(max_length=50, choices=DEPT_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

# Issue model
class Issue(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    CATEGORY_CHOICES = [
        ('missing_marks', 'Missing Marks'),
        ('wrong_grading', 'Wrong Grading'),
        ('wrong_marks', 'Wrong Marks'),
        ('other', 'Other'),
    ]
    course_name = models.CharField(max_length=150, null=True)
    course_code = models.CharField(max_length=50, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    description = models.TextField()
    raised_by = models.ForeignKey(CustomUser, related_name='raised_issues', on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    assigned_to = models.ForeignKey(CustomUser, related_name='assigned_issues', on_delete=models.CASCADE, limit_choices_to={'role': 'lecturer'}, null=True, blank=True)
    registrar = models.ForeignKey(CustomUser, related_name='registrar_issues', on_delete=models.CASCADE, limit_choices_to={'role': 'registrar'}, null=True, blank=True)
    department = models.ForeignKey(Department, related_name='issues', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course_code} - {self.get_category_display()}"

# Notification model
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, related_name='notifications', on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - {'Read' if self.is_read else 'Unread'}"

# Audit Log model
class AuditLog(models.Model):
    user = models.ForeignKey(CustomUser, related_name='audit_logs', on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"AuditLog: {self.user.username} - {self.action} at {self.timestamp}"
