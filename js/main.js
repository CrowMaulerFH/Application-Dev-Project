/* EthicsCodex: site behavior (icons, hero art, menu, theme, scroll effects, tabs, case studies). Shared helpers $ and $$ are used by quiz.js */
const $ = id => document.getElementById(id);
const $$ = s => [...document.querySelectorAll(s)];

/* ---------- Icons (inline SVG, no external images needed) ---------- */
const ICONS = {
  scale:'M12 3v18M5 21h14M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z',
  lock:'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',
  people:'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 8a2.5 2.5 0 110 5M17 15c2.5 0 4 1.8 4 4',
  book:'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5',
  brief:'M3 8h18v12H3zM9 8V5h6v3M3 13h18',
  globe:'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4'
};
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[k]}"/></svg>`;
const MAP = [[/privacy|confiden/i,'lock'],[/access|rights/i,'people'],[/compet|learn/i,'book'],[/interest|intellect|codes/i,'brief'],[/social|justice/i,'globe'],[/integrity|utilitarian/i,'scale']];
$$('.card').forEach(c => {
  const t = c.querySelector('h4').textContent;
  const k = (MAP.find(m => m[0].test(t)) || [0,'shield'])[1];
  c.insertAdjacentHTML('afterbegin', `<div class="ico">${svg(k)}</div>`);
});
const BANNERS = { codes:['scale','Principles that guide every IT professional.'], duties:['lock','Protecting people, data, and trust.'], accountability:['brief','Own your work, successes and failures.'], decisions:['globe','Innovate responsibly within the law.'], cases:['book','Practice ethics on real situations.'] };
Object.entries(BANNERS).forEach(([id,[k,t]]) => {
  const s = $(id), h = s.querySelector('h2');
  h.insertAdjacentHTML('afterend', `<div class="banner" role="img" aria-label="${t}"><img class="bimg" src="images/${id}.jpg" alt="" loading="lazy" onerror="this.remove()">${svg(k)}<p>${t}</p></div>`);
});

/* ---------- Hero illustration ---------- */
$('heroArt').innerHTML = `<svg viewBox="0 0 400 340" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="360" height="300" rx="24" fill="#fff" opacity=".1"/><circle cx="320" cy="70" r="46" fill="#ce1126"/><circle cx="90" cy="270" r="38" fill="#fcd116"/><path d="M200 50l110 40v80c0 70-48 110-110 126-62-16-110-56-110-126V90z" fill="#fff"/><path d="M200 50l110 40v80c0 70-48 110-110 126z" fill="#dbe6fb"/><g fill="none" stroke="#0038a8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M200 105v110M160 215h80M150 130h100M150 130l-18 40a18 18 0 0036 0zM250 130l-18 40a18 18 0 0036 0z"/></g><g stroke="#fcd116" stroke-width="4" fill="#fcd116"><circle cx="60" cy="120" r="5"/><circle cx="340" cy="230" r="5"/><path d="M60 120h30M340 230h-30" fill="none"/></g></svg>`;

/* ---------- Menu, theme, progress, back-to-top ---------- */
const burger = $('burger'), menu = $('menu');
burger.onclick = () => burger.setAttribute('aria-expanded', menu.classList.toggle('open'));
menu.onclick = e => { if (e.target.tagName === 'A') menu.classList.remove('open'); };
const root = document.documentElement;
try { if (localStorage.getItem('theme') === 'dark') root.dataset.theme = 'dark'; } catch(e) {}
const label = () => $('theme').textContent = root.dataset.theme === 'dark' ? 'Light mode' : 'Dark mode';
label();
$('theme').onclick = () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch(e) {}
  label();
};
addEventListener('scroll', () => {
  $('progress').style.width = (root.scrollTop / (root.scrollHeight - root.clientHeight) * 100) + '%';
  $('toTop').hidden = root.scrollTop < 600;
}, { passive: true });
$('toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

/* ---------- Active nav link, reveal, counters ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  if (e.target.matches('section[id]')) $$('nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('section[id]').forEach(s => io.observe(s));
const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { threshold: .12 });
$$('.card,.panel,.acc details').forEach(el => { el.classList.add('reveal'); rv.observe(el); });
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count; let n = 0;
  const t = setInterval(() => { el.textContent = ++n; if (n >= end) clearInterval(t); }, 900 / end);
  co.unobserve(el);
}));
$$('[data-count]').forEach(el => co.observe(el));

/* ---------- Comparison tabs ---------- */
$$('.tabs button').forEach(btn => btn.onclick = () => {
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', b === btn));
  $$('.tabpanel').forEach(p => p.hidden = p.id !== btn.dataset.tab);
});

/* ---------- Case studies: reflection box + model answer ---------- */
const MODEL = [
  'Accountability is shared: the IT staff for weak controls, management for funding and oversight, and the agency overall. Hackers are criminally liable, but that does not remove the duty to protect data. The agency broke confidentiality and quality duties and the Data Privacy Act. Prompt, honest public notice and a clear fix plan would have rebuilt trust.',
  'Hiding the flaw breaks integrity, risks harm to clients, and may violate the law. The developer should document the flaw, report it in writing to management and the compliance or data protection officer, and escalate if ignored. Transparency protects clients from loss and the bank from larger legal and reputational damage.',
  'This violates the confidentiality principle, the Data Privacy Act, and the professional duty to avoid conflicts of interest. The consultant should have used data only for the agreed purpose. Organizations can prevent this with access controls, audit logs, NDAs, training, and clear penalties.'
];
$$('#cases details').forEach((d, i) => {
  d.insertAdjacentHTML('beforeend', `<textarea class="mine" aria-label="Your answer" placeholder="Type your answer to the questions here..."></textarea><button class="btn" type="button">Show model answer</button><p class="model"><strong>Model answer:</strong> ${MODEL[i]}</p>`);
  const b = d.querySelector('.btn'), m = d.querySelector('.model');
  b.onclick = () => { m.classList.toggle('on'); b.textContent = m.classList.contains('on') ? 'Hide model answer' : 'Show model answer'; };
});
