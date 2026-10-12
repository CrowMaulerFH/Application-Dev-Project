/* EthicsCodex: quiz engine. Edit the BANK array to change questions. Questions and options are shuffled on every attempt. */
/* ---------- Quiz (a = index of correct option; order is shuffled each attempt) ---------- */
const BANK = [
  { q:'What is a code of ethics?', o:['A software license','A formal set of principles that govern professional behavior','A programming standard','A company dress code'], a:1, why:'It ensures integrity and accountability in practice.' },
  { q:'Which PCS tenet forbids disclosing client information without consent, unless legally required?', o:['Public welfare','Quality assurance','Confidentiality','Truthful representation'], a:2, why:'Confidentiality protects information gained during professional duties.' },
  { q:'Which Philippine law is the Data Privacy Act of 2012?', o:['RA 10173','RA 10175','RA 8293','RA 9995'], a:0, why:'RA 10175 is the Cybercrime Prevention Act; RA 8293 is the IP Code.' },
  { q:'Which agency enforces the Data Privacy Act?', o:['DICT','National Privacy Commission','PCS','NBI'], a:1, why:'The NPC was created by the Act to enforce compliance.' },
  { q:'Under GDPR, how soon must a data breach be notified?', o:['24 hours','72 hours','7 days','30 days'], a:1, why:'GDPR requires breach notification within 72 hours.' },
  { q:'Which framework chooses the option that benefits the greatest number of people?', o:['Utilitarian','Rights-based','Justice/fairness','Professional codes'], a:0, why:'Utilitarian ethics maximizes benefit and minimizes harm overall.' },
  { q:'Accountability is best described as…', o:['Following orders','Taking responsibility for actions, decisions and system outcomes','Avoiding all risk','Blaming the vendor'], a:1, why:'It includes owning successes and failures and accepting consequences.' },
  { q:'A developer finds a critical flaw in a banking system, and management wants it hidden. What should they do?', o:['Stay quiet to meet the deadline','Leak it publicly right away','Disclose and report the flaw through proper channels','Fix it secretly'], a:2, why:'Integrity and transparency protect clients and the organization.' },
  { q:'WCAG is a standard for…', o:['Data encryption','Web accessibility','Software licensing','Network speed'], a:1, why:'WCAG guides accessible design for people with disabilities.' },
  { q:'What does "proactive compliance" mean?', o:['Checking the law after launch','Ignoring regulation','Building legal checks into the development lifecycle','Hiring a lawyer only when sued'], a:2, why:'Legal checks should not be afterthoughts.' },
  { q:'Which PCS tenet requires stating your competence and capabilities accurately?', o:['Truthful representation','Continuing education','Public knowledge','Professionalism'], a:0, why:'Services must be advertised clearly and truthfully.' },
  { q:'The Data Privacy Act requires organizations to appoint a…', o:['Chief Executive Officer','Data Protection Officer','Network Engineer','Project Sponsor'], a:1, why:'The DPO oversees compliance and data subject rights.' },
  { q:'GDPR applies to organizations that…', o:['Are located only in Europe','Handle EU citizens\' data','Have over 1,000 employees','Sell hardware'], a:1, why:'Its reach follows the data subjects, not the company location.' },
  { q:'Which is an example of social responsibility in technology?', o:['Maximizing ad clicks','Supporting digital literacy and bridging the digital divide','Collecting extra user data','Delaying security updates'], a:1, why:'Social responsibility considers technology\'s broader impact on society.' },
  { q:'A consultant uses client data for personal gain. Which principle is most directly violated?', o:['Confidentiality','Continuing education','Quality assurance','Public knowledge'], a:0, why:'Client information must be protected and used only as agreed.' }
];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
let Q = [], i = 0, score = 0, locked = false, missed = [], t0 = 0, tick = null;
const esc = s => s.replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

function start() {
  Q = shuffle(BANK).map(x => ({ ...x, opts: shuffle(x.o.map((t, k) => ({ t, ok: k === x.a }))) }));
  i = 0; score = 0; missed = [];
  t0 = Date.now(); clearInterval(tick);
  tick = setInterval(() => $('qTime').textContent = fmt(Math.round((Date.now() - t0) / 1000)), 1000);
  $('qTime').textContent = '0:00';
  $('result').hidden = true; $('quizBox').hidden = false; show();
}
function show() {
  const x = Q[i]; locked = false;
  $('qCount').textContent = `Question ${i + 1} of ${Q.length}`;
  $('qBar').style.width = (i / Q.length * 100) + '%';
  $('qText').textContent = x.q; $('qFeed').textContent = ''; $('qNext').hidden = true;
  $('qNext').textContent = i === Q.length - 1 ? 'See results' : 'Next question';
  $('qOpts').innerHTML = '';
  x.opts.forEach(o => {
    const b = document.createElement('button');
    b.textContent = o.t; b.onclick = () => answer(o, b);
    $('qOpts').appendChild(b);
  });
}
function answer(o, b) {
  if (locked) return; locked = true;
  const x = Q[i], bs = [...$('qOpts').children];
  bs.forEach((el, k) => { el.disabled = true; if (x.opts[k].ok) el.classList.add('right'); });
  if (o.ok) { score++; $('qFeed').textContent = 'Correct. ' + x.why; }
  else { b.classList.add('wrong'); missed.push(x); $('qFeed').textContent = 'Not quite. ' + x.why; }
  $('qNext').hidden = false; $('qNext').focus();
}
$('qNext').onclick = () => {
  if (++i < Q.length) return show();
  clearInterval(tick); $('quizBox').hidden = true; $('result').hidden = false;
  const pct = Math.round(score / Q.length * 100);
  Auth.save({ score, total: Q.length, time: Math.round((Date.now() - t0) / 1000), date: new Date().toLocaleDateString() });
  $('score').textContent = `${score} / ${Q.length} (${pct}%) in ${fmt(Math.round((Date.now() - t0) / 1000))}`;
  $('verdict').textContent = pct >= 80 ? 'Excellent. You know your professional ethics.' : pct >= 60 ? 'Good work. Review the topics you missed and try again.' : 'Keep going. Re-read the lessons above and retake the quiz.';
  $('review').innerHTML = missed.length ? '<h4>Review your missed questions</h4><ul>' + missed.map(m => `<li><strong>${m.q}</strong><br>Answer: ${m.o[m.a]}. ${m.why}</li>`).join('') + '</ul>' : '<p>Perfect score. Nothing to review.</p>';
};
$('retry').onclick = renderStart;
$('result').insertAdjacentHTML('beforeend', '<div id="review" class="review"></div>');
$('result').insertBefore($('review'), $('retry'));
/* ---------- Start panel: the timer and quiz begin only when a logged-in student presses Start ---------- */
$('quizBox').insertAdjacentHTML('beforebegin', '<div class="quiz" id="quizStart"></div>');
$('quizBox').hidden = true; $('result').hidden = true;
function renderStart() {
  clearInterval(tick); $('quizBox').hidden = true; $('result').hidden = true; $('quizStart').hidden = false;
  const m = Auth.me(), box = $('quizStart');
  if (!m) {
    box.innerHTML = '<h3>Ready to test yourself?</h3><p>Log in or create a free account to take the quiz. Your scores are saved on this device.</p><button class="btn" id="goAuth">Log in to start</button>';
    $('goAuth').onclick = () => openAuth(); return;
  }
  const h = Auth.scores(), best = h.length ? Math.max(...h.map(x => x.score)) : null;
  box.innerHTML = `<h3>Welcome, ${esc(m.name)}</h3><p>${BANK.length} questions. Your timer starts when you press Start.${best !== null ? ` Best score: <strong>${best}/${BANK.length}</strong> (${h.length} attempt${h.length > 1 ? 's' : ''}).` : ''}</p><button class="btn" id="goStart">Start quiz</button>` +
    (h.length ? '<h4>Recent attempts</h4><ul>' + h.slice(-5).reverse().map(x => `<li>${x.date}: ${x.score}/${x.total} in ${fmt(x.time)}</li>`).join('') + '</ul>' : '');
  $('goStart').onclick = () => { $('quizStart').hidden = true; start(); };
}
document.addEventListener('authchange', () => { if (!$('quizBox').hidden ? !Auth.me() : $('result').hidden) renderStart(); });
renderStart();