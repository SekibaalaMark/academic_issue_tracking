from django.contrib import admin
from .models import *


admin.site.register(CustomUser)
admin.site.register(Issue)
admin.site.register(Department)
admin.site.register(Programme)
admin.site.register(Course_unit)
