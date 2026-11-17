// ==========================================================================
// YUVRAJ PATEL // MODULAR PORTFOLIO INTERACTION ENGINE
// Dynamic configuration-driven architecture via window.PortfolioConfig
// ==========================================================================

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;

// Active Configuration instance
const CFG = (window.PortfolioConfig && window.PortfolioConfig.get) 
  ? window.PortfolioConfig.get() 
  : null;

/* ---------- 01. Module Visibility & Dom Pre-Processing ---------- */
(function applyModularSettings(){
  if (!CFG) return;

  const m = CFG.modules || {};
  if (m.pullCordToggle === false) $('#cord')?.remove();
  if (m.doorsSection === false) $('#works')?.remove();
  if (m.storyTimeline === false) $('#about')?.remove();
  if (m.abilityCard === false) { $('#holoOpen')?.remove(); $('#holo')?.remove(); }
  if (m.aiAssistantDrawer === false) {
    $('#openAiNavBtn')?.closest('li')?.remove();
    $('#heroAiBtn')?.remove();
    $('#aiDrawer')?.remove();
  }
  if (m.contactModal === false) { $('#modal')?.remove(); }
  if (m.footerWordmark === false) { $('.sf__word')?.remove(); }

  // Populate dynamic personal text
  if (CFG.personal){
    const p = CFG.personal;
    if ($('.fig img')) $('.fig img').src = p.profilePhoto || 'profile.jpg';
    if ($('.hc__bg')) $('.hc__bg').src = p.profilePhoto || 'profile.jpg';
    if ($('.hc__name')) $('.hc__name').textContent = p.fullName;
    if ($('.hc__subtext')) $('.hc__subtext').textContent = p.institution;
    if ($('.hc__monogram')) $('.hc__monogram').textContent = p.monogram;
    if ($('.sf__word span')) $('.sf__word span').textContent = p.footerWordmark || p.fullName.toUpperCase();
    if ($('.sf__p')) $('.sf__p').textContent = p.footerBio;

    // Status hairline
    const heroBar = $('.hero__bar');
    if (heroBar){
      const spans = heroBar.querySelectorAll('span');
      if (spans[0]) spans[0].textContent = p.statusText;
      if (spans[1]) spans[1].textContent = p.locationText;
    }

    // Dynamic Social Links
    $$('a[href*="github.com/yuvrajpatelair"]').forEach(a => a.href = p.githubUrl);
    $$('a[href*="linkedin.com"]').forEach(a => a.href = p.linkedinUrl);
    $$('a[href^="mailto:"]').forEach(a => {
      a.href = 'mailto:' + p.email;
      if (a.textContent.includes('@')) a.textContent = p.email + ' ↗';
    });
  }

  // Populate dynamic hero text
  if (CFG.hero){
    const h = CFG.hero;
    if ($('.hero__left .eyebrow')) $('.hero__left .eyebrow').textContent = h.eyebrow;
    if ($('.hero__left .line span')) $('.hero__left .line span').textContent = h.greeting;
    if ($('.hero__left .line.soft')) $('.hero__left .line.soft').textContent = CFG.personal.headlinePrefix || "I am an";
  }

  // Populate dynamic Ability Card specs
  if (CFG.abilityCard && CFG.abilityCard.specs){
    const statsContainer = $('.hc__stats');
    if (statsContainer){
      statsContainer.innerHTML = CFG.abilityCard.specs.map(s => 
        '<div class="stat"><span class="k">' + escapeHtml(s.key) + '</span><span class="v">' + escapeHtml(s.val) + '</span></div>'
      ).join('');
    }
    const idCodeEl = $('.hc__back-box code');
    if (idCodeEl && CFG.abilityCard.idCode) idCodeEl.textContent = CFG.abilityCard.idCode;
  }
})();

/* ---------- 02. Adaptive Grid Scale-Up (Screens > 1920px) ---------- */
function applyAdaptiveGrid(){
  const FONT_BASE = 16, baseWidth = 1920, coef = 0.6666;
  const w = window.innerWidth;
  const widthReduction = ((baseWidth - w) / baseWidth) * 100;
  const size = FONT_BASE - (FONT_BASE * (widthReduction * coef)) / 100;
  if (w > baseWidth) root.style.fontSize = size + 'px';
  else root.style.fontSize = '';
}
applyAdaptiveGrid();
addEventListener('resize', applyAdaptiveGrid);

/* ---------- 03. Smooth Scroll Helper ---------- */
function scrollToId(id){
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

/* ---------- 04. Semi-Implicit Euler Spring Physics ---------- */
function spring({ tension, friction }, render){
  let x = 0, v = 0, target = 0, raf = 0;
  const step = () => {
    const dt = 1 / 60, a = tension * (target - x) - friction * v;
    v += a * dt; x += v * dt;
    render(x);
    if (Math.abs(target - x) > 0.0005 || Math.abs(v) > 0.0005) raf = requestAnimationFrame(step);
    else { x = target; v = 0; render(x); raf = 0; }
  };
  return {
    set(t){ target = t; if (!raf) raf = requestAnimationFrame(step); },
    get(){ return x; }
  };
}

/* ---------- 05. Declarative Hover Animations (data-h) ---------- */
function bindHovers(scope = document){
  if (!canHover) return;
  scope.querySelectorAll('[data-h]').forEach(el => {
    const props = el.dataset.h.split('|').map(p => {
      const [k, a, b] = p.trim().split(/\s+/);
      return { k, a: +a, b: +b };
    });
    const [tension, friction] = (el.dataset.hs || '320 18').split(/\s+/).map(Number);
    const trig = el.dataset.ht ? el.closest(el.dataset.ht) || el : el;
    const render = p => {
      const tr = [];
      props.forEach(({ k, a, b }) => {
        const v = a + (b - a) * p;
        if (k === 's') tr.push('scale(' + v.toFixed(4) + ')');
        if (k === 'x') tr.push('translateX(' + v.toFixed(2) + 'px)');
        if (k === 'y') tr.push('translateY(' + v.toFixed(2) + 'px)');
        if (k === 'o') el.style.opacity = v.toFixed(3);
      });
      if (tr.length) el.style.transform = tr.join(' ');
    };
    const s = spring({ tension, friction }, render);
    trig.addEventListener('pointerenter', () => s.set(1));
    trig.addEventListener('pointerleave', () => s.set(0));
  });
}
bindHovers();

/* ---------- 06. Live Clock & Local Time Ticker ---------- */
(function liveClock(){
  if (CFG && CFG.modules && CFG.modules.clockTicker === false) return;
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tick = () => {
    const d = new Date(), h = d.getHours(), m = d.getMinutes();
    const str = (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (h < 12 ? 'am' : 'pm');
    const dt = d.getDate() + ' ' + M[d.getMonth()] + ', ' + d.getFullYear();
    const ds = d.getDate() + ' ' + M[d.getMonth()];
    $$('[data-time]').forEach(e => e.textContent = str);
    $$('[data-ftime]').forEach(e => e.textContent = str);
    $$('[data-navtime]').forEach(e => e.textContent = str);
    $$('[data-date]').forEach(e => e.textContent = dt);
    $$('[data-dshort]').forEach(e => e.textContent = ds);
    $$('[data-fyear]').forEach(e => e.textContent = d.getFullYear());
  };
  tick();
  setInterval(tick, 15000);
})();

/* ---------- 07. Giant Wordmark Fitting ---------- */
function fitWordmark(){
  if (CFG && CFG.modules && CFG.modules.footerWordmark === false) return;
  $$('.sf').forEach(f => {
    const w = f.querySelector('.sf__word');
    if (!w) return;
    const span = [...w.children].find(s => getComputedStyle(s).display !== 'none');
    if (!span) return;
    w.style.setProperty('--wf', '100px');
    const k = (f.clientWidth * 0.955) / span.getBoundingClientRect().width;
    f.style.setProperty('--wf', (100 * k).toFixed(2) + 'px');
    w.style.removeProperty('--wf');
  });
}
fitWordmark();
addEventListener('resize', fitWordmark);
document.fonts?.ready.then(fitWordmark);

/* ---------- 08. Dark / Light Mode with View Transitions ---------- */
const MODE_KEY = 'yuvraj-mode';
const themeMeta = $('meta[name="theme-color"]');
function getMode(){ return root.dataset.mode === 'dark' ? 'dark' : 'light'; }
function setMode(m, animate = true){
  if (animate && !reduced && document.startViewTransition){
    document.startViewTransition(() => setMode(m, false));
    return;
  }
  if (m === 'dark') root.dataset.mode = 'dark';
  else delete root.dataset.mode;
  themeMeta?.setAttribute('content', m === 'dark' ? '#1A1818' : '#EEEAE6');
  $('#cordHit')?.setAttribute('aria-checked', String(m === 'dark'));
  try { localStorage.setItem(MODE_KEY, m); } catch (e) {}
}
try {
  const saved = localStorage.getItem(MODE_KEY);
  if (saved) setMode(saved, false);
  else setMode((CFG && CFG.theme && CFG.theme.defaultMode) || 'dark', false);
} catch (e) { setMode('dark', false); }
const toggleMode = () => setMode(getMode() === 'dark' ? 'light' : 'dark');

/* ---------- 09. Verlet Rope Pull-Cord ---------- */
(function pullCord(){
  const wrap = $('#cord'), cv = $('.cord__cv', wrap), hit = $('#cordHit');
  if (!wrap || !cv || !hit) return;
  const ctx = cv.getContext('2d');
  const N = 26, G = 4600, STEP = 1 / 120, ITER = 16;
  let dpr = 1, W = 300, H = 500, L = 220, EXT_MAX = 46, seg = 10, ax = 200, thick = 3.2, knobS = 1;
  let pts = [], ext = 0, extV = 0, armed = true;
  let grab = -1, target = null;
  let acc = 0, lastT = 0;

  function layout(){
    const rem = parseFloat(getComputedStyle(root).fontSize) || 16;
    const vw = innerWidth, vh = innerHeight;
    let offset = vw >= 1024 ? 4.25 * rem : 1.5 * rem;
    L = Math.min(270, Math.max(190, vh * 0.3));
    EXT_MAX = 70; thick = 3.2; knobS = 1;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(220, Math.round(offset + 120));
    H = Math.round(L + EXT_MAX + 150);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    wrap.style.width = W + 'px'; wrap.style.height = H + 'px';
    ax = W - offset;
    seg = L / (N - 1);
    if (!pts.length){
      pts = Array.from({ length: N }, (_, i) => ({ x: ax, y: i * seg, px: ax, py: i * seg }));
    } else {
      pts[0].x = pts[0].px = ax;
      pts[0].y = pts[0].py = 0;
    }
  }
  layout();
  addEventListener('resize', layout);

  function physicsStep(){
    const kSpring = 360, dSpring = 28;
    const a = -kSpring * ext - dSpring * extV;
    extV += a * STEP; ext += extV * STEP;
    if (ext < 0){ ext = 0; extV = 0; }
    pts[0].x = ax; pts[0].y = ext;
    const dt2 = STEP * STEP;
    for (let i = 1; i < N; i++){
      const p = pts[i];
      let vx = (p.x - p.px) * 0.995, vy = (p.y - p.py) * 0.995;
      p.px = p.x; p.py = p.y;
      p.x += vx; p.y += vy + G * dt2;
    }
    if (target && pts[grab]){
      pts[grab].x = target.x; pts[grab].y = target.y;
    }
    for (let it = 0; it < ITER; it++){
      pts[0].x = ax; pts[0].y = ext;
      for (let i = 0; i < N - 1; i++){
        const p1 = pts[i], p2 = pts[i + 1];
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const diff = (d - seg) / d;
        if (i === 0){
          p2.x -= dx * diff; p2.y -= dy * diff;
        } else {
          p1.x += dx * diff * 0.5; p1.y += dy * diff * 0.5;
          p2.x -= dx * diff * 0.5; p2.y -= dy * diff * 0.5;
        }
      }
      if (target && pts[grab]){ pts[grab].x = target.x; pts[grab].y = target.y; }
    }
  }

  function renderRope(){
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < N - 1; i++){
      const mx = (pts[i].x + pts[i + 1].x) * 0.5, my = (pts[i].y + pts[i + 1].y) * 0.5;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    ctx.lineTo(pts[N - 1].x, pts[N - 1].y);
    const dark = root.dataset.mode === 'dark';
    ctx.strokeStyle = dark ? 'rgba(232,228,224,0.7)' : 'rgba(26,24,24,0.7)';
    ctx.lineWidth = thick;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Knob at cord tip
    const end = pts[N - 1];
    ctx.save();
    ctx.translate(end.x, end.y);
    ctx.beginPath();
    ctx.arc(0, 7 * knobS, 7 * knobS, 0, Math.PI * 2);
    ctx.fillStyle = dark ? '#E8E4E0' : '#1A1818';
    ctx.fill();
    ctx.restore();

    hit.style.transform = 'translate3d(' + (end.x - 22) + 'px, ' + (end.y - 15) + 'px, 0)';
  }

  function loop(now){
    if (!lastT) lastT = now;
    let dt = (now - lastT) / 1000;
    lastT = now;
    acc += Math.min(dt, 0.05);
    while (acc >= STEP){ physicsStep(); acc -= STEP; }
    renderRope();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  hit.addEventListener('pointerdown', e => {
    target = { x: pts[N - 1].x, y: pts[N - 1].y };
    grab = N - 1;
    hit.setPointerCapture(e.pointerId);
  });
  hit.addEventListener('pointermove', e => {
    if (!target) return;
    const rect = cv.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
    if (target.y > L + 35 && armed){
      armed = false;
      toggleMode();
    }
  });
  const up = () => { target = null; armed = true; };
  hit.addEventListener('pointerup', up);
  hit.addEventListener('pointercancel', up);
  hit.addEventListener('click', () => {
    extV = 180;
    toggleMode();
  });
})();

/* ---------- 10. 3D Desk Flip-Calendar (Config-Driven Skills) ---------- */
(function flipCalendar(){
  const SKILLS = (CFG && CFG.hero && CFG.hero.skills && CFG.hero.skills.length)
    ? CFG.hero.skills
    : ['AI Engineer', 'Full-Stack Developer', 'MeetingShield Creator', 'Accessibility Builder', 'Problem Solver'];
  
  const HOLD = (CFG && CFG.hero && CFG.hero.flipHoldDuration) || 1800;
  const FLIP = 1200;
  const cal = $('#cal'); if (!cal) return;
  const body = $('.cal__body', cal), leaf = $('.cal__leaf', cal);
  const under = $('[data-under]', cal), face = $('.cal__face', cal);
  const measure = $('.cal__measure', cal), rings = $('.cal__rings', cal);
  const n = SKILLS.length;
  let i = 0, timer = 0, flipping = false;

  const paint = (page, k) => {
    if (!page) return;
    const w = $('.cal__word', page), no = $('.cal__no', page);
    if (w) w.textContent = SKILLS[k];
    if (no) no.textContent = String(k + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
  };
  paint(face, 0); paint(under, 1 % n);

  function fit(){
    cal.style.fontSize = '';
    const fs = parseFloat(getComputedStyle(cal).fontSize) || 16;
    let max = 0;
    for (const w of SKILLS){ measure.textContent = w; max = Math.max(max, measure.getBoundingClientRect().width); }
    const wEm = max / fs + 0.86;
    if (body) body.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');
    cal.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');
    const avail = (cal.closest('.h1') || cal).getBoundingClientRect().width - fs * 0.25;
    const need = wEm * fs;
    if (need > avail && avail > 0) cal.style.fontSize = (fs * avail / need).toFixed(2) + 'px';
    const count = Math.max(5, Math.round((wEm - 0.64) / 0.7) + 1);
    if (rings) rings.innerHTML = '<i></i>'.repeat(count);
    cal.querySelectorAll('.cal__holes').forEach(h => h.innerHTML = '<i></i>'.repeat(count));
  }
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', () => { clearTimeout(fit._t); fit._t = setTimeout(fit, 120); });

  function flip(){
    if (document.hidden){ timer = setTimeout(flip, 600); return; }
    flipping = true;
    const next = (i + 1) % n;
    if (reduced){
      i = next; paint(face, i); paint(under, (i + 1) % n);
      flipping = false; timer = setTimeout(flip, HOLD + 700); return;
    }
    const timing = { duration: FLIP, easing: 'cubic-bezier(.5,.05,.2,1)', fill: 'forwards' };
    face?.animate([{ opacity: 1 }, { opacity: 1, offset: .285 }, { opacity: 0, offset: .295 }, { opacity: 0 }], { duration: FLIP, easing: 'linear', fill: 'forwards' });
    $('.cal__rear', leaf)?.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.02)', offset: .29 }, { filter: 'brightness(.96)', offset: .45 }, { filter: 'brightness(.9)' }], { duration: FLIP, easing: 'linear', fill: 'forwards' });
    const a = leaf?.animate([
      { transform: 'translateZ(.004em) rotateX(0deg)' },
      { transform: 'translateZ(.004em) rotateX(352deg)' }
    ], timing);
    $('.cal__shade', face)?.animate([{ opacity: 0 }, { opacity: .45, offset: .2 }, { opacity: 0, offset: .275 }, { opacity: 0 }], { duration: FLIP, easing: 'linear', fill: 'forwards' });
    $('.cal__shade', under)?.animate([{ opacity: .7 }, { opacity: 0 }], { duration: FLIP * .9, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' });
    if (a){
      a.onfinish = () => {
        i = next;
        paint(face, i);
        paint(under, (i + 1) % n);
        leaf.style.transform = 'translateZ(.004em) rotateX(0deg)';
        face.style.opacity = 1;
        flipping = false;
        timer = setTimeout(flip, HOLD);
      };
    }
  }
  timer = setTimeout(flip, HOLD);
})();

/* ---------- 11. LiquidReveal: Cursor Trail on Hero Portrait ---------- */
(function liquidReveal(){
  if (CFG && CFG.modules && CFG.modules.liquidReveal === false) return;
  const fig = $('#fig'), canvas = $('#figCanvas');
  if (!fig || !canvas || reduced) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 1, H = 1;

  function resize(){
    const r = fig.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * dpr));
    H = Math.max(1, Math.round(r.height * dpr));
    canvas.width = W; canvas.height = H;
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
  }
  resize();
  addEventListener('resize', resize);

  const dots = [];
  fig.addEventListener('pointermove', e => {
    const r = fig.getBoundingClientRect();
    const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
    dots.push({ x, y, r: 40 * dpr, a: 0.45 });
    if (dots.length > 25) dots.shift();
  });

  function render(){
    ctx.clearRect(0, 0, W, H);
    for (let i = dots.length - 1; i >= 0; i--){
      const d = dots[i];
      d.a -= 0.012;
      if (d.a <= 0){ dots.splice(i, 1); continue; }
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
      g.addColorStop(0, 'rgba(168,85,247,' + d.a + ')');
      g.addColorStop(0.5, 'rgba(99,102,241,' + (d.a * 0.5) + ')');
      g.addColorStop(1, 'rgba(99,102,241,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();

/* ---------- 12. Doors: Config-Driven Modular Project Doors ---------- */
(function doors(){
  const DOORS = (CFG && CFG.doors && CFG.doors.length) ? CFG.doors : [];
  const sec = $('#works'); if (!sec || !DOORS.length) return;
  const row = $('.doors__row', sec);
  const dinfo = $('#dinfo');
  const badge = $('#doorCursor');

  // Dynamically render doors matching configuration
  if (row){
    row.innerHTML = DOORS.map((d, i) => `
      <li class="unit" style="--i:${i};--door:${d.doorColor || '#1e2d42'};--door-dk:${d.doorDarkColor || '#162233'}">
        <button class="doorway" aria-label="Open ${escapeHtml(d.title)} door" data-door-idx="${i}">
          <span class="casing"></span>
          <span class="opening">
            <span class="room"></span>
            <span class="spill"></span>
            <span class="door">
              <span class="door__flute"></span>
              <span class="plate">${escapeHtml(d.title)}</span>
              <span class="handle"><span class="handle__lever"></span><span class="handle__lock"></span></span>
              <span class="door__shade"></span>
              <span class="leak"></span>
            </span>
            <span class="sill"></span>
          </span>
          <span class="pool"></span>
        </button>
      </li>
    `).join('');
  }

  const units = $$('.unit', sec);
  const dotsEl = $('.doors__dots', sec);
  if (dotsEl){
    dotsEl.innerHTML = DOORS.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
  }

  const setInfo = i => {
    if (!dinfo || !DOORS[i]) return;
    const h = dinfo.querySelector('.dinfo__h'), t = dinfo.querySelector('.dinfo__t'), p = dinfo.querySelector('.dinfo__p');
    if (h) h.textContent = DOORS[i].title;
    if (t) t.textContent = DOORS[i].tagline;
    if (p) p.innerHTML = (DOORS[i].bullets || []).map(s => '<li>' + escapeHtml(s) + '</li>').join('');
    $$('.doors__dots i', sec).forEach((dot, k) => dot.classList.toggle('on', k === i));
  };
  setInfo(0);

  const place = e => { if (badge) badge.style.transform = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0) translate(-50%, -50%)'; };
  const showBadge = on => { if (badge) badge.classList.toggle('on', on); };

  if (canHover){
    addEventListener('pointermove', e => { if (badge?.classList.contains('on')) place(e); }, { passive: true });
  }

  units.forEach((u, i) => {
    const door = $('.door', u);
    const doorway = $('.doorway', u);
    if (!doorway) return;

    doorway.addEventListener('pointerenter', e => {
      place(e); showBadge(true);
      setInfo(i);
      door.style.transform = 'rotateY(26deg)';
      u.style.setProperty('--o', '0.35');
    });
    doorway.addEventListener('pointerleave', () => {
      showBadge(false);
      door.style.transform = 'rotateY(0deg)';
      u.style.setProperty('--o', '0');
    });

    doorway.addEventListener('click', () => {
      door.style.transform = 'rotateY(75deg)';
      u.style.setProperty('--o', '1');
      setTimeout(() => {
        const d = DOORS[i];
        if (d.actionType === 'drawer' || d.actionTarget === 'aiDrawer') openAiDrawer();
        else if (d.actionType === 'story' || d.actionTarget === 'about') scrollToId('about');
        else if (d.actionTarget) window.open(d.actionTarget, '_blank');
        
        setTimeout(() => {
          door.style.transform = 'rotateY(0deg)';
          u.style.setProperty('--o', '0');
        }, 1200);
      }, 400);
    });
  });
})();

/* ---------- 13. Story / Journey Timeline (Config-Driven) ---------- */
(function storyTimeline(){
  const CHAPTERS = (CFG && CFG.journey && CFG.journey.length) ? CFG.journey : [];
  const sec = $('#about'); if (!sec || !CHAPTERS.length) return;
  sec.style.setProperty('--n', CHAPTERS.length);

  const list = $('.story__list', sec);
  if (list){
    list.innerHTML = CHAPTERS.map((ch, i) => `
      <li class="ch ${ch.isCurrent ? 'ch--now' : ''}" data-y="${escapeHtml(ch.year)}" data-when="${escapeHtml(ch.dateRange)}">
        <p class="ch__date">${escapeHtml(ch.dateRange)}</p>
        <h3 class="ch__t">${escapeHtml(ch.title)}</h3>
        <p class="ch__org">${escapeHtml(ch.organization)}</p>
        <ul class="ch__b">
          ${(ch.bullets || []).map(b => '<li>' + escapeHtml(b) + '</li>').join('')}
        </ul>
      </li>
    `).join('');
  }

  const chs = $$('.ch', list);
  const cols = $$('.dg__c', sec), when = $('.story__when', sec), count = $('.story__count', sec);
  const dot = $('.story__dot', sec), rail = $('.story__rail', sec);
  const cv = $('.story__bg', sec), ctx = cv?.getContext('2d');
  const ofSpan = $('.story__of', sec);
  if (ofSpan) ofSpan.textContent = '/ ' + String(CHAPTERS.length).padStart(2, '0');

  let shownYear = '', shown = -1;
  const setYear = y => {
    if (y === shownYear) return;
    shownYear = y;
    String(y).split('').forEach((d, k) => {
      if (cols[k]) cols[k].style.setProperty('--d', d);
    });
  };

  const show = i => {
    if (i === shown || !chs[i]) return;
    shown = i;
    chs.forEach((c, k) => c.classList.toggle('on', k === i));
    setYear(chs[i].dataset.y);
    if (when) when.textContent = chs[i].dataset.when;
    if (count) count.textContent = String(i + 1).padStart(2, '0');
    sec.classList.toggle('is-now', i === 0);
  };
  show(0);

  // Background clock tunnel
  if (cv && ctx){
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resizeCv = () => {
      const r = cv.getBoundingClientRect();
      W = r.width * dpr; H = r.height * dpr;
      cv.width = W; cv.height = H;
    };
    resizeCv();
    addEventListener('resize', resizeCv);

    let angle = 0;
    const renderTunnel = () => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const dark = root.dataset.mode === 'dark';
      ctx.strokeStyle = dark ? 'rgba(232,228,224,0.06)' : 'rgba(26,24,24,0.06)';
      ctx.lineWidth = 1.5 * dpr;
      for (let r = 40 * dpr; r < W * 0.7; r += 35 * dpr){
        ctx.beginPath();
        ctx.arc(cx, cy, r, angle, angle + Math.PI * 1.5);
        ctx.stroke();
      }
      angle += 0.003;
      requestAnimationFrame(renderTunnel);
    };
    requestAnimationFrame(renderTunnel);
  }

  // Scroll tracking on story chapters
  addEventListener('scroll', () => {
    const mid = window.innerHeight * 0.5;
    chs.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) show(i);
    });
    if (dot && rail){
      const lr = list.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (mid - lr.top) / (lr.height || 1)));
      dot.style.transform = 'translateY(' + (pct * (rail.clientHeight - 12)) + 'px)';
    }
  }, { passive: true });
})();

/* ---------- 14. 3D Holographic Ability Card ---------- */
(function abilityCard(){
  const holo = $('#holo'), openBtn = $('#holoOpen'), closeBtn = $('#holoClose');
  const lite = $('#holoLite'), hc = $('#hc'), ld = $('#holoLd'), pct = $('#holoPct');
  if (!holo || !openBtn || !hc) return;

  let isOpen = false, loop = 0, t0 = 0, held = false;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const RX = 11, RY = 14;

  function step(now){
    const sway = held ? 0 : 1;
    const t = (now - t0) / 1000;
    cx += ((tx + sway * Math.sin(t * 0.62) * 0.34) - cx) * 0.12;
    cy += ((ty + sway * Math.sin(t * 0.47 + 1.1) * 0.22) - cy) * 0.12;
    const S = hc.style;
    S.setProperty('--px', cx.toFixed(4));
    S.setProperty('--py', cy.toFixed(4));
    S.setProperty('--ry', (cx * RY).toFixed(2) + 'deg');
    S.setProperty('--rx', (-cy * RX).toFixed(2) + 'deg');
    S.setProperty('--lift', Math.min(1, Math.hypot(cx, cy) * 1.3).toFixed(3));
    loop = requestAnimationFrame(step);
  }

  function show(){
    if (isOpen) return;
    isOpen = true;
    holo.hidden = false;
    requestAnimationFrame(() => holo.classList.add('on'));
    ld?.classList.remove('out', 'gone');
    if (pct) pct.textContent = '100%';
    setTimeout(() => {
      ld?.classList.add('out');
      lite.hidden = false;
      lite.classList.add('in');
      t0 = performance.now();
      loop = requestAnimationFrame(step);
    }, 400);
  }

  function hide(){
    if (!isOpen) return;
    isOpen = false;
    cancelAnimationFrame(loop);
    holo.classList.remove('on');
    setTimeout(() => {
      holo.hidden = true;
      lite.hidden = true;
      lite.classList.remove('in');
    }, 350);
  }

  openBtn.addEventListener('click', show);
  closeBtn?.addEventListener('click', hide);
  holo.addEventListener('click', e => { if (e.target === holo) hide(); });

  const clamp = v => Math.max(-1, Math.min(1, v));
  lite.addEventListener('pointermove', e => {
    const r = hc.getBoundingClientRect(); if (!r.width) return;
    const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
    if (u < -0.4 || u > 1.4 || v < -0.35 || v > 1.35){ held = false; tx = ty = 0; return; }
    held = true;
    hc.classList.add('live');
    tx = clamp((u - 0.5) * 2);
    ty = clamp((v - 0.5) * 2);
  }, { passive: true });
  lite.addEventListener('pointerleave', () => { held = false; tx = ty = 0; });

  // Tap to flip
  hc.addEventListener('click', () => hc.classList.toggle('flip'));
})();

/* ---------- 15. Contact Modal Questionnaire ---------- */
const modal = $('#modal'), form = $('#reqForm');
let curStep = 1;

function openModal(){
  if (!modal) return;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('on'));
  qzGo(1);
}
function closeModal(){
  if (!modal) return;
  modal.classList.remove('on');
  setTimeout(() => {
    modal.hidden = true;
    form?.reset();
    $('#mForm').hidden = false;
    $('#mSuccess').hidden = true;
  }, 300);
}

function qzGo(step){
  curStep = step;
  $$('.qz', form).forEach(f => {
    const s = +f.dataset.step;
    f.hidden = s !== step;
  });
  const bar = $('#qzBar'), stepLbl = $('#qzStep');
  if (bar) bar.style.width = (step / 4 * 100) + '%';
  if (stepLbl) stepLbl.textContent = step + ' of 4';
  const back = $('#mBack'), sendLbl = $('#mSendLbl');
  if (back) back.hidden = step === 1;
  if (sendLbl) sendLbl.textContent = step === 4 ? 'Send Email' : 'Next';
}

$$('[data-contact]').forEach(b => b.addEventListener('click', openModal));
$('#mClose')?.addEventListener('click', closeModal);
$('#mDone')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
$('#mBack')?.addEventListener('click', () => { if (curStep > 1) qzGo(curStep - 1); });

form?.addEventListener('submit', e => {
  e.preventDefault();
  if (curStep < 4){
    qzGo(curStep + 1);
  } else {
    const data = new FormData(form);
    const service = data.get('service') || 'General Project Collaboration';
    const timeline = data.get('timeline') || 'Flexible';
    const client = data.get('client_type') || 'Collaborator';
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const msg = data.get('project') || '';
    const targetEmail = (CFG && CFG.personal && CFG.personal.email) || 'yuvrajpatelair@gmail.com';

    const subject = encodeURIComponent('Collaboration Inquiry: ' + service + ' — ' + name);
    const body = encodeURIComponent(
      'Hi ' + ((CFG && CFG.personal && CFG.personal.firstName) || 'Yuvraj') + ',\n\n' +
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Type: ' + client + '\n' +
      'Project Area: ' + service + '\n' +
      'Timeline: ' + timeline + '\n\n' +
      'Message:\n' + msg + '\n\n' +
      'Sent from portfolio'
    );
    window.location.href = 'mailto:' + targetEmail + '?subject=' + subject + '&body=' + body;
    $('#mForm').hidden = true;
    $('#mSuccess').hidden = false;
  }
});

/* ---------- 16. Mobile Nav Menu ---------- */
const navm = $('#navm'), menuBtn = $('#menuBtn'), navClose = $('#navClose');
function openNav(){ if (navm){ navm.hidden = false; requestAnimationFrame(() => navm.classList.add('on')); } }
function closeNav(){ if (navm){ navm.classList.remove('on'); setTimeout(() => navm.hidden = true, 300); } }
menuBtn?.addEventListener('click', openNav);
navClose?.addEventListener('click', closeNav);
$('#navStart')?.addEventListener('click', () => { closeNav(); openModal(); });

// Build mobile navigation items dynamically
const NAV_ITEMS = [
  ['Home', 'home'],
  ['Projects Wall', 'works'],
  ['My Story (Timeline)', 'about'],
  ['Local AI Assistant', 'ai'],
  ['Contact & Hire', 'contact']
];
const navList = $('#navList');
if (navList){
  navList.innerHTML = NAV_ITEMS.map(([label, id]) => 
    '<li><button class="navm__item" data-nav="' + id + '">' + label + '</button></li>'
  ).join('');
  $$('.navm__item', navList).forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.nav;
      closeNav();
      if (id === 'home' || id === 'works' || id === 'about') scrollToId(id);
      else if (id === 'contact') openModal();
      else if (id === 'ai') openAiDrawer();
    });
  });
}

// Navigation links with data-go
$$('[data-go]').forEach(b => {
  b.addEventListener('click', () => {
    const id = b.dataset.go;
    scrollToId(id);
  });
});
$$('[data-door]').forEach(b => {
  b.addEventListener('click', () => {
    scrollToId('works');
  });
});

/* ---------- 17. Local AI Studio (Gemma & Hermes Integration) ---------- */
const aiDrawer = $('#aiDrawer'), aiOverlay = $('#aiDrawerOverlay'), aiClose = $('#aiDrawerClose');
function openAiDrawer(){
  if (!aiDrawer) return;
  aiDrawer.classList.add('open');
  aiDrawer.setAttribute('aria-hidden', 'false');
  $('#aiQueryInput')?.focus();
}
function closeAiDrawer(){
  if (!aiDrawer) return;
  aiDrawer.classList.remove('open');
  aiDrawer.setAttribute('aria-hidden', 'true');
}
$('#openAiNavBtn')?.addEventListener('click', openAiDrawer);
$('#heroAiBtn')?.addEventListener('click', openAiDrawer);
aiOverlay?.addEventListener('click', closeAiDrawer);
aiClose?.addEventListener('click', closeAiDrawer);

// Populate quick prompts from config
const quickPromptsContainer = $('.ai-quick-prompts');
if (quickPromptsContainer && CFG && CFG.aiStudio && CFG.aiStudio.quickPrompts){
  quickPromptsContainer.innerHTML = CFG.aiStudio.quickPrompts.map(p => 
    '<button class="ai-quick-btn" data-query="' + escapeHtml(p.query) + '">' + escapeHtml(p.label) + '</button>'
  ).join('');
}

$$('.ai-quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const q = btn.dataset.query;
    if (q) handleAiQuery(q);
  });
});

const aiForm = $('#aiChatForm'), aiInput = $('#aiQueryInput'), aiMessages = $('#aiMessages');
aiForm?.addEventListener('submit', e => {
  e.preventDefault();
  const q = aiInput.value.trim();
  if (!q) return;
  aiInput.value = '';
  handleAiQuery(q);
});

async function handleAiQuery(query){
  if (!aiMessages) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'ai-msg user';
  userDiv.innerHTML = '<strong>You:</strong><p>' + escapeHtml(query) + '</p>';
  aiMessages.appendChild(userDiv);
  aiMessages.scrollTop = aiMessages.scrollHeight;

  const botDiv = document.createElement('div');
  botDiv.className = 'ai-msg bot';
  botDiv.innerHTML = '<strong>AI Agent:</strong><p class="ai-typing">Thinking with local engine...</p>';
  aiMessages.appendChild(botDiv);
  aiMessages.scrollTop = aiMessages.scrollHeight;

  let responseText = '';
  const endpoint = (CFG && CFG.aiStudio && CFG.aiStudio.apiEndpoint) || 'http://localhost:1234/v1/chat/completions';
  const model = (CFG && CFG.aiStudio && CFG.aiStudio.modelName) || 'gemma-4';
  const sysPrompt = (CFG && CFG.aiStudio && CFG.aiStudio.systemPrompt) || 'You are the personal AI assistant for Yuvraj Patel.';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok){
      const json = await res.json();
      responseText = json.choices?.[0]?.message?.content || '';
    }
  } catch (err){
    // Fallback to local intelligent knowledge engine
  }

  if (!responseText){
    responseText = getLocalKnowledgeResponse(query);
  }

  botDiv.innerHTML = '<strong>AI Agent:</strong><p>' + responseText + '</p>';
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function getLocalKnowledgeResponse(query){
  const q = query.toLowerCase();
  const p = (CFG && CFG.personal) || {};

  if (q.includes('meetingshield') || q.includes('meeting') || q.includes('shield')){
    return '<strong>MeetingShield</strong> is a flagship privacy-first intelligence engine created by ' + (p.fullName || 'Yuvraj Patel') + '. Running <strong>Google Gemma 2 100% on-device</strong>, it analyzes meeting speech locally to summarize decisions and track action items with zero cloud privacy exposure. Repository: <a href="https://github.com/GodGamerAgent/MeetingShield" target="_blank" style="color:#a78bfa;text-decoration:underline;">github.com/GodGamerAgent/MeetingShield</a>.';
  }
  if (q.includes('gameable') || q.includes('game') || q.includes('assistive') || q.includes('controller')){
    return '<strong>GameAble</strong> is an adaptive assistive gaming controller platform built with the Web Gamepad API and dynamic switch mapping to empower players with motor and physical impairments.';
  }
  if (q.includes('school') || q.includes('newton') || q.includes('saket') || q.includes('education') || q.includes('college')){
    return (p.fullName || 'Yuvraj') + ' is an undergraduate student at <strong>' + (p.institution || 'Newton School of Technology') + '</strong> (' + (p.institutionRole || 'B.Tech CS & AI') + ') and completed schooling at <strong>' + (p.school || 'Saket International School') + '</strong>.';
  }
  if (q.includes('skill') || q.includes('stack') || q.includes('tech')){
    return 'Specializations include <strong>On-Device AI Inference</strong> (Google Gemma 2/4, Hermes Agent), <strong>Core Languages</strong> (Python, C/C++, JavaScript), <strong>Web Engineering</strong> (HTML5, responsive CSS, Web APIs, Tailwind), and <strong>Algorithms & Data Structures</strong>.';
  }
  if (q.includes('contact') || q.includes('email') || q.includes('hire')){
    return 'You can contact ' + (p.firstName || 'Yuvraj') + ' directly at <a href="mailto:' + (p.email || 'yuvrajpatelair@gmail.com') + '" style="color:#a78bfa;text-decoration:underline;">' + (p.email || 'yuvrajpatelair@gmail.com') + '</a> or on <a href="' + (p.githubUrl || 'https://github.com/yuvrajpatelair') + '" target="_blank" style="color:#a78bfa;text-decoration:underline;">GitHub</a>.';
  }
  return (p.fullName || 'Yuvraj Patel') + ' is an AI engineer and developer at Newton School of Technology. He builds on-device AI applications (MeetingShield) and assistive systems (GameAble). Feel free to ask about his projects, skills, or hit the "Get in touch" button!';
}

function escapeHtml(str){
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---------- 18. PageLoader (Doors Stacking Animation) ---------- */
(function pageLoader(){
  const loader = $('#loader');
  if (!loader) return;
  const num = $('#ldCount');

  // Skip animation for deep links
  if (['#works', '#about', '#contact', '#home'].includes(location.hash)){
    try { loader.remove(); } catch(e){}
    document.body.classList.add('ready');
    return;
  }

  let p = 0;
  const interval = setInterval(() => {
    p += Math.floor(Math.random() * 10) + 8;
    if (p >= 100){
      p = 100;
      clearInterval(interval);
      if (num) num.textContent = '100';
      setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.add('ready');
        setTimeout(() => {
          try { loader.remove(); } catch(e){}
        }, 550);
      }, 150);
    } else {
      if (num) num.textContent = String(p).padStart(3, '0');
    }
  }, 25);
})();
