from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

<<<<<<< HEAD
# Custom User model
=======


# Create your models here.

class Course_unit(models.Model):
    course_name = models.CharField(max_length=100)
    course_code=models.CharField(max_length=20)

    def __str__(self):
        return self.course_name

class Programme(models.Model):
    programme_name = models.CharField(max_length=110)
    course_unit=models.ManyToManyField(Course_unit,related_name="course_units")

    def __str__(self):
        return self.programme_name


>>>>>>> 5bc31813e975fadeeeb0a413842068577b92a8d7
class CustomUser(AbstractUser):
    USER_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
        ('administrator', 'Administrator'),
    ]
    role = models.CharField(max_length=20, choices=USER_CHOICES, default='student')
    email = models.EmailField(unique=True)
<<<<<<< HEAD
=======
    username=models.CharField(max_length=100,unique=True)
    programme = models.ForeignKey(Programme,related_name='programme',on_delete=models.CASCADE,null=True,blank=True)
>>>>>>> 5bc31813e975fadeeeb0a413842068577b92a8d7

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
<<<<<<< HEAD
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
=======
    CATEGORY_CHOICES = [('Missing_Marks','Missing marks'),
    ('Wrong_grading','wrong grading'),('wrong_marks','wrong marks'),('other','other')]

    #programme = models.ForeignKey('Programme',related_name='programme',on_delete=models.CASCADE)
    couse_name = models.CharField(max_length=150,null=True,help_text="course name")
    course_code = models.CharField(max_length=50,null=True,help_text="course code",)
    #name_of_lecturer = models.ForeignKey(User,related_name='lecturer_issues',on_delete=models.CASCADE,limit_choices_to={'role':"Lecturer"})
    category = models.CharField(max_length=100,choices=CATEGORY_CHOICES)
    description = models.TextField()
    attachment = models.ImageField(upload_to='issue_pics',null=True,blank=True)
    raised_by = models.ForeignKey(CustomUser, related_name='student_issues', on_delete=models.CASCADE,limit_choices_to={'role':'student'})
    #assigned_to = models.ForeignKey(User,related_name='lecture_issues',on_delete=models.CASCADE,limit_choices_to={'role':'Lecturer'})
    registrar= models.ForeignKey(CustomUser,related_name='registra_issues',on_delete=models.CASCADE,limit_choices_to={'role':'Registrar'})
    department = models.ForeignKey(Department,related_name='department_issues',on_delete=models.CASCADE)
    status = models.CharField(max_length=100,choices=STATUS)

>>>>>>> 5bc31813e975fadeeeb0a413842068577b92a8d7
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
<<<<<<< HEAD
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
=======
        return self.category
    class Meta:
        permissions=[
            ("report_issue","can report an issue"),
            ("assign_issue","can assign issue"),
        ]

>>>>>>> 5bc31813e975fadeeeb0a413842068577b92a8d7
