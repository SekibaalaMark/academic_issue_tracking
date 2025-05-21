from rest_framework.serializers import ModelSerializer
from . models import *
from rest_framework import serializers

STUDENT_IDENTIFICATION_NUMBERS=[0,111,222,333,444,555,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000
                                ,20000,30000,40000,50000,60000,70000]

REGISTRA_IDS =[20,30,40,50,60,90,80,90,21,23,24,25,26,27,28,29,31,32,34,35,36,37,38,39,41]

LECTURE_IDS =[11,22,33,44,55,66,77,88,99,110,220,330,440,550,660,770,880,990]


class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ProgrammeSerializer(ModelSerializer):
    class Meta:
        model = Programme
        fields = '__all__'


class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','first_name','last_name',"email","role","email","username"]
        extra_kwargs = {"password":{"write_only":True}}

    


class LecturerUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username']  # Only include the username field


#Dashboard Count Serializers
class StudentDashboardCountSerializer(serializers.Serializer):
    total_issues = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    in_progress_count = serializers.IntegerField()
    resolved_count = serializers.IntegerField()

class LecturerDashboardCountSerializer(serializers.Serializer):
    total_assigned = serializers.IntegerField()
    in_progress_count = serializers.IntegerField()
    resolved_count = serializers.IntegerField()

class RegistrarDashboardCountSerializer(serializers.Serializer):
    total_issues = serializers.IntegerField()
    category_counts = serializers.DictField()
    status_counts = serializers.DictField()






class IssueSerializer(ModelSerializer):
    registrar = UserSerializer()
    student = UserSerializer()
    lecturer = UserSerializer()
    class Meta:
        model= Issue
        fields = ['id','last_updated','created_at','status','department','registrar','student','attachment',
                  'description','category','year_of_study','course_code','course_name','programme','lecturer']
        read_only_fields = ['student', 'lecturer', 'created_at', 'last_updated']





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
            # Update status to in_progress when lecturer is assigned
            instance.status = 'in_progress'
            instance.save()
        return instance




class CreateIssueSerializer(ModelSerializer):
    registrar = serializers.CharField(max_length=100)
    class Meta:
        model = Issue
        fields = [
            'id', 'department', 'registrar', 'attachment', 'description',
            'category', 'year_of_study', 'course_code', 'course_name', 'programme'
        ]
        read_only_fields = ['student', 'created_at', 'last_updated', 'status']
    

    
    def validate_registrar(self, value):
        try:
            registrar = CustomUser.objects.get(username=value, role='registrar')
            return registrar
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(f"Registrar with username '{value}' does not exist.")
    
    
    def create(self, validated_data):
        # Creating the issue
        issue = Issue.objects.create(**validated_data)
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
        # Checking if passwords match
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords do not match")
        
        # Validating password strength
        password = data['password']
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
            
        return data




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
            'role':{'required':True},
            'staff_id_or_student_no':{'required':True},
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
        
        return data

    def create(self, validated_data):
        # Remove password confirmation from validated data
        validated_data.pop('password_confirmation')
        user = CustomUser (**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user
