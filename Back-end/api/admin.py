from django.contrib import admin
from .models import CustomUser,Issue,Department

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Issue)
admin.site.register(Department)
