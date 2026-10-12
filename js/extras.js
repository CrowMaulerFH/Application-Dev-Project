/* EthicsCodex: topic index, prev/next links, gallery, case pictures, deep links to accordions */
const IMG_FB = "this.onerror=null;this.src='images/placeholder.svg'";
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ORDER = ['codes','duties','accountability','decisions','cases','gallery','quiz'];
const NAMES = { topics:'Topics', codes:'Codes of ethics', duties:'Responsibilities', accountability:'Accountability', decisions:'Decisions and compliance', cases:'Case studies', gallery:'Gallery', quiz:'Quiz' };

// Topic index (each card jumps straight to its section)
const TOPICS = [['codes','scale','Codes of ethics','PCS tenets, principles, ACM and IEEE'],['duties','lock','Responsibilities','Privacy, accessibility, competence'],['accountability','brief','Accountability','Conduct, laws, lessons learned'],['decisions','globe','Decisions and compliance','Frameworks, GDPR, RA 10173'],['cases','book','Case studies','Practice on real scenarios'],['quiz','shield','Quiz','Test what you learned']];
$('codes').insertAdjacentHTML('beforebegin', `<section id="topics" class="sec"><h2>Choose a topic</h2><div class="grid three">${TOPICS.map(t => `<a class="topic" href="#${t[0]}"><span class="ico">${svg(t[1])}</span><b>${t[2]}</b><span>${t[3]}</span></a>`).join('')}</div></section>`);

// Gallery: each item has its own image file. Missing files fall back to placeholder.svg
const G = [
  ['Cybersecurity at work', 'Protecting systems and data',      'images/cybersec_atwork.jpg'],
  ['Data privacy',          'Handling personal data with care', 'images/Data_privacy.jpg'],
  ['Inclusive technology',  'Designing for everyone',           'images/inclusive_tech.jpg'],
  ['Team collaboration',    'Making ethical decisions together','images/team_colla.jpg']
];
$('quiz').insertAdjacentHTML('beforebegin', `<section id="gallery" class="sec alt"><h2>Gallery</h2><p class="intro">Technology and ethics in everyday life.</p><div class="grid four">${G.map(g => `<figure class="fig"><img src="${g[2]}" alt="${g[0]}" loading="lazy" width="400" height="260" onerror="${IMG_FB}"><figcaption><b>${g[0]}</b>${g[1]}</figcaption></figure>`).join('')}</div></section>`);
['topics','gallery'].forEach(id => io.observe($(id)));

// Case pictures: shown inside each dropdown after pressing it. Files: images/case1.png, case2.png, case3.png (missing files fall back to placeholder.svg)
$$('#cases details').forEach((d, i) => { d.id = 'case-' + (i + 1); d.querySelector('summary').insertAdjacentHTML('afterend', `<img class="cimg" src="images/case${i + 1}.png" alt="Case study ${i + 1}" onerror="${IMG_FB}">`); });
$$('#codes .acc details').forEach(d => d.id = 'tenet-' + slug(d.querySelector('summary').textContent));


// Optional hero photo: images/hero.jpg replaces the illustration when present
const hi = new Image(); hi.onload = () => { $('heroArt').innerHTML = '<img class="himg" src="images/hero.jpg" alt="Technology and ethics">'; }; hi.src = 'images/hero.jpg';

// Previous / next links at the end of every section
ORDER.forEach((id, k) => {
  const p = ORDER[k - 1] || 'topics', n = ORDER[k + 1];
  $(id).insertAdjacentHTML('beforeend', `<div class="nextnav"><a href="#${p}">&larr; ${NAMES[p]}</a>${n ? `<a href="#${n}">${NAMES[n]} &rarr;</a>` : '<a href="#top">Back to top &uarr;</a>'}</div>`);
});

// Opening a link that points to an accordion also expands it
const openHash = () => { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t && t.tagName === 'DETAILS') t.open = true; };
addEventListener('hashchange', openHash);
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); const t = a && document.getElementById(a.hash.slice(1)); if (t && t.tagName === 'DETAILS') t.open = true; });
openHash();

// Lightbox: click any gallery or case picture to view it larger (Esc or the x closes it)
document.body.insertAdjacentHTML('beforeend', '<dialog id="lb" aria-label="Picture viewer"><button id="lbX" aria-label="Close picture">&times;</button><img id="lbImg" alt=""><p id="lbCap"></p></dialog>');
document.addEventListener('click', e => {
  const im = e.target.closest('.fig img, .cimg'); if (!im) return;
  $('lbImg').src = im.src; $('lbImg').alt = im.alt; $('lbCap').textContent = im.alt; $('lb').showModal();
});
$('lbX').onclick = () => $('lb').close();
$('lb').addEventListener('click', e => { if (e.target.id === 'lb') $('lb').close(); });

/* ---------- Hero background: animated word cloud ----------
   Words fly in from all sides, converge into a packed cloud, hold, scatter, and repeat.
   Edit WORDS to change the vocabulary: [text, weight]. Bigger weight = bigger word. */
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const WORDS = [
    ['ethics',10],['principles',6],['integrity',6],['moral',5.5],['conduct',4.2],['honor',4.2],['right',4.2],['value',4],
    ['accountability',3.6],['privacy',3.8],['responsibility',3.2],['professional',3.2],['confidentiality',3],['justice',3.2],
    ['honesty',3],['fairness',3],['compliance',3],['trust',3],['code',3.2],['duty',2.8],['security',3],['respect',2.8],
    ['transparency',2.6],['decision',2.6],['data',2.8],['GDPR',2.6],['RA 10173',2.4],['law',3],['rules',2.6],['truth',2.8],
    ['dilemma',2.4],['conscience',2.4],['regulation',2.4],['policy',2.2],['good',2.4],['wrong',2.2],['fair',2.2],
    ['choice',2.4],['social',2.2],['honest',2.2],['integrity',0]
  ].filter(w => w[1] > 0);

  const COLORS = ['#ffffff', '#fcd116', '#ff6b7a', '#9cc0ff'];
  const ALPHA = 0.34;                  // word visibility (0 to 1). Raise for bolder words, lower for subtler.
  const DUR = 1700, SPREAD = 2400;     // ms: each word's flight time, and how staggered the arrivals are
  const HOLD = 7000, OUT = 1400;       // ms: time the finished cloud stays, and the scatter-out time
  const END_IN = DUR + SPREAD, HOLD_END = END_IN + HOLD, CYCLE = HOLD_END + OUT + 300;

  // Hero layout: canvas sits behind the text
  const st = document.createElement('style');
  st.textContent = `.hero{position:relative;overflow:hidden}
  .hero-words{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
  .hero>.hero-text,.hero>.hero-art{position:relative;z-index:1}`;
  document.head.append(st);

  const cv = document.createElement('canvas');
  cv.className = 'hero-words';
  cv.setAttribute('aria-hidden', 'true');
  hero.prepend(cv);
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // Random look for each round: which words are vertical, colours, arrival order, spin
  const base = WORDS.map(([txt, wt]) => ({ txt, wt }));
  const reroll = () => base.forEach(w => {
    w.vertical = w.wt < 4 && Math.random() < 0.18;
    w.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    w.delay = Math.random() * SPREAD;
    w.spin = (Math.random() - 0.5) * 3;
    w.phase = Math.random() * 6.28;
    w.key = w.wt >= 10 ? 99 : w.wt * (0.6 + 0.8 * Math.random());   // placement order, so positions differ each round
  });
  reroll();

  let W = 0, H = 0, items = [];

  function pack(k) {
    const rects = [], out = [], M = 12, PAD = 6;
    const order = [...base].sort((a, b) => b.key - a.key);
    for (const w of order) {
      const size = Math.max(11, w.wt * k), font = `700 ${size}px Figtree, system-ui, sans-serif`;
      ctx.font = font;
      const tw = ctx.measureText(w.txt).width, th = size * 0.82;
      const bw = w.vertical ? th : tw, bh = w.vertical ? tw : th;
      const cx = W / 2 + (Math.random() - 0.5) * W * 0.4, cy = H / 2 + (Math.random() - 0.5) * H * 0.4;
      const a0 = Math.random() * 6.28, dir = Math.random() < 0.5 ? 1 : -1;
      let spot = null;
      for (let i = 0; i < 4000 && !spot; i++) {          // spiral outward from the centre
        const a = a0 + dir * i * 0.25, r = i * 0.5;
        const x = cx + Math.cos(a) * r * 1.5, y = cy + Math.sin(a) * r;
        if (x - bw / 2 < M || x + bw / 2 > W - M || y - bh / 2 < M || y + bh / 2 > H - M) continue;
        if (rects.some(q => Math.abs(x - q.x) < (bw + q.w) / 2 + PAD && Math.abs(y - q.y) < (bh + q.h) / 2 + PAD)) continue;
        spot = { x, y };
      }
      if (!spot) return null;
      rects.push({ x: spot.x, y: spot.y, w: bw, h: bh });
      const ang = Math.random() * 6.28, dist = Math.hypot(W, H) * 0.65;
      out.push({ ...w, font, x: spot.x, y: spot.y, rot: w.vertical ? -Math.PI / 2 : 0,
        sx: W / 2 + Math.cos(ang) * dist, sy: H / 2 + Math.sin(ang) * dist,
        alpha: w.wt >= 10 ? ALPHA + 0.1 : ALPHA });
    }
    return out;
  }

  function layout() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    if (!W || !H) return;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let k = W / 50, res = null;
    for (let n = 0; n < 40 && !res; n++, k *= 0.93) res = pack(k);   // shrink until every word fits
    items = res || [];
  }

  const clamp = v => Math.max(0, Math.min(1, v));
  const easeOut = p => 1 - Math.pow(1 - p, 3), easeIn = p => p * p * p;

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const T = t % CYCLE;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const it of items) {
      const u = T < HOLD_END ? easeOut(clamp((T - it.delay) / DUR)) : 1 - easeIn(clamp((T - HOLD_END) / OUT));
      if (u <= 0) continue;
      const f = Math.sin(t / 1600 + it.phase) * 3 * u * u * u * u;   // gentle float once settled
      ctx.save();
      ctx.translate(it.sx + (it.x - it.sx) * u + f, it.sy + (it.y - it.sy) * u + f);
      ctx.rotate(it.rot + (1 - u) * it.spin);
      ctx.scale(0.5 + 0.5 * u, 0.5 + 0.5 * u);
      ctx.globalAlpha = it.alpha * Math.min(1, u * 1.5);
      ctx.fillStyle = it.col; ctx.font = it.font;
      ctx.fillText(it.txt, 0, 0);
      ctx.restore();
    }
  }

  // Run only while the hero is on screen and the tab is visible
  let raf = 0, last = 0, onScreen = true;
  let shuffledFor = -1;
  const frame = now => {
    const t = now - t0, c = Math.floor(t / CYCLE);
    if (t % CYCLE >= HOLD_END + OUT && shuffledFor !== c) { shuffledFor = c; reroll(); layout(); }   // new arrangement while nothing is visible
    draw(t); last = t; raf = requestAnimationFrame(frame);
  };
  let t0 = 0;
  const sync = () => {
    const go = onScreen && !document.hidden && !reduce.matches;
    if (go && !raf) { t0 = performance.now() - last; raf = requestAnimationFrame(frame); }
    if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (reduce.matches) draw(END_IN + 1);                      // static finished cloud
  };
  new IntersectionObserver(e => { onScreen = e[0].isIntersecting; sync(); }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener?.('change', sync);

  let rt;
  new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { layout(); sync(); }, 200); }).observe(hero);

  (document.fonts?.ready || Promise.resolve()).then(() => { layout(); sync(); });
})();