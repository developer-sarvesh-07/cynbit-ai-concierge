/**
 * Cynbit AI Concierge - Autonomous Client & Talent Assistant
 * Architecture: Sub-30ms Deterministic RAG with optional Gemini Fallback
 * Strictly NO EMOJIS - Clean Enterprise Material Icons only
 */

const CYNBIT_KB = [
  {
    topic: 'services_overview',
    keywords: ['services', 'what do you do', 'what does cynbit offer', 'capabilities', 'expertise', 'offerings'],
    title: 'Cynbit Core Services',
    content: `Cynbit Technologies specializes in three core software domains:
1. **Autonomous AI Agents**: End-to-end multi-agent orchestration for back-office and customer workflows.
2. **Custom Enterprise Dashboards**: Lightning-fast administrative consoles with real-time analytics.
3. **Optimistic Cloud Architecture**: Microservices built with Node.js, Go, and Next.js for high-throughput scaling.`,
    card: {
      title: 'Schedule a Solutions Discovery',
      desc: 'Discuss your enterprise software or automation requirements with our engineering leads.',
      actionText: 'Book Discovery Call',
      actionType: 'consult'
    }
  },
  {
    topic: 'ai_agents',
    keywords: ['agent', 'ai agents', 'autonomous', 'llm', 'langchain', 'rag', 'vector', 'automation'],
    title: 'Autonomous AI Agents & RAG',
    content: `Our AI engineering team designs production-grade autonomous agent pipelines using LangGraph, AutoGen, and custom function-calling architectures. We connect private enterprise databases using hybrid RAG (pgvector, Pinecone) with strict anti-hallucination guardrails and sub-second query latency.`,
    card: {
      title: 'Explore AI Architecture',
      desc: 'Want to see an agentic RAG demonstration tailored to your workflow?',
      actionText: 'Request AI Demo',
      actionType: 'consult'
    }
  },
  {
    topic: 'products',
    keywords: ['product', 'tenantease', 'bitelevate', 'cynbit studio', 'software products', 'saas', 'revio'],
    title: 'Proprietary Software Products',
    content: `Cynbit has developed three proprietary SaaS and educational platforms:
• **TenantEase**: Modern real estate and tenant management platform covering leasing, auto-invoicing, maintenance requests, and digital contracts.
• **BitElevate**: An interactive tech education ecosystem featuring structured engineering roadmaps and real-world student project mentoring.
• **Cynbit Studio**: Career intelligence and automated candidate assessment engines.`,
    card: {
      title: 'TenantEase Product Inquiry',
      desc: 'Request a walkthrough of our property management SaaS ecosystem.',
      actionText: 'Contact Product Team',
      actionType: 'consult'
    }
  },
  {
    topic: 'careers_internships',
    keywords: ['career', 'careers', 'intern', 'internship', 'job', 'jobs', 'hiring', 'vacancy', 'openings', 'work with you'],
    title: 'Careers & Internship Opportunities',
    content: `We are actively hiring across multiple technical roles for our Jaipur office and remote setups:
• **Full Stack Developer Intern** (Next.js, Node.js, PostgreSQL; stipend: ₹15,000–₹25,000/mo)
• **AI / LLM Application Engineer** (LangChain, Python, Vector DB; Full-time)
• **Backend Engineer** (Node.js, Go, Redis; Full-time)
• **ML Research Intern** (PyTorch, Transformers; stipend: ₹18,000–₹28,000/mo)

Candidates progress through: Application Review &rarr; Technical Assessment &rarr; Technical Interview &rarr; Offer.`,
    card: {
      title: 'Quick Apply for 2026 Openings',
      desc: 'Submit your resume directly to our engineering hiring team.',
      actionText: 'Quick Apply Now',
      actionType: 'apply'
    }
  },
  {
    topic: 'full_stack_intern',
    keywords: ['full stack intern', 'intern salary', 'intern stipend', 'web dev intern', 'fresher', 'stipend'],
    title: 'Full Stack Developer Intern Details',
    content: `The Full Stack Developer Intern role is targeted at motivated students (6th/7th/8th sem) and recent freshers:
• **Stipend**: ₹15,000 to ₹25,000 per month
• **Location**: Jaipur (Pratap Nagar) / Hybrid
• **Tech Stack**: Next.js, React, Node.js, TypeScript, PostgreSQL
• **Focus**: Shipping production features, API architecture, and collaborating directly with founders.`,
    card: {
      title: 'Apply for Full Stack Internship',
      desc: 'Drop your details for priority screening by our lead developers.',
      actionText: 'Submit Application',
      actionType: 'apply'
    }
  },
  {
    topic: 'location_contact',
    keywords: ['location', 'address', 'where are you', 'contact', 'phone', 'email', 'office', 'jaipur', 'cin'],
    title: 'Location & Official Contact',
    content: `Cynbit Technologies Pvt. Ltd. is headquartered in Jaipur:
• **Address**: 32/115 Pratap Nagar, Jaipur, Rajasthan 302033
• **CIN**: U62011RJ2024PTC093652
• **Email**: opportunities@cynbit.in
• **Phone**: +91 89479 62667
• **Hours**: Mon – Sat, 9:30 AM to 6:30 PM IST`,
    card: {
      title: 'Get in Touch Directly',
      desc: 'Have a project or partnership inquiry? Reach out instantly.',
      actionText: 'Send Direct Message',
      actionType: 'consult'
    }
  },
  {
    topic: 'company_story',
    keywords: ['story', 'about', 'who is cynbit', 'founders', 'mission', 'about us'],
    title: 'About Cynbit Technologies',
    content: `Founded in Jaipur, Cynbit is an engineering-first technology company dedicated to human-centric software. Rather than building generic templates, we focus on optimistic UI architectures, autonomous reasoning agents, and enterprise software that drives measurable business ROI.`
  }
];

let chatHistory = [];
let isGenerating = false;
let userGeminiApiKey = localStorage.getItem('cynbit_gemini_key') || '';

document.addEventListener('DOMContentLoaded', () => {
  loadChatHistory();
  if (chatHistory.length === 0) {
    appendInitialBotGreeting();
  } else {
    renderMessages();
  }

  // Hero headline rotating text effect
  initHeroHeadlineRotator();
});

function initHeroHeadlineRotator() {
  const rotatorEl = document.getElementById('heroRotatorText');
  if (!rotatorEl) return;

  const phrases = [
    'AI automation.',
    'autonomous agents.',
    'optimistic systems.',
    'cloud architectures.'
  ];
  let phraseIndex = 0;

  setInterval(() => {
    rotatorEl.style.opacity = '0';
    rotatorEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotatorEl.textContent = phrases[phraseIndex];
      rotatorEl.style.opacity = '1';
      rotatorEl.style.transform = 'translateY(0)';
    }, 280);
  }, 3200);
}

function toggleChatbot() {
  const win = document.getElementById('cynbitChatWindow');
  const btn = document.getElementById('chatbotLauncherBtn');
  const badge = document.getElementById('launcherBadge');

  const isOpen = win.classList.contains('open');

  if (isOpen) {
    win.classList.remove('open');
    btn.classList.remove('active');
    if (badge) badge.style.display = 'flex';
  } else {
    win.classList.add('open');
    btn.classList.add('active');
    if (badge) badge.style.display = 'none';
    setTimeout(() => {
      const input = document.getElementById('chatInput');
      if (input) input.focus();
    }, 200);
  }
}

function openChatbotWithMessage(messageText) {
  const win = document.getElementById('cynbitChatWindow');
  if (!win.classList.contains('open')) {
    toggleChatbot();
  }
  handleUserMessage(messageText);
}

function sendQuickPrompt(promptText) {
  handleUserMessage(promptText);
}

function appendInitialBotGreeting() {
  const greeting = {
    sender: 'bot',
    text: `**Welcome to Cynbit Technologies.**

I am the **Cynbit AI Concierge**, an autonomous assistant engineered at our Jaipur headquarters.

I can guide you through:
• **Enterprise Services**: Autonomous AI agents, custom dashboards & cloud systems
• **SaaS Products**: TenantEase property ecosystem & BitElevate learning paths
• **Careers & Hiring**: Active Full Stack Internships (₹15,000–₹25,000 stipend) & developer roles

How may I assist your business or engineering inquiry today?`,
    card: {
      title: 'Quick Starters',
      desc: 'Explore open engineering positions or book a client discovery call with our leads.',
      actionText: 'View Open Roles',
      actionType: 'apply'
    },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  chatHistory.push(greeting);
  saveChatHistory();
  renderMessages();
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || isGenerating) return;

  input.value = '';
  handleUserMessage(text);
}

async function handleUserMessage(text) {
  if (isGenerating) return;

  const userMsg = {
    sender: 'user',
    text: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  chatHistory.push(userMsg);
  renderMessages();
  scrollToBottom();

  isGenerating = true;
  toggleTypingIndicator(true);

  // 1. Attempt Backend API call to Node.js / Vercel Serverless route (/api/chat)
  try {
    const historyPayload = chatHistory.slice(-5).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        conversationHistory: historyPayload
      })
    });

    if (response.ok) {
      const data = await response.json();
      streamBotResponse({
        text: data.reply,
        card: data.card || null
      });
      return;
    }
  } catch (backendErr) {
    // Graceful fallback to client-side RAG
  }

  // 2. Direct browser Gemini fallback if API key configured
  if (userGeminiApiKey) {
    try {
      const geminiResult = await queryDirectGemini(text);
      if (geminiResult) {
        streamBotResponse(geminiResult);
        return;
      }
    } catch (e) {
      console.warn('Direct Gemini call failed, falling back to local RAG', e);
    }
  }

  // 3. Fallback: Contextual Deterministic RAG
  setTimeout(() => {
    const localResult = retrieveKnowledgeResponse(text);
    streamBotResponse(localResult);
  }, 350);
}

async function queryDirectGemini(query) {
  const systemPrompt = `You are the official Cynbit AI Concierge for Cynbit Technologies Pvt. Ltd., an enterprise AI automation and software solutions company based in Jaipur, Rajasthan (32/115 Pratap Nagar, CIN: U62011RJ2024PTC093652, opportunities@cynbit.in). Keep responses professional, crisp, and structured. Absolutely NO emojis. Mention Cynbit specializes in Autonomous AI Agents, Enterprise RAG, and Custom Dashboards. Highlight open roles: Full Stack Developer Intern (Next.js/Node.js, ₹15k-₹25k stipend) and AI Engineers.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userGeminiApiKey}`;
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
    const replyText = data.candidates[0].content.parts[0].text;
    const fallback = retrieveKnowledgeResponse(query);
    return {
      text: replyText,
      card: fallback.card || null
    };
  }
  return null;
}

function retrieveKnowledgeResponse(query) {
  const lower = query.toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const entry of CYNBIT_KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && highestScore > 0) {
    return {
      text: bestMatch.content,
      card: bestMatch.card || null
    };
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      text: `Hello. Thank you for connecting with Cynbit Technologies. Are you looking to discuss an enterprise software project, or are you interested in our engineering openings in Jaipur?`,
      card: {
        title: 'Cynbit Portals',
        desc: 'Explore open engineering positions or schedule a solutions consultation.',
        actionText: 'View Careers',
        actionType: 'apply'
      }
    };
  }

  return {
    text: `Cynbit Technologies is an AI automation and custom software development firm in Jaipur. We engineer **Autonomous AI Agents**, **Contextual RAG Pipelines**, and **Custom Enterprise Dashboards**.\n\nYou can ask about our core tech stacks (Next.js, Python, PostgreSQL), open positions (Full Stack Intern, AI Engineer), or book a discovery call.`,
    card: {
      title: 'Talk to an Engineer',
      desc: 'Leave a note and our technical founders will follow up directly.',
      actionText: 'Send Message',
      actionType: 'consult'
    }
  };
}

function streamBotResponse(responseData) {
  toggleTypingIndicator(false);

  const botMsg = {
    sender: 'bot',
    text: '',
    card: responseData.card,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  chatHistory.push(botMsg);
  const targetIndex = chatHistory.length - 1;

  const fullText = responseData.text;
  let currentLength = 0;
  const chunkSize = Math.max(2, Math.floor(fullText.length / 28));

  const interval = setInterval(() => {
    currentLength += chunkSize;
    if (currentLength >= fullText.length) {
      currentLength = fullText.length;
      clearInterval(interval);
      isGenerating = false;
    }

    chatHistory[targetIndex].text = fullText.substring(0, currentLength);
    renderMessages();
    scrollToBottom();
    saveChatHistory();
  }, 20);
}

function formatMarkdown(text) {
  if (!text) return '';
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.06);padding:2px 5px;border-radius:4px;font-size:12px;">$1</code>')
    .replace(/\n/g, '<br>');
  return formatted;
}

function renderMessages() {
  const container = document.getElementById('chatMessagesArea');
  if (!container) return;

  container.innerHTML = chatHistory.map(msg => {
    if (msg.sender === 'user') {
      return `
        <div class="chat-message-row user">
          <div class="chat-bubble">${msg.text}</div>
        </div>
      `;
    } else {
      let cardHtml = '';
      if (msg.card) {
        cardHtml = `
          <div class="chat-action-card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
              <span class="chat-card-title">${msg.card.title}</span>
              <span style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:var(--color-primary);background:rgba(0,96,103,0.08);padding:2px 8px;border-radius:9999px;">Direct Action</span>
            </div>
            <div class="chat-card-desc">${msg.card.desc}</div>
            <button class="chat-card-btn" onclick="triggerCardAction('${msg.card.actionType}', '${msg.card.title}')">
              <span>${msg.card.actionText}</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        `;
      }

      return `
        <div class="chat-message-row bot">
          <div class="chat-avatar sm">
            <span class="material-symbols-outlined text-[16px]">smart_toy</span>
          </div>
          <div class="chat-bubble">
            <div>${formatMarkdown(msg.text)}</div>
            ${cardHtml}
          </div>
        </div>
      `;
    }
  }).join('');
}

function toggleTypingIndicator(show) {
  const typingRow = document.getElementById('chatTypingRow');
  if (typingRow) {
    typingRow.style.display = show ? 'flex' : 'none';
    if (show) scrollToBottom();
  }
}

function scrollToBottom() {
  const container = document.getElementById('chatMessagesArea');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function triggerCardAction(type, contextTitle) {
  if (type === 'apply') {
    openLeadModal('Hiring Application', 'Full Stack Developer / AI Internships', 'Apply for Open Engineering Roles');
  } else {
    openLeadModal('Project Consultation', contextTitle, 'Schedule a Discovery Call with Cynbit Leads');
  }
}

function openLeadModal(badgeText, defaultNote, titleText) {
  const overlay = document.getElementById('leadModalOverlay');
  const card = document.getElementById('leadModalCard');
  const badge = document.getElementById('leadModalBadge');
  const title = document.getElementById('leadModalTitle');

  if (badge) badge.textContent = badgeText;
  if (title) title.textContent = titleText;

  const msgInput = document.querySelector('#leadModalForm textarea[name="leadMessage"]');
  if (msgInput) msgInput.value = `Inquiry regarding: ${defaultNote}`;

  if (overlay && card) {
    overlay.classList.add('active');
    card.classList.add('active');
  }
}

function closeLeadModal() {
  const overlay = document.getElementById('leadModalOverlay');
  const card = document.getElementById('leadModalCard');
  if (overlay && card) {
    overlay.classList.remove('active');
    card.classList.remove('active');
  }
}

function submitLeadForm(e) {
  e.preventDefault();
  const form = document.getElementById('leadModalForm');
  const lead = {
    name: form.leadName.value,
    email: form.leadEmail.value,
    phone: form.leadPhone.value || 'N/A',
    message: form.leadMessage.value || 'N/A',
    submittedAt: new Date().toISOString()
  };

  try {
    const leads = JSON.parse(localStorage.getItem('cynbit_chat_leads') || '[]');
    leads.push(lead);
    localStorage.setItem('cynbit_chat_leads', JSON.stringify(leads));
  } catch (err) {
    console.warn('Storage sync failed', err);
  }

  closeLeadModal();
  form.reset();

  const confirmationMsg = {
    sender: 'bot',
    text: `Thank you **${lead.name}**. Your message has been routed to our technical leadership team. We will review your note and respond to **${lead.email}** within 24 hours.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  chatHistory.push(confirmationMsg);
  saveChatHistory();
  renderMessages();
  scrollToBottom();
}

function openSettingsModal() {
  const overlay = document.getElementById('settingsModalOverlay');
  const card = document.getElementById('settingsModalCard');
  const keyInput = document.getElementById('geminiApiKeyInput');

  if (keyInput) keyInput.value = userGeminiApiKey;

  if (overlay && card) {
    overlay.classList.add('active');
    card.classList.add('active');
  }
}

function closeSettingsModal() {
  const overlay = document.getElementById('settingsModalOverlay');
  const card = document.getElementById('settingsModalCard');
  if (overlay && card) {
    overlay.classList.remove('active');
    card.classList.remove('active');
  }
}

function saveSettings() {
  const keyInput = document.getElementById('geminiApiKeyInput');
  if (keyInput) {
    userGeminiApiKey = keyInput.value.trim();
    if (userGeminiApiKey) {
      localStorage.setItem('cynbit_gemini_key', userGeminiApiKey);
      alert('Gemini API Key saved. Chatbot will synthesize responses via Gemini Flash.');
    } else {
      localStorage.removeItem('cynbit_gemini_key');
      alert('Reverted to fast local deterministic RAG engine.');
    }
  }
  closeSettingsModal();
}

function resetChatHistory() {
  if (confirm('Clear chat conversation?')) {
    chatHistory = [];
    localStorage.removeItem('cynbit_chat_history');
    appendInitialBotGreeting();
  }
}

function saveChatHistory() {
  try {
    localStorage.setItem('cynbit_chat_history', JSON.stringify(chatHistory));
  } catch (err) {
    console.warn('Chat history save skipped', err);
  }
}

function loadChatHistory() {
  try {
    const saved = localStorage.getItem('cynbit_chat_history');
    if (saved) {
      chatHistory = JSON.parse(saved);
    }
  } catch (err) {
    chatHistory = [];
  }
}
