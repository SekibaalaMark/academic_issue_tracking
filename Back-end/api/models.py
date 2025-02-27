from django.db import models
from django.contrib.auth.models import AbstractUser



# Create your models here.


class CustomUser(AbstractUser):
    USER_CHOICES =[
        ('student','Student'),
        ('Lecturer','Lecturer'),
        ('Registrar','Registrar'),
    ]
    role = models.CharField(max_length=100,choices=USER_CHOICES,default='student')
    email = models.EmailField(unique=True)
    username=models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.username


class Department(models.Model):
    DEPT_CHOICES = [
        ('computer_science','Computer Science Department'),
        ('networks','Networks Department'),
        ('information_systems','Information Systems'),
        ('information_technology','Information Technology'),
    ]
    name = models.CharField(max_length=100,choices=DEPT_CHOICES)

    def __str__(self):
        return self.name


class Issue(models.Model):
    STATUS=[
        ('pending','Pending'),
        ('resolved','Resolved'),
        ('in_progress','In progress'),
    ]
    CATEGORY_CHOICES = [('Missing_Marks','Missing marks'),
    ('Wrong_grading','wrong grading'),('wrong_marks','wrong marks'),('other','other')]

    couse_name = models.CharField(max_length=150, null = True)
    course_code = models.CharField(max_length=50,null=True)
    #name_of_lecturer = models.ForeignKey(User,related_name='lecturer_issues',on_delete=models.CASCADE,limit_choices_to={'role':"Lecturer"})
    category = models.CharField(max_length=100,choices=CATEGORY_CHOICES,default='other')
    description = models.TextField()
    raised_by = models.ForeignKey(CustomUser, related_name='issues', on_delete=models.CASCADE,limit_choices_to={'role':'student'})
    #assigned_to = models.ForeignKey(User,related_name='lecture_issues',on_delete=models.CASCADE,limit_choices_to={'role':'Lecturer'})
    registrar= models.ForeignKey(CustomUser,related_name='registra_issues',on_delete=models.CASCADE,limit_choices_to={'role':'Registrar'},null=True)
    department = models.ForeignKey(Department,related_name='department_issues',on_delete=models.CASCADE)
    status = models.CharField(max_length=100,choices=STATUS)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category