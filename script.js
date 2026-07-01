const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const navToggle = $('.nav-toggle');
const navMenu = $('.nav-menu');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});
$$('.nav-menu a').forEach((link) => link.addEventListener('click', () => navMenu.classList.remove('open')));

const progressBar = $('#progressBar');
window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
});

const cursor = $('.cursor-dot');
window.addEventListener('pointermove', (event) => {
  if (cursor) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });
$$('.reveal').forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 55));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      const suffix = target >= 300 ? '+' : target === 93 ? '%' : '+';
      el.textContent = `${current}${suffix}`;
    }, 22);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
$$('[data-count]').forEach((el) => counterObserver.observe(el));

const phrases = [
  'Generative AI Engineer',
  'RAG Systems Builder',
  'LLM Fine-Tuning Practitioner',
  'MLOps and Cloud AI Engineer',
  'Agentic Workflow Developer'
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typedText = $('#typedText');
function typeLoop() {
  if (!typedText) return;
  const phrase = phrases[phraseIndex];
  typedText.textContent = phrase.slice(0, charIndex);
  if (!deleting && charIndex < phrase.length) charIndex++;
  else if (deleting && charIndex > 0) charIndex--;
  else if (!deleting && charIndex === phrase.length) deleting = true;
  else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
  const delay = deleting ? 48 : charIndex === phrase.length ? 1300 : 72;
  setTimeout(typeLoop, delay);
}
typeLoop();

const canvas = $('#networkCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 72 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    r: Math.random() * 2 + 1
  }));
  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(260, 260, 10, 260, 260, 260);
    gradient.addColorStop(0, 'rgba(34,211,238,0.16)');
    gradient.addColorStop(1, 'rgba(167,139,250,0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 92) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${1 - distance / 92})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawNetwork);
  }
  drawNetwork();
}

const answers = {
  strongest: 'Sai’s strongest AI experience is building production document intelligence systems: credential verification, RAG pipelines, LLM classification, NER extraction and cloud inference with measurable outcomes like 93% extraction accuracy and 300K+ daily inference requests.',
  rag: 'Sai has built RAG systems using LangChain and FAISS over large knowledge bases, including credential templates, verification rules and 400K+ financial contracts. His RAG work improved matching accuracy by 34% and clause retrieval precision by 29%.',
  cloud: 'Sai uses AWS SageMaker, Bedrock, EC2, S3, Lambda, EKS, Azure AI Foundry, Azure ML, AKS, Azure OpenAI, Docker, Kubernetes, MLflow and GitHub Actions for production AI delivery.',
  contact: 'You can contact Sai at bandisaimanikiran@gmail.com, call +1 (734) 985-4467, view GitHub at github.com/sbandi5, or LinkedIn at linkedin.com/in/sai-mani-kiran-bandi.',
  education: 'Sai is pursuing an M.S. in Computer Science at Eastern Michigan University and holds a B.S. in Electronics and Communication Engineering from Bharath Institute of Higher Education and Research Centre.',
  default: 'Sai is an AI/ML Engineer specializing in Generative AI, RAG, LLM fine-tuning, Agentic AI, MLOps, AWS, Azure and secure production AI systems. Try asking about RAG, cloud, projects, education or contact.'
};
const chatForm = $('#chatForm');
const chatInput = $('#chatInput');
const chatMessages = $('#chatMessages');
function getAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes('rag') || q.includes('retrieval')) return answers.rag;
  if (q.includes('cloud') || q.includes('aws') || q.includes('azure') || q.includes('deployment')) return answers.cloud;
  if (q.includes('contact') || q.includes('email') || q.includes('phone')) return answers.contact;
  if (q.includes('education') || q.includes('degree') || q.includes('university')) return answers.education;
  if (q.includes('strong') || q.includes('experience') || q.includes('project')) return answers.strongest;
  return answers.default;
}
function appendMessage(text, type) {
  const div = document.createElement('div');
  div.className = `${type} message`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function askBot(question) {
  if (!question.trim()) return;
  appendMessage(question, 'user');
  setTimeout(() => appendMessage(getAnswer(question), 'bot'), 350);
}
chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  askBot(chatInput.value);
  chatInput.value = '';
});
$$('[data-question]').forEach((button) => button.addEventListener('click', () => askBot(button.dataset.question)));

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
