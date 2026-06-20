from django.contrib import admin
from .models import applicant

# Register your models here.

class applicantAdmin(admin.ModelAdmin):
    list_display=('name','resume','resume_text')
    # search_fields=('name')


admin.site.register(applicant, applicantAdmin)