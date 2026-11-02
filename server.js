const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const CYNBIT_SYSTEM_PROMPT = `You are the official Cynbit AI Concierge for Cynbit Technologies Pvt. Ltd., an enterprise AI automation and software solutions company based in Jaipur, Rajasthan.
Your tone is professional, confident, innovative, and concise.

Key Cynbit Facts for your answers:
- Company: Cynbit Technologies Pvt. Ltd. (CIN: U62011RJ2024PTC093652)
- Headquarters: 32/115 Pratap Nagar, Jaipur, Rajasthan 302033
- Official Contact: opportunities@cynbit.in | Phone: +91 89479 62667
- Core Capabilities:
  1. Autonomous AI Agents: End-to-end multi-agent orchestration for back-office and customer automation.
  2. Custom Enterprise Dashboards: High-performance administrative consoles with real-time analytics.
  3. Enterprise RAG Pipelines: Contextual vector search (pgvector, Pinecone) with strict anti-hallucination guardrails.
  4. Optimistic Full-Stack Cloud Architecture: Next.js, Node.js, TypeScript, and Go microservices.
- Proprietary Products:
  1. TenantEase: Complete real estate & tenant management SaaS ecosystem (auto-invoicing, digital leases, maintenance triage).
  2. BitElevate: Tech education and learning path mentorship ecosystem for software engineers and students.
- Careers & Openings (Active for 2026):
  1. Full Stack Developer Intern (Next.js, Node.js, PostgreSQL; ₹15,000–₹25,000/mo stipend for students/freshers).
  2. AI / LLM Application Engineer (LangChain, Python, Vector DBs, multi-agent frameworks).
  3. Backend Engineer (Node.js, Go, PostgreSQL, Redis).
  4. ML Research Intern (PyTorch, Transformers, dataset benchmarks; ₹18,000–₹28,000/mo stipend).
- Selection Process: Application Received -> Technical Assessment -> Technical Interview -> Offer Letter & NDA.

Instructions:
- Keep answers crisp (2-4 paragraphs or formatted bullet points).
- When a user asks about career openings or internships, highlight the Full Stack Developer Intern role, stipend, and suggest applying.
- When a user asks about software services or pricing, encourage scheduling a discovery call with the technical leads.`;

const LOCAL_FALLBACK_KNOWLEDGE = [
  {
    keywords: ['service', 'services', 'what do you do', 'capabilities', 'offering'],
    reply: `Cynbit Technologies specializes in three enterprise software domains:\n\n1. **Autonomous AI Agents**: End-to-end multi-agent orchestration for enterprise workflows.\n2. **Custom Enterprise Dashboards**: Lightning-fast administrative consoles with real-time analytics.\n3. **Enterprise RAG & Cloud Architecture**: Vector indexing (pgvector, Pinecone) and scalable Next.js/Node.js/Go services.\n\nWould you like to schedule a discovery call with our technical leads?`,
    card: { title: 'Schedule Discovery Call', desc: 'Discuss your enterprise software or automation requirements.', actionText: 'Book Discovery Call', actionType: 'consult' }
  },
  {
    keywords: ['career', 'careers', 'intern', 'internship', 'hiring', 'job', 'jobs', 'vacancy'],
    reply: `We are actively hiring for multiple roles in Jaipur and hybrid setups:\n\n• **Full Stack Developer Intern** (Next.js, Node.js, PostgreSQL; ₹15k–₹25k/month stipend)\n• **AI / LLM Application Engineer** (LangChain, Python, Vector DBs; Full-time)\n• **Backend Engineer** (Node.js, Go, Redis; Full-time)\n• **ML Research Intern** (PyTorch, Transformers; ₹18k–₹28k/month stipend)\n\nSelection flow: Application Review &rarr; Technical Assessment &rarr; Technical Interview &rarr; Offer.`,
    card: { title: 'Quick Apply for 2026 Openings', desc: 'Submit your resume directly to our engineering hiring team.', actionText: 'Quick Apply Now', actionType: 'apply' }
  },
  {
    keywords: ['full stack intern', 'stipend', 'salary', 'fresher', 'student'],
    reply: `The **Full Stack Developer Intern** position is actively open for 6th/7th/8th semester students and freshers:\n\n• **Stipend**: ₹15,000 to ₹25,000 per month\n• **Location**: Jaipur (Pratap Nagar) / Hybrid\n• **Core Stack**: React, Next.js, Node.js, TypeScript, PostgreSQL\n• **Work**: Architecting scalable digital interfaces, REST APIs, and client-facing AI tools.`,
    card: { title: 'Apply for Full Stack Internship', desc: 'Drop your details for priority screening by our lead developers.', actionText: 'Submit Application', actionType: 'apply' }
  },
  {
    keywords: ['location', 'address', 'where', 'contact', 'phone', 'email', 'office', 'jaipur', 'cin'],
    reply: `Cynbit Technologies Pvt. Ltd. is headquartered in Jaipur:\n\n• **Address**: 32/115 Pratap Nagar, Jaipur, Rajasthan 302033\n• **CIN**: U62011RJ2024PTC093652\n• **Email**: opportunities@cynbit.in\n• **Phone**: +91 89479 62667\n• **Operating Hours**: Mon – Sat, 9:30 AM to 6:30 PM IST`,
    card: { title: 'Connect with Cynbit', desc: 'Leave an inquiry for our engineering or business team.', actionText: 'Send Direct Message', actionType: 'consult' }
  },
  {
    keywords: ['tenantease', 'bitelevate', 'product', 'products', 'studio'],
    reply: `Cynbit has developed two proprietary software ecosystems:\n\n• **TenantEase**: Modern real estate management SaaS platform covering leasing, auto-invoicing, maintenance requests, and digital contracts.\n• **BitElevate**: Interactive technology education and project mentoring ecosystem for software engineering students.`,
    card: { title: 'Product Walkthrough', desc: 'Request a walkthrough of TenantEase or BitElevate.', actionText: 'Contact Product Team', actionType: 'consult' }
  }
];

function getDeterministicReply(query) {
  const lower = query.toLowerCase();
  for (const item of LOCAL_FALLBACK_KNOWLEDGE) {
    if (item.keywords.some(k => lower.includes(k))) {
      return { reply: item.reply, card: item.card || null };
    }
  }

  return {
    reply: `Cynbit Technologies is an AI automation and custom software development company in Jaipur (Pratap Nagar). We engineer **Autonomous AI Agents**, **Contextual RAG Pipelines**, and **Custom Enterprise Dashboards**.\n\nYou can ask about our services, tech stacks, or our open Full Stack Developer Internship.`,
    card: { title: 'Talk to an Engineer', desc: 'Leave a note and our technical founders will follow up directly.', actionText: 'Send Message', actionType: 'consult' }
  };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 1. If Google Gemini API Key is configured
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
        
        const contents = [];
        contents.push({
          role: 'user',
          parts: [{ text: `${CYNBIT_SYSTEM_PROMPT}\n\nUser Question: ${message}` }]
        });

        const geminiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });

        const data = await geminiRes.json();
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
          const replyText = data.candidates[0].content.parts[0].text;
          const fallback = getDeterministicReply(message);
          return res.json({
            reply: replyText,
            card: fallback.card || null,
            source: 'gemini-3.5-flash'
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to deterministic RAG:', geminiErr.message);
      }
    }

    // 2. If OpenAI API Key is configured
    if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      try {
        const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
        const messages = [
          { role: 'system', content: CYNBIT_SYSTEM_PROMPT },
          ...conversationHistory.slice(-4),
          { role: 'user', content: message }
        ];

        const openaiRes = await fetch(openaiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7
          })
        });

        const data = await openaiRes.json();
        if (data.choices && data.choices[0].message.content) {
          const replyText = data.choices[0].message.content;
          const fallback = getDeterministicReply(message);
          return res.json({
            reply: replyText,
            card: fallback.card || null,
            source: 'openai-gpt-4o-mini'
          });
        }
      } catch (openaiErr) {
        console.warn('OpenAI API call failed, falling back to deterministic RAG:', openaiErr.message);
      }
    }

    // 3. Deterministic Contextual RAG Fallback (Zero downtime, verified facts)
    const result = getDeterministicReply(message);
    return res.json({
      reply: result.reply,
      card: result.card,
      source: 'cynbit-local-rag'
    });

  } catch (error) {
    console.error('Server /api/chat error:', error);
    res.status(500).json({ error: 'Internal server error processing chat request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Cynbit AI Concierge Server running on http://localhost:${PORT}`);
});
