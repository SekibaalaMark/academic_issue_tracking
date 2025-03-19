from rest_framework.serializers import ModelSerializer
from . models import *
from rest_framework import serializers




class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ProgrammeSerializer(ModelSerializer):
    class Meta:
        model = Programme
        fields = '__all__'

class CourseUnitSerializer(ModelSerializer):
    class Meta:
        model = Course_unit
        fields = '__all__'

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
    raised_by = UserSerializer()
    class Meta:
        model= Issue
        fields = ['id','last_updated','created_at','status','department','registrar','raised_by','attachment',
                  'description','category','year_of_study','course_code','couse_name','programme']

    

class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser 
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'password_confirmation','role']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
            'role':{'required':True},#Role is required on registration
        }

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        role = data.get('role')

        # Check if username already exists
        if username and CustomUser .objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists')
        
        if '@' not in email or email.split('@')[1] != 'gmail.com':
            raise serializers.ValidationError('Only Gmail accounts are allowed...')
        
        # Check if email already exists
        if email and CustomUser .objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")

        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check if role is valid
        if role not in dict(CustomUser .USER_CHOICES):
            raise serializers.ValidationError("Invalid role selected")


        return data

    def create(self, validated_data):
        # Remove password confirmation from validated data
        validated_data.pop('password_confirmation')
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


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