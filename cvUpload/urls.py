from django.urls import path
from cvUpload import views

urlpatterns = [
    path('upload/',views.upload,name='upload'),
    path('applicants/', views.get_applicants, name='get_applicants'),
]