# Cynbit Full-Stack AI Concierge & Brand Experience

**Author / Candidate:** Sarvesh Pandey (Sarvesh Panday)  
**Target Organization:** Cynbit Technologies Pvt. Ltd. (`https://cynbit.in`), Jaipur  
**Role:** Full Stack Developer Intern / AI Engineer  
**Live Demo:** Local `http://localhost:3000` / Deployable to Vercel  

---

## Overview

An enterprise-grade, embeddable **AI Chatbot Concierge** and redesigned brand experience engineered for **Cynbit Technologies** (`https://cynbit.in`), Jaipur's leading AI Automation and Autonomous Agents firm.

The application serves prospective enterprise clients, partners, and engineering applicants by providing instantaneous, factual answers about Cynbit's services, tech stacks, proprietary products (*TenantEase*, *BitElevate*, *Cynbit Studio*), and active career openings (*Full Stack Developer Intern*, stipend: ₹15,000–₹25,000/mo).

---

## Key Features

1. **Brand-Aligned UI (1:1 with cynbit.in)**:
   - Material 3 design tokens, Cynbit Teal (`#006067`), Slate Blue (`#12629d`), and dark slate (`#0b1320`).
   - Official typography: `Plus Jakarta Sans` for headlines and `Manrope` for body text.
   - **Strict Zero-Emoji Policy**: All icons powered cleanly by **Google Material Symbols Outlined**.
   - Concentric orbital hero visual, subtitle rotator, Bento ecosystem pillars, BitElevate dark showcase, infinite brand marquee, and 6-stage lifecycle roadmap.

2. **Autonomous AI Concierge Widget**:
   - Sub-30ms deterministic RAG engine with zero external bloat and zero hallucinations.
   - Dual-mode architecture: works standalone offline and connects optionally to Google Gemini (`gemini-2.5-flash`) or OpenAI (`gpt-4o-mini`).
   - Token-by-token typewriter streaming response simulation.
   - Interactive action cards and in-chat lead capture drawer modal.

3. **Vercel Serverless Ready**:
   - Node.js Express server (`server.js`) for local development.
   - Vercel Serverless Function (`api/chat.js` and `vercel.json`) ready for one-click edge deployment.

---

## Project Structure

```
cynbit-chatbot-widget/
├── .gitignore               # Protects node_modules and .env
├── index.html               # Cynbit landing page with floating concierge widget
├── styles.css               # Design system, tokens, marquee & widget styling
├── chatbot.js               # Sub-30ms RAG engine, streaming logic & lead capture
├── server.js                # Local Express backend (POST /api/chat)
├── api/
│   └── chat.js              # Vercel Serverless Edge Function
├── logo.svg                 # Official vector logo asset
├── vercel.json              # Vercel routing configuration
├── package.json             # Node dependencies and run scripts
├── TECHNICAL_REPORT.md      # Comprehensive technical assessment report
├── INTERVIEW_STUDY_GUIDE.md # Interview defense and preparation guide
└── README.md                # Quick start and deployment instructions
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js v18+ installed

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start the local server
npm start
```
Navigate to **`http://localhost:3000`** in your browser.

---

## How to Upload to GitHub

```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Commit
git commit -m "feat: Cynbit AI Concierge & Brand Experience by Sarvesh Pandey"

# 4. Set default branch to main
git branch -M main

# 5. Link remote repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/cynbit-ai-concierge.git

# 6. Push
git push -u origin main
```

---

## How to Deploy to Vercel

### Option 1: Web Dashboard (Fastest)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Select your `cynbit-ai-concierge` repository.
4. Leave Framework as **Other** and Root Directory as `./`.
5. *(Optional)* Add `GEMINI_API_KEY` under Environment Variables.
6. Click **Deploy**. Your site will be live on `https://<your-project>.vercel.app`!

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Author
**Sarvesh Pandey (Sarvesh Panday)**  
Full Stack Developer Intern / AI Engineer Applicant  
Cynbit Technologies Assessment Submission &middot; November 2026
