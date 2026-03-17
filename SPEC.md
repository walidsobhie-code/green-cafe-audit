# Green Cafe Audit System - Specification

## Project Overview
- **Name**: Green Cafe Audit System
- **Purpose**: Professional 50-point bilingual audit checklist for Green Cafe branch visits
- **Output**: PDF report generation + email distribution
- **Cost**: Zero (free tools only)

## Training Materials Analyzed
1. Welcome to Green Experience v2.pdf
2. Basic Food Safety V2.pdf
3. Complete Recipe Manual V3.1_.pdf
4. Shift Leader Skills.pptx

## System Architecture

### Frontend (Next.js Static)
- Bilingual form (Arabic & English)
- 50-point audit checklist
- Photo upload for evidence
- Location/branch selection
- Auditor name & date

### PDF Generation
- Client-side using jsPDF
- Bilingual report layout
- Includes photos as evidence
- Action plan section

### Email Distribution
- EmailJS (free tier) OR
- Google Sheets + Apps Script
- Configurable recipient list

## Audit Categories (50 Points)
Based on training materials analysis:
1. Food Safety & Hygiene (10 points)
2. Customer Service (8 points)
3. Operations & Procedures (8 points)
4. Cleanliness & Maintenance (6 points)
5. Staff Training & Skills (6 points)
6. Equipment & Safety (4 points)
7. Compliance & Documentation (4 points)
8. Shift Leadership (4 points)

## Technical Stack
- Next.js 14 (static export)
- Tailwind CSS
- jsPDF for PDF generation
- EmailJS for sending emails (free tier)
- Local storage for offline capability

## File Structure
```
green-cafe-audit/
├── app/
│   ├── page.tsx          # Main audit form
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── AuditForm.tsx     # Main form component
│   ├── AuditCategory.tsx # Category sections
│   ├── PhotoUpload.tsx   # Evidence photos
│   └── PDFGenerator.tsx  # Report generation
├── lib/
│   ├── auditData.ts      # 50-point checklist
│   └── pdfGenerator.ts   # PDF logic
├── public/
│   └── index.html        # For static deploy
└── package.json
```

## Zero-Cost Tools Used
- Next.js: Framework (MIT license)
- jsPDF: PDF generation (MIT license)
- EmailJS: Email service (Free tier: 200 emails/month)
- Cloudflare Pages: Hosting (free)
- GitHub: Repository (free)
