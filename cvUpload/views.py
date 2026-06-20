
from PyPDF2 import PdfReader
from django.http import HttpResponse
from django.shortcuts import render,redirect
from pdf2image import convert_from_bytes
import pytesseract
import re
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
from .models import applicant
from django.views.decorators.csrf import csrf_exempt
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
model=SentenceTransformer('all-MiniLM-L6-v2')
import spacy
from skillNer.general_params import SKILL_DB
from skillNer.skill_extractor_class import SkillExtractor
from spacy.matcher import PhraseMatcher
import numpy as np
from django.http import JsonResponse

nlp=spacy.load("en_core_web_lg")
skill_extractor=SkillExtractor(nlp, SKILL_DB,PhraseMatcher)

# Create your views here.

def preprocess(text):
    text = text.lower()
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()

    return text

def extract_skills(cleaned_text):
    result=skill_extractor.annotate(cleaned_text)
    all_matches=result['results']['full_matches'] + result['results']['ngram_scored']

    extracted_skills=[]
    for skill in all_matches:
        skill_name=skill['doc_node_value']
        if skill_name not in extracted_skills:
            extracted_skills.append(skill_name)
    
    return extracted_skills

def get_applicants(request):
    applicants = applicant.objects.all().order_by('-score')
    
    data = []
    for idx, a in enumerate(applicants, start=1):
        data.append({
            "rank": idx,
            "name": a.name,
            "score": a.score
        })
    
    return JsonResponse({"applicants": data})

@csrf_exempt
def upload(request):
    if request.method == "POST":
        name=request.POST.get('name')
        file=request.FILES.get('resume')
        print(name)
        print(file)
        # print(request.method)
        if not name or not file :
            return HttpResponse("invalid request")
        
        pdf = PdfReader(file)
        text=""
        for page in pdf.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text+" "


        if not text.strip():
            print("OSR Using.......")
            file.seek(0)
            images =convert_from_bytes(file.read())
            for img in images:
                page_text = pytesseract.image_to_string(img)
                text += page_text  + " "
        
        job_skills_list = ["python", "java", "oops", "array", "string", "recursion", "dynamic programming", "dsa", "sql", "rdbms", "google sheets", "ms word"]
        cleaned_text=preprocess(text)

        resume_extracted_text=extract_skills(cleaned_text)
        print(resume_extracted_text)

        resume_embedding = model.encode(resume_extracted_text)
        job_embedding=model.encode(job_skills_list)

        sim_matrix = cosine_similarity(job_embedding, resume_embedding)
        # for each job skill, find best matching resume skill
        best_scores = sim_matrix.max(axis=1)
        final_score = float(best_scores.mean() * 100)
        print(f"Matched score: {final_score:.2f}%")

        applicant.objects.create(
            name=name,
            resume=file,
            resume_text =text,
            score=round(final_score,2)
        )
        
        return JsonResponse({
            "score": round(final_score, 2),
            "status": "SHORTLISTED" if final_score >= 60 else "REJECTED"
            })
    return HttpResponse("only post allowed")
    