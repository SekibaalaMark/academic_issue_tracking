from django.contrib import admin
from .models import User,Issue,Department

# Register your models here.

admin.site.register(User)
admin.site.register(Issue)
admin.site.register(Department)
