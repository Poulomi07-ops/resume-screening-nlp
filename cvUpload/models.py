from django.db import models

# Create your models here.
#username: poulomi password:poulomi2003
class applicant(models.Model):
    name=models.CharField(max_length=100)
    resume=models.FileField(upload_to='resumes/')
    resume_text=models.TextField()
    score=models.FloatField(default=0)
    def __str__(self):
        return self.name