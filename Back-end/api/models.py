from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from random import randint
from django.utils import timezone




# Create your models here.

class Course_unit(models.Model):
    course_name = models.CharField(max_length=100)
    course_code=models.CharField(max_length=20)

    def __str__(self):
        return self.course_name

class Programme(models.Model):
    PROGRAMME_CHOICES = [
        ('computer_science','Bachelor of Science in Computer Science'),
        ('software_engineering','Bachelor of Science in Software Engineering'),
        ('BIST','Bachelor Information Systems and Technology'),
        ('BLIS','Bachelor of Library and Information Sciences')
    ]
    programme_name = models.CharField(max_length=110,choices=PROGRAMME_CHOICES)
    course_unit=models.ManyToManyField(Course_unit,related_name="course_units")

    def __str__(self):
        return self.programme_name

class CustomUser(AbstractUser):
    USER_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
    ]

    
    role = models.CharField(max_length=20, choices=USER_CHOICES, default='student')
    staff_id_or_student_no = models.IntegerField(default=0)
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    username=models.CharField(max_length=100,unique=True)
    programme = models.ForeignKey(Programme,related_name='programme',on_delete=models.CASCADE,null=True,blank=True)
    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        # If the user already exists, prevent changes to the role field
        if self.pk is not None:  # Check if the user is being updated
            original_user = CustomUser .objects.get(pk=self.pk)
            if original_user.role != self.role:
                self.role = original_user.role  # Revert to the original role
        super().save(*args, **kwargs)


        
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
        return self.name

# Issue model
class Issue(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    CATEGORY_CHOICES = [('Missing_Marks','Missing marks'),
    ('Wrong_grading','wrong grading'),('wrong_marks','wrong marks'),('other','other')]

    YEAR_CHOICES = [
        ('year_1','Year 1'),
        ('year_2','Year 2'),
        ('year_3','Year 3'),
        ('year_4','Year 4'),
        ('year_5','Year 5')
    ]
    student = models.ForeignKey(CustomUser, related_name='student_issues', on_delete=models.CASCADE,limit_choices_to={'role':'student'})
    programme = models.ForeignKey(Programme,related_name='programmes',on_delete=models.CASCADE,null=True,blank=True)
    couse_name = models.CharField(max_length=150,null=True,help_text="course name")
    course_code = models.CharField(max_length=50,null=True,help_text="course code")
    year_of_study = models.CharField(max_length=50,choices=YEAR_CHOICES,help_text="your year of study")
    lecturer = models.ForeignKey(CustomUser,related_name='lecturer_issues',on_delete=models.CASCADE,limit_choices_to={'role':"lecturer"},null=True,blank=True)
    category = models.CharField(max_length=100,choices=CATEGORY_CHOICES)
    description = models.TextField()
    attachment = models.ImageField(upload_to='issue_pics',null=True,blank=True)
    #assigned_to = models.ForeignKey(CustomUser,related_name='lecture_issues',on_delete=models.CASCADE,limit_choices_to={'role':'Lecturer'},null=True,blank=True)
    registrar= models.ForeignKey(CustomUser,related_name='registra_issues',on_delete=models.CASCADE,limit_choices_to={'role':'registrar'})
    department = models.ForeignKey(Department,related_name='department_issues',on_delete=models.CASCADE)
    status = models.CharField(max_length=100,choices=STATUS_CHOICES,default='pending')
    #token = models.CharField(max_length=70)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category

'''
class Verification_code(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    code = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    def is_verification_code_expired(self):
        expiration_time = self.created_at + timezone.timedelta(minutes=10)
        return timezone.now() > expiration_time
    
    @classmethod
    def resend_verification_code(cls,user):
        try:
            cls.objects.filter(user = user).delete()
    
            new_verification_code = randint(10000,99999)
            verification = cls.objects.create(user = user,code= new_verification_code)
        except Exception as e:
            return {'Error':e}

        try:
            subject = 'Email verification Code Resend..'
            message = f"Hello, your Verification code that has been resent is: {new_verification_code}"
            receipient_email= user.email
            send_mail(subject,message,settings.EMAIL_HOST_USER,[receipient_email],fail_silently=False)
        except Exception as e:
            return {'Error':e}
        
        return {'Message':'Email verification code resent successfully...'}
        
    def _str_(self):
        return f'Verification for {self.user.username} --- {self.code}'
'''



class VerificationCode(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    code = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_code_verified = models.BooleanField(default=False)
    
    def is_verification_code_expired(self):
        expiration_time = self.created_at + timezone.timedelta(minutes=15)
        return timezone.now() > expiration_time
        
    @classmethod
    def resend_verification_code(cls,user):
        try:
            cls.objects.filter(user = user).delete()
    
            new_verification_code = randint(10000,99999)
            verification = cls.objects.create(user = user,code= new_verification_code)
        except Exception as e:
            return {'Error':e}

        try:
            subject = 'Email verification Code Resend..'
            message = f"Hello, your Verification code that has been resent is: {new_verification_code}"
            receipient_email= user.email
            send_mail(subject,message,settings.EMAIL_HOST_USER,[receipient_email],fail_silently=False)
        except Exception as e:
            return {'Error':e}
        
        return {'Message':'Email verification code resent successfully...'}
    
    def _str_(self):
        return f'Verification for {self.user.username} --- {self.code}'


'''
class RegistrationToken(models.Model):
    USER_CHOICES = [
    ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
    ]
    role = models.CharField(max_length=20, choices = USER_CHOICES)
    email = models.EmailField(unique=True)
    token = models.CharField(default=shortuuid.uuid,max_length=100)'
    '''