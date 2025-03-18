from rest_framework.serializers import ModelSerializer
from . models import Issue,Department,CustomUser
from rest_framework import serializers


class IssueSerializer(ModelSerializer):
    class Meta:
        model= Issue
        fields = '__all__'

class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','first_name','last_name',"email","role"]
        extra_kwargs = {"password":{"write_only":True}}

    def create(self,validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
from rest_framework import serializers
from .models import CustomUser 

class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser 
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'password_confirmation']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},  # Password is required and write-only
            'email': {'required': True},  # Email is required
            'username': {'required': True},  # Username is required
            'first_name': {'required': True},  # First name is required
            'last_name': {'required': True},  # Last name is required
        }

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')

        # Check if username already exists
        if username and CustomUser .objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists')

        # Check if email already exists
        if email and CustomUser .objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")

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

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)