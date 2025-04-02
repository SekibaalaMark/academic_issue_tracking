from rest_framework.serializers import ModelSerializer
from . models import *
from rest_framework import serializers

STUDENT_IDENTIFICATION_NUMBERS=[0,111,222,333,444,555,1000,2000,3000]
REGISTRA_IDS =[20,30,40,50,60]
LECTURE_IDS =[11,22,33,44,55]


class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ProgrammeSerializer(ModelSerializer):
    class Meta:
        model = Programme
        fields = '__all__'

'''class CourseUnitSerializer(ModelSerializer):
    class Meta:
        model = Course_unit
        fields = '__all__' '''

class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','first_name','last_name',"email","role","email","username"]
        extra_kwargs = {"password":{"write_only":True}}

    '''def create(self,validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user'''

class IssueSerializer(ModelSerializer):
    programme = ProgrammeSerializer()
    department =DepartmentSerializer()
    registrar = UserSerializer()
    student = UserSerializer()
    lecturer = UserSerializer()
    class Meta:
        model= Issue
        fields = ['id','last_updated','created_at','status','department','registrar','student','attachment',
                  'description','category','year_of_study','course_code','course_name','programme','lecturer']
        read_only_fields = ['student', 'lecturer', 'created_at', 'last_updated']


'''
class CreateIssueSerializer(ModelSerializer):
    programme = ProgrammeSerializer()
    department =DepartmentSerializer()
    registrar = UserSerializer()
    student = UserSerializer()
    #lecturer = UserSerializer()
    class Meta:
        model= Issue
        fields = ['id','last_updated','created_at','status','department','registrar','student','attachment',
                  'description','category','year_of_study','course_code','couse_name','programme']
        #read_only_fields = ['student', 'lecturer', 'created_at', 'last_updated']

        extra_kwargs = {
            'registrar': {'required': True},  # Password is required and write-only
            'description': {'required': True},  # Email is required
            'category': {'required': True},  # Username is required
            'year_of_study': {'required': True},  # First name is required
            'course_code': {'required': True},  # Last name is required
            'couse_name':{'required':True},#Role is required on registration

        }

        '''

'''
class AssignIssueSerializer(serializers.ModelSerializer):
    lecturer = UserSerializer()
    class Meta:
        model = Issue
        fields = ['lecturer']
        '''

class AssignIssueSerializer(serializers.ModelSerializer):
    lecturer = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomUser.objects.filter(role='lecturer'),
        allow_null=False
    )

    class Meta:
        model = Issue
        fields = ['lecturer']

    def validate_lecturer(self, value):
        # Additional validation
        if value and value.role != 'lecturer':
            raise serializers.ValidationError("The assigned user must be a lecturer.")
        return value
        
    def update(self, instance, validated_data):
        # Explicitly update the lecturer field
        if 'lecturer' in validated_data:
            instance.lecturer = validated_data.get('lecturer')
            instance.save()
        return instance





class CreateIssueSerializer(ModelSerializer):
    department = serializers.CharField(max_length=50)
    registrar = serializers.CharField(max_length=100)
    programme = serializers.CharField(max_length=110)
    
    class Meta:
        model = Issue
        fields = [
            'id', 'department', 'registrar', 'attachment', 'description',
            'category', 'year_of_study', 'course_code', 'course_name', 'programme'
        ]
        read_only_fields = ['student', 'created_at', 'last_updated', 'status']
    
    def validate_department(self, value):
        try:
            department = Department.objects.get(name=value)
            return department
        except Department.DoesNotExist:
            raise serializers.ValidationError(f"Department '{value}' does not exist.")
    
    def validate_registrar(self, value):
        try:
            registrar = CustomUser.objects.get(username=value, role='registrar')
            return registrar
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(f"Registrar with username '{value}' does not exist.")
    
    def validate_programme(self, value):
        try:
            programme = Programme.objects.get(programme_name=value)
            return programme
        except Programme.DoesNotExist:
            raise serializers.ValidationError(f"Programme '{value}' does not exist.")
    
    def create(self, validated_data):
        print(f"Creating issue with data: {validated_data}")
        
        # Create the issue
        issue = Issue.objects.create(**validated_data)
        
        print(f"Issue created with ID: {issue.id}")
        
        return issue



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class VerifyEmailSerializer(serializers.Serializer):
    code = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)


class ResendVerificationCodeSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)   






class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class VerifyPasswordResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    code = serializers.IntegerField(required=True)

class SetNewPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    code = serializers.IntegerField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    password_confirmation = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords do not match")
        
        # Validate password strength if needed
        password = data['password']
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
            
        return data











# class AssignIssueSerializer(serializers.ModelSerializer):
#     lecturer = serializers.SlugRelatedField(
#         slug_field='username',  # Use the 'username' field of CustomUser
#         queryset=CustomUser.objects.filter(role='lecturer'),
#         allow_null=False
#     )

#     class Meta:
#         model = Issue
#         fields = ['lecturer']

#     def validate_lecturer(self, value):
#         # Optional: Additional validation
#         if value and value.role != 'lecturer':
#             raise serializers.ValidationError("The assigned user must be a lecturer.")
#         return value


'''
class CreateIssueSerializer(ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            'id', 'last_updated', 'created_at', 'status', 'department', 
            'registrar', 'student', 'attachment', 'description', 'category', 
            'year_of_study', 'course_code', 'couse_name', 'programme'
        ]
        read_only_fields = ['student', 'created_at', 'last_updated', 'status']
        extra_kwargs = {
            'registrar': {'required': True},
            'description': {'required': True},
            'category': {'required': True},
            'year_of_study': {'required': True},
            'course_code': {'required': True},
            'couse_name': {'required': True},
            'department': {'required': True},
            'programme': {'required': True},
        }
'''




'''
class CreateIssueSerializer(ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            'id', 'department', 'registrar', 'attachment', 'description', 
            'category', 'year_of_study', 'course_code', 'couse_name', 'programme'
        ]
        read_only_fields = ['student', 'created_at', 'last_updated', 'status']
    
    def create(self, validated_data):
        # Add debug print
        print(f"Creating issue with data: {validated_data}")
        
        # Create the issue
        issue = Issue.objects.create(**validated_data)
        
        # Add another debug print
        print(f"Issue created with ID: {issue.id}")
        
        return issue
'''




'''
class StudentRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)
    #staff_id_or_student_no = serializers.CharField(required=True)  # Explicitly define the field

    class Meta:
        model = CustomUser 
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'password_confirmation','role','staff_id_or_student_no']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
            'role':{'required':True},#Role is required on registration
            'staff_id_or_student_no':{'required':True},#Role is required on registration
        }'''



'''
class StudentRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)
    #staff_id_or_student_no = serializers.IntegerField(required=True)  # Explicitly define as IntegerField
    class Meta:
        model = CustomUser 
        # Reorder fields to match the working serializer
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'staff_id_or_student_no', 'password', 'password_confirmation', 'role']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True},
            'username': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'role': {'required': True},
            'staff_id_or_student_no': {'required': True},
        }
    
    # Rest of your validate and create methods remain the same

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        role = data.get('role')
        staff_id_or_student_no = data.get("staff_id_or_student_no")


        # Check if username already exists
        if username and CustomUser .objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists')
        

            # Ensure staff_id_or_student_no is an integer
        if staff_id_or_student_no is not None:
            try:
                staff_id_or_student_no = int(staff_id_or_student_no)
            except ValueError:
                raise serializers.ValidationError('Student number must be an integer')

        # Check if staff_id_or_student_no is in IDENTIFICATION_NUMBERS
        if staff_id_or_student_no not in STUDENT_IDENTIFICATION_NUMBERS:
            raise serializers.ValidationError('Wrong Student number')
        
        if staff_id_or_student_no and CustomUser .objects.filter(staff_id_or_student_no=staff_id_or_student_no).exists():
            raise serializers.ValidationError('User with this student number already exists')

        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        # Check if email already exists
        if email and CustomUser .objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")

        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        if len(password_confirmation) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")


        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check if role is valid
        if role not in dict(CustomUser .USER_CHOICES):
            raise serializers.ValidationError("Invalid role selected")

        if role != "student":
            raise serializers.ValidationError("Role must be student")

        return data

    def create(self, validated_data):
        # Remove password confirmation from validated data
        validated_data.pop('password_confirmation')
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user  '''



class UserRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser 
        fields = ['id', 'first_name', 'last_name', 'email', 'username','staff_id_or_student_no', 'password', 'password_confirmation','role']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
            'role':{'required':True},#Role is required on registration
            'staff_id_or_student_no':{'required':True},# required on registration
            
            
        }


    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        role = data.get('role')
        staff_id_or_student_no = data.get("staff_id_or_student_no")

        # Check if username already exists
        if username and CustomUser .objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists')
        

        # Ensure staff_id_or_student_no is an integer
        if staff_id_or_student_no is not None:
            try:
                staff_id_or_student_no = int(staff_id_or_student_no)
            except ValueError:
                raise serializers.ValidationError('Invalid student number or staff id must be an integer')
            
        if role not in dict(CustomUser .USER_CHOICES):
            raise serializers.ValidationError("Invalid role selected")

        if role == 'student':
            if staff_id_or_student_no not in STUDENT_IDENTIFICATION_NUMBERS:
                raise serializers.ValidationError('Student number does not exist')
            


        if role == 'lecturer':
            if staff_id_or_student_no not in LECTURE_IDS:
                raise serializers.ValidationError('Staff Id does not exist')
            
        if role == 'registrar':
            if staff_id_or_student_no not in REGISTRA_IDS:
                raise serializers.ValidationError('Staff Id does not exist')
        


            #raise serializers.ValidationError("Role must be student")
        
            

        # Check if staff_id_or_student_no is in IDENTIFICATION_NUMBERS
        
        
        if staff_id_or_student_no and CustomUser .objects.filter(staff_id_or_student_no=staff_id_or_student_no).exists():
            raise serializers.ValidationError('Student with this student number already exists')




        
        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        # Check if email already exists
        if email and CustomUser .objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")
        
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        if len(password_confirmation) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")

        
        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check if role is valid
        
        
        return data

    def create(self, validated_data):
        # Remove password confirmation from validated data
        validated_data.pop('password_confirmation')
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user










'''
class LecturerRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser 
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'password_confirmation','role','staff_id_or_student_no']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
            'role':{'required':True},#Role is required on registration
            'staff_id_or_student_no':{'required':True},#Role is required on registration
        }

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        role = data.get('role')
        staff_id_or_student_no = data.get("staff_id_or_student_no")

        # Check if username already exists
        if username and CustomUser .objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists')
        

            # Ensure staff_id_or_student_no is an integer
        if staff_id_or_student_no is not None:
            try:
                staff_id_or_student_no = int(staff_id_or_student_no)
            except ValueError:
                raise serializers.ValidationError('Staff number must be an integer')

        # Check if staff_id_or_student_no is in IDENTIFICATION_NUMBERS
        if staff_id_or_student_no not in LECTURE_IDS:
            raise serializers.ValidationError('Wrong Student number')
        
        if staff_id_or_student_no and CustomUser .objects.filter(staff_id_or_student_no=staff_id_or_student_no).exists():
            raise serializers.ValidationError('User with this IDalready exists')

        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        # Check if email already exists
        if email and CustomUser .objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")

        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        if len(password_confirmation) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")



        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check if role is valid
        if role not in dict(CustomUser .USER_CHOICES):
            raise serializers.ValidationError("Invalid role selected")

        if role != "lecturer":
            raise serializers.ValidationError("Role must be student")

        return data

    def create(self, validated_data):
        # Remove password confirmation from validated data
        validated_data.pop('password_confirmation')
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user
'''




'''
class LecturerRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser 
        fields = ['id', 'first_name', 'last_name', 'email', 'username','staff_id_or_student_no', 'password', 'password_confirmation','role']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
            'role':{'required':True},#Role is required on registration
            'staff_id_or_student_no':{'required':True},# required on registration
            
            
        }


    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        role = data.get('role')
        staff_id_or_student_no = data.get("staff_id_or_student_no")

        # Check if username already exists
        if username and CustomUser .objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists')
        

        # Ensure staff_id_or_student_no is an integer
        if staff_id_or_student_no is not None:
            try:
                staff_id_or_student_no = int(staff_id_or_student_no)
            except ValueError:
                raise serializers.ValidationError('Staff  number must be an integer')

        # Check if staff_id_or_student_no is in IDENTIFICATION_NUMBERS
        if staff_id_or_student_no not in LECTURE_IDS:
            raise serializers.ValidationError('Staff id does not exist')
        
        if staff_id_or_student_no and CustomUser .objects.filter(staff_id_or_student_no=staff_id_or_student_no).exists():
            raise serializers.ValidationError('Lecturer with this id already exists')




        
        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        # Check if email already exists
        if email and CustomUser .objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")
        
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        if len(password_confirmation) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")

        
        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check if role is valid
        if role not in dict(CustomUser .USER_CHOICES):
            raise serializers.ValidationError("Invalid role selected")

        if role != 'lecturer':
            raise serializers.ValidationError("Role must be student")
        
        return data

    def create(self, validated_data):
        # Remove password confirmation from validated data
        validated_data.pop('password_confirmation')
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user




class RegistrarRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser 
        fields = ['id', 'first_name', 'last_name', 'email', 'username','staff_id_or_student_no', 'password', 'password_confirmation','role']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
            'role':{'required':True},#Role is required on registration
            'staff_id_or_student_no':{'required':True},# required on registration
            
            
        }


    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        role = data.get('role')
        staff_id_or_student_no = data.get("staff_id_or_student_no")

        # Check if username already exists
        if username and CustomUser .objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists')
        

        # Ensure staff_id_or_student_no is an integer
        if staff_id_or_student_no is not None:
            try:
                staff_id_or_student_no = int(staff_id_or_student_no)
            except ValueError:
                raise serializers.ValidationError('Staff  number must be an integer')

        # Check if staff_id_or_student_no is in IDENTIFICATION_NUMBERS
        if staff_id_or_student_no not in REGISTRA_IDS:
            raise serializers.ValidationError('Staff ID does not exist')
        
        if staff_id_or_student_no and CustomUser .objects.filter(staff_id_or_student_no=staff_id_or_student_no).exists():
            raise serializers.ValidationError('User with this id already exists')




        
        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        # Check if email already exists
        if email and CustomUser .objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")
        
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        if len(password_confirmation) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")

        
        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check if role is valid
        if role not in dict(CustomUser .USER_CHOICES):
            raise serializers.ValidationError("Invalid role selected")

        if role != 'registrar':
            raise serializers.ValidationError("Role must be registrar")
        
        


        return data

    def create(self, validated_data):
        # Remove password confirmation from validated data
        validated_data.pop('password_confirmation')
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user
'''




'''
class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=50,write_only=True)
    password_confirmation = serializers.CharField(max_length=50,write_only=True)
    email = serializers.EmailField()
    
    def validate(self,validated_data):
        if validated_data['password'] != validated_data['password_confirmation']:
            raise serializers.ValidationError("Passwords donot match....")
        
        return validated_data
        


    
class VerifyPasswordResetCodeSerializer(serializers.Serializer):
    code = serializers.IntegerField()

'''
































































'''
class StudentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password','password_confirmation','program']
        
        extra_kwargs = {
            'password_confirmation':{'write_only':True},
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
        }

    def validate(self, data):
        password = data.get('password')
        password_confirmation= data.get('password_confirmation')
        email = data.get('email')
        username = data.get('username')
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")

        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already taken.")
        
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords don't match....")
        
        return data
    
    def create(self, validated_data):
        """Create a new user with hashed password."""
        password = validated_data.pop('password')  # Extract password
        validated_data["role"] = 'student'
        validated_data["token"] = None
        print(validated_data)
        user = CustomUser(**validated_data)  # Create user instance without saving
        user.set_password(password)  # Hash the password
        user.save()  # Save user with hashed password
        return user
'''

'''
class LecturerRegistrarRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"
        
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirmation': {'write_only': True},
            }

    def validate(self, data):
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        email_value = data.get('email')
        username = data.get('username')
        
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")
        
        if '@' not in email_value or email_value.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
    
        if CustomUser.objects.filter(email=email_value).exists():
            raise serializers.ValidationError("Email already taken.")
        
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords don't match....")
        
        return data
    
    def create(self, validated_data):
        """Create a new user with hashed password."""
        print(validated_data)
        password = validated_data.pop('password')  # Extract password
        groups = validated_data.pop('groups', []) if 'groups' in validated_data else []
        user_permissions = validated_data.pop('user_permissions', []) if 'user_permissions' in validated_data else []

        user = CustomUser(**validated_data)  # Create user instance without saving
        user.set_password(password)  # Hash the password
        if groups:
            user.groups.set(groups)  
        
        if user_permissions:
            user.user_permissions.set(user_permissions)

        user.save()
        return user
'''
'''
class RegistrationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationToken
        fields = '__all__'
        
    def validate(self, data):
        entered_email = data.get('email')
        if '@' not in entered_email or entered_email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        if CustomUser.objects.filter(email = data.get('email')).exists():
            raise serializers.ValidationError(f'The email {data.get('email')} is already taken')
        return data 
        '''


'''
class RegisterSerializer(ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ['id','first_name','last_name',"email",'username','password','password_confirmation']

        extra_kwargs = {'password':{'write_only':True}}
    def validate(self,data):
        username = data['username']
        email = data['email']
        password = data['password']
        password_confirmation = data['password_confirmation']

        if username:
            if CustomUser.objects.filter(username=username).exists():
                raise serializers.ValidationError('username already exists')
        if email:
            if CustomUser.objects.filter(email=email).exists():
                raise serializers.ValidationError("email already exists")
        
        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        return data'
        '''