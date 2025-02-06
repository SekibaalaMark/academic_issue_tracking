from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.


class User(AbstractUser):
    USER_CHOICES =[
        ('student','Student'),
        ('Lecturer','Lecturer'),
        ('Registrar','Registrar'),
    ]
    role = models.CharField(max_length=100,choices=USER_CHOICES,default='student')


    '''groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',  # Custom related_name to avoid clash
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_permissions_set',  # Custom related_name to avoid clash
        blank=True
    )'''


    def __str__(self):
        return self.username


class Department(models.Model):
    DEPT_CHOICES = [
        ('computer_science','Computer Science Department'),
        ('networks','Networks Department'),
        ('information_systems','Information Systems')
    ]
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Issue(models.Model):
    STATUS=[
        ('pending','Pending'),
        ('resolved','Resolved'),
        ('in_progress','In progress'),
    ]
    title = models.CharField(max_length=100)
    description = models.TextField()
    raised_by = models.ForeignKey(User, related_name='issues', on_delete=models.CASCADE,limit_choices_to={'role':'student'})
    assigned_to = models.ForeignKey(User,related_name='lecture_issues',on_delete=models.CASCADE,limit_choices_to={'role':'Lecturer'})
    department = models.ForeignKey(Department,related_name='department_issues',on_delete=models.CASCADE)
    status = models.CharField(max_length=100,choices=STATUS)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title