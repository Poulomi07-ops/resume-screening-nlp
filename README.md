# Resume Screening System

This is my final year college project. It's a system that automatically checks how well a resume matches a job's required skills, using NLP (Natural Language Processing).

## What it does

- User uploads their resume (PDF file)
- The system reads the text from the resume (even scanned PDFs, using OCR)
- It extracts the skills mentioned in the resume using NLP
- It compares those skills with the job's required skills
- It gives a match score (%) and shows if the candidate is Shortlisted or Rejected
- All applicants are ranked based on their score

## Technologies Used

- **Backend:** Django (Python)
- **Frontend:** React
- **NLP Libraries:** SkillNer, Sentence-Transformers (SBERT), spaCy
- **OCR:** Tesseract
- **PDF Reading:** PyPDF2

## How to Run This Project

### Backend (Django)
\`\`\`bash
cd resume_upload
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`

### Frontend (React)
\`\`\`bash
cd resume_upload/frontend
npm install
npm run dev
\`\`\`

## Project Status

This is a college final year project, still being improved.

## Author

Poulomi Barman.
