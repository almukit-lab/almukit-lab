// js/main.js

// ── AUDIO AUTOPLAY ──
const bgAudio = document.getElementById('bg-audio');
const musicBtn = document.getElementById('btn-music');
let musicPlaying = false;

if (bgAudio && musicBtn) {
  bgAudio.volume = 0.55;

  function unlockAndPlay() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      ctx.resume().then(() => {
        bgAudio.play().then(() => {
          musicPlaying = true;
          musicBtn.classList.add('playing');
        }).catch(() => {});
      });
    } else {
      bgAudio.play().then(() => {
        musicPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(() => {});
    }
  }

  unlockAndPlay();

  const firstTouch = () => {
    if (!musicPlaying) unlockAndPlay();
    window.removeEventListener('mousemove', firstTouch);
    window.removeEventListener('touchstart', firstTouch);
    window.removeEventListener('keydown', firstTouch);
  };
  window.addEventListener('mousemove', firstTouch, { once: true });
  window.addEventListener('touchstart', firstTouch, { once: true });
  window.addEventListener('keydown', firstTouch, { once: true });

  musicBtn.addEventListener('click', function() {
    if (musicPlaying) {
      bgAudio.pause();
      musicPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      bgAudio.play().then(() => {
        musicPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(()=>{});
    }
  });
}

// ── ENTRANCE ANIMATIONS ──
const anims = ['fadeSlideUp','fadeSlideDown','fadeSlideLeft','fadeSlideRight','scaleFade','blurFade'];
function rAnim(el, delay, dur=0.85) {
  if (!el) return;
  el.style.animation = `${anims[Math.floor(Math.random()*anims.length)]} ${dur}s cubic-bezier(0.23,1,0.32,1) ${delay}s both`;
}

rAnim(document.getElementById('htag'), 0.05);
rAnim(document.getElementById('htitle'), 0.18, 1.0);
rAnim(document.getElementById('hline'), 0.32, 0.7);
rAnim(document.getElementById('hsub'), 0.42);

setTimeout(() => {
  ['bcontact','btn-music','footer'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      rAnim(el, i*0.1, 0.7);
      el.style.opacity = '';
    }
  });
}, 700);

// ── CLOCK ──
const clockEl = document.getElementById('clock');
if (clockEl) {
  (function tick() {
    const n = new Date();
    clockEl.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
      .map(v => String(v).padStart(2, '0')).join(':');
    setTimeout(tick, 1000);
  })();
}

// ── CURSOR & NAV HOVER ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;

if (cur && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx+'px'; cur.style.top = my+'px';
  });
  (function ar() {
    rx += (mx-rx)*0.13; ry += (my-ry)*0.13;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(ar);
  })();
}

document.querySelectorAll('button, a, .ham').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hover'));
});

// ── HAMBURGER MENU & CLOSE PANEL UPDATES ──
const ham = document.getElementById('ham');
const menuEl = document.getElementById('menu');
const menuCloseBtn = document.getElementById('menu-close');
let menuOpen = false;

function closeMenu() {
  menuOpen = false;
  if (ham) ham.classList.remove('open');
  if (menuEl) menuEl.classList.remove('open');
}

if (ham && menuEl) {
  ham.addEventListener('click', () => {
    menuOpen = !menuOpen;
    ham.classList.toggle('open', menuOpen);
    menuEl.classList.toggle('open', menuOpen);
  });
  
  // Right close cross action listener
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
  }
  
  document.addEventListener('click', e => {
    if (menuOpen && !menuEl.contains(e.target) && !ham.contains(e.target)) {
      closeMenu();
    }
  });
}

// ── BOTTOM-LEFT CONTACT US TRIGGER LINK FIX ──
const contactBtn = document.getElementById('bcontact');
if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    // Navigates using your existing master system burst effect
    burstTransition('contact.html');
  });
}

// ── NAVIGATION INTERCEPT (AUTO-HIDE UPDATE) ──
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    // Auto-hide the navigation panel immediately on click
    closeMenu();
    
    burstTransition(link.getAttribute('href'));
  });
});

// ── STAR BURST PAGE TRANSITION ──
const transCanvas = document.createElement('canvas');
transCanvas.style.cssText = 'position:fixed;inset:0;z-index:99990;pointer-events:none;';
if (!document.getElementById('trans')) {
  document.body.appendChild(transCanvas);
}
const tCtx = transCanvas.getContext('2d') || (document.getElementById('trans') ? document.getElementById('trans').getContext('2d') : null);

function resizeTrans() { 
  if (transCanvas && transCanvas.parentElement) {
    transCanvas.width = window.innerWidth; transCanvas.height = window.innerHeight; 
  }
}
resizeTrans();
window.addEventListener('resize', resizeTrans);

function burstTransition(href) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const particles = [];
  const colors = ['#00f5ff', '#ff00ff', '#0080ff', '#bf00ff', '#ffffff'];
  
  // Upgrade: Increased particle density & dynamic velocity vectors
  for (let i = 0; i < 320; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Explosive initial speed that will decay smoothly
    const spd = Math.random() * 22 + 8;
    const len = Math.random() * 110 + 40;
    const col = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      len,
      col,
      a: 1,
      da: -(Math.random() * 0.03 + 0.015), // Snappier fade out
      w: Math.random() * 2.0 + 0.5
    });
  }

  // FIXED ISSUE #1: Removed the harsh full-screen white flash block.
  // Replaced with a smooth, ambient chromatic vignette glow.
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99989;
    background: radial-gradient(circle at center, rgba(0, 245, 255, 0.15) 0%, rgba(255, 0, 255, 0.05) 50%, transparent 100%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease-out;
  `;
  document.body.appendChild(flash);
  
  // Trigger soft ambient bloom instantly
  requestAnimationFrame(() => {
    flash.style.opacity = '1';
  });

  let done = false;
  let elapsed = 0;
  
  function animBurst() {
    if (done) return;
    elapsed++;
    tCtx.clearRect(0, 0, transCanvas.width, transCanvas.height);

    // Dark warp shroud smoothly closing in
    if (elapsed > 10) {
      const fadeAlpha = Math.min((elapsed - 10) / 15, 1);
      tCtx.fillStyle = `rgba(0,4,8,${(fadeAlpha * 0.98).toFixed(3)})`;
      tCtx.fillRect(0, 0, transCanvas.width, transCanvas.height);
      flash.style.opacity = (1 - fadeAlpha).toString();
    }

    let alive = 0;
    particles.forEach(p => {
      if (p.a <= 0) return;
      alive++;
      
      // Physics updates
      p.x += p.vx; 
      p.y += p.vy;
      p.vx *= 0.94; // Atmospheric drag multiplier (makes burst feel punchy)
      p.vy *= 0.94;
      p.a += p.da;

      const tx = p.x - p.vx * p.len * 0.12;
      const ty = p.y - p.vy * p.len * 0.12;
      const alpha = Math.max(0, p.a).toFixed(3);
      
      tCtx.beginPath();
      tCtx.moveTo(p.x, p.y);
      tCtx.lineTo(tx, ty);
      tCtx.strokeStyle = p.col;
      tCtx.globalAlpha = parseFloat(alpha);
      tCtx.lineWidth = p.w;
      tCtx.lineCap = 'round';
      tCtx.stroke();
    });
    
    tCtx.globalAlpha = 1;

    if (elapsed > 24 || (elapsed > 15 && alive === 0)) {
      done = true;
      if (flash.parentNode) flash.parentNode.removeChild(flash);
      window.location.href = href;
      return;
    }
    
    requestAnimationFrame(animBurst);
  }
  
  animBurst();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    burstTransition(link.getAttribute('href'));
  });
});

// ── PARALLAX DEPTH ──
const pFar = document.querySelectorAll('.p-far');
const pMid = document.querySelectorAll('.p-mid');
const pNear = document.querySelectorAll('.p-near');
const pFront = document.querySelectorAll('.p-front');

let pMx = 0, pMy = 0, spx = 0, spy = 0;
document.addEventListener('mousemove', e => {
  pMx = (e.clientX / window.innerWidth  - 0.5) * 2;
  pMy = (e.clientY / window.innerHeight - 0.5) * 2;
});

(function animParallax() {
  spx += (pMx - spx) * 0.06;
  spy += (pMy - spy) * 0.06;
  pFar.forEach(el => el.style.transform = `translate3d(${spx * -18}px, ${spy * -12}px, 0)`);
  pMid.forEach(el => el.style.transform = `translate3d(${spx * -38}px, ${spy * -26}px, 0)`);
  pNear.forEach(el => el.style.transform = `translate3d(${spx * -55}px, ${spy * -36}px, 0)`);
  pFront.forEach(el => el.style.transform = `translate3d(${spx * 12}px, ${spy * 8}px, 0)`);
  requestAnimationFrame(animParallax);
})();

// ── STAR BG ──
const bgC = document.getElementById('bg-canvas');
if (bgC) {
  const bgX = bgC.getContext('2d');
  let stars = [];
  function resizeBg() {
    bgC.width = window.innerWidth; bgC.height = window.innerHeight;
    stars = Array.from({length:600}, () => ({
      x:Math.random()*bgC.width, y:Math.random()*bgC.height, r:Math.random()*1.8+0.2, a:Math.random(), da:(Math.random()-0.5)*0.005,
      col:Math.random()>0.75?'rgba(0,245,255,':Math.random()>0.6?'rgba(255,0,255,':Math.random()>0.45?'rgba(0,128,255,':Math.random()>0.3?'rgba(180,100,255,':'rgba(180,220,255,'
    }));
  }
  resizeBg();
  window.addEventListener('resize', resizeBg);
  (function db() {
    bgX.clearRect(0,0,bgC.width,bgC.height);
    stars.forEach(s => {
      s.a += s.da; if(s.a<=0||s.a>=1) s.da*=-1;
      bgX.beginPath(); bgX.arc(s.x,s.y,s.r,0,Math.PI*2); bgX.fillStyle=s.col+Math.max(0,Math.min(1,s.a)).toFixed(2)+')'; bgX.fill();
    });
    requestAnimationFrame(db);
  })();
}

// ── CURSOR PARTICLES ──
const cv = document.getElementById('cv');
if (cv) {
  const ctx = cv.getContext('2d');
  let W, H;
  function resizeCv() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  resizeCv();
  window.addEventListener('resize', resizeCv);
  let cparts = [];
  function mkC() {
    const cols = ['rgba(0,245,255,','rgba(255,0,255,','rgba(0,128,255,','rgba(180,160,255,'];
    const c = cols[Math.floor(Math.random()*cols.length)];
    const a = Math.random()*Math.PI*2, s = Math.random()*0.3+0.05;
    return {x:mx+(Math.random()-.5)*8, y:my+(Math.random()-.5)*8, vx:Math.cos(a)*s, vy:Math.sin(a)*s-0.06, r:Math.random()*2+0.5, a:0.6, da:-(Math.random()*0.005+0.002), color:c};
  }
  let st = 0;
  (function dp() {
    ctx.clearRect(0,0,W,H);
    if(++st%4===0) cparts.push(mkC());
    cparts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.vy-=0.002; p.a+=p.da;
      if(p.a<=0) return;
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
      g.addColorStop(0, p.color+(p.a*0.3).toFixed(3)+')');
      g.addColorStop(1, p.color+'0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.color+p.a.toFixed(3)+')'; ctx.fill();
    });
    cparts = cparts.filter(p => p.a>0);
    requestAnimationFrame(dp);
  })();
}

// ── GLASS LENS + WARP (PERFORMANCE REDESIGN) ──
const warpLayer = document.getElementById('warp-layer');
const lensDeco = document.getElementById('lens-deco');
const warpTurb = document.getElementById('warp-turb');
const warpDisp = document.getElementById('warp-disp');

if (warpLayer && lensDeco && warpTurb && warpDisp) {
  let cachedLensR = Math.min(140, window.innerWidth * 0.13);
  function updateDimensions() {
    cachedLensR = Math.min(140, window.innerWidth * 0.13);
    lensDeco.style.width = lensDeco.style.height = (cachedLensR * 2) + 'px';
  }
  updateDimensions();
  window.addEventListener('resize', updateDimensions);

  let lx = window.innerWidth / 2, ly = window.innerHeight / 2;
  let ltx = lx, lty = ly;
  
  document.addEventListener('mousemove', e => { ltx = e.clientX; lty = e.clientY; });
  document.addEventListener('touchmove', e => { ltx = e.touches[0].clientX; lty = e.touches[0].clientY; }, {passive:true});

  let lastBf = 0;
  let lastScale = 0;

  (function animLens() {
    const px = lx, py = ly;
    lx += (ltx - lx) * 0.085; 
    ly += (lty - ly) * 0.085;
    
    const lvx = lx - px, lvy = ly - py;
    const spd = Math.sqrt(lvx * lvx + lvy * lvy);
    
    const clip = `circle(${cachedLensR}px at ${lx}px ${ly}px)`;
    warpLayer.style.clipPath = clip;
    warpLayer.style.webkitClipPath = clip;
    
    lensDeco.style.transform = `translate3d(calc(${lx}px - 50%), calc(${ly}px - 50%), 0)`;

    lensDeco.classList.remove('squish-h','squish-v');
    if (spd > 3) {
      lensDeco.classList.add(Math.abs(lvx) > Math.abs(lvy) ? 'squish-h' : 'squish-v');
    }

    const targetBf = 0.010 + spd * 0.0006;
    const targetScale = 45 + spd * 4;

    if (Math.abs(lastBf - targetBf) > 0.001) {
      warpTurb.setAttribute('baseFrequency', `${targetBf.toFixed(4)} ${(targetBf * 1.4).toFixed(4)}`);
      lastBf = targetBf;
    }
    if (Math.abs(lastScale - targetScale) > 0.5) {
      warpDisp.setAttribute('scale', targetScale.toFixed(1));
      lastScale = targetScale;
    }

    requestAnimationFrame(animLens);
  })();
}

// ── FLOATING BUBBLES ──
const container = document.getElementById('bubbles-container');
if (container) {
  const BUBBLE_COUNT = 21;
  const sizePool = [18,28,22,32,15,25,20,35,12,30,17,24,14,26,19,22,16,28,21,18,24];
  const bubbles = [];
  const bubbleWarps = [];

  for(let i=0; i<BUBBLE_COUNT; i++) {
    const wl = document.createElement('div');
    wl.style.cssText = `position:fixed;inset:0;z-index:44;pointer-events:none;filter:url(#bubble-warp);clip-path:circle(0px at 0px 0px);-webkit-clip-path:circle(0px at 0px 0px);will-change:clip-path;transform:translate3d(0,0,0);backdrop-filter:brightness(1.12) saturate(1.8) contrast(1.08);-webkit-backdrop-filter:brightness(1.12) saturate(1.8) contrast(1.08);`;
    document.body.appendChild(wl);
    bubbleWarps.push(wl);
  }

  for(let i=0; i<BUBBLE_COUNT; i++) {
    const s = sizePool[i%sizePool.length], r = s/2;
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;width:${s}px;height:${s}px;border-radius:50%;will-change:transform;transform:translate3d(-50%,-50%,0);pointer-events:none;z-index:46;`;
    el.innerHTML = `
      <div style="position:absolute;inset:0;border-radius:50%;"></div>
      <div style="position:absolute;top:10%;left:12%;width:40%;height:28%;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,0.82) 0%,rgba(255,255,255,0.2) 45%,transparent 100%);filter:blur(1px);"></div>
      <div style="position:absolute;bottom:14%;right:12%;width:22%;height:16%;border-radius:50%;background:radial-gradient(ellipse,rgba(0,245,255,0.55) 0%,rgba(180,140,255,0.2) 55%,transparent 100%);filter:blur(1.5px);"></div>
      <div style="position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,0.22);box-shadow:inset 0 0 0 1px rgba(0,245,255,0.15),0 0 8px rgba(0,245,255,0.06);"></div>`;
    container.appendChild(el);
    bubbles.push({el, r, x:r+Math.random()*(window.innerWidth-r*2), y:r+Math.random()*(window.innerHeight-r*2), vx:(Math.random()-.5)*0.45, vy:(Math.random()-.5)*0.45, phase:Math.random()*Math.PI*2, phase2:Math.random()*Math.PI*2, ws:0.005+Math.random()*0.007});
  }

  (function ab() {
    const now = performance.now()*0.001;
    const refLx = typeof lx !== 'undefined' ? lx : window.innerWidth/2;
    const refLy = typeof ly !== 'undefined' ? ly : window.innerHeight/2;
    const refLensR = (typeof cachedLensR !== 'undefined') ? cachedLensR : 140;

    bubbles.forEach((b, i) => {
      b.vx += Math.sin(now*b.ws+b.phase)*0.011;
      b.vy += Math.cos(now*b.ws*1.3+b.phase2)*0.009;
      
      const cdx = b.x-refLx, cdy = b.y-refLy, cd = Math.sqrt(cdx*cdx+cdy*cdy), pr = refLensR+b.r+20;
      if(cd<pr && cd>0.5) { const f = Math.pow((pr-cd)/pr,1.8)*2; b.vx+=(cdx/cd)*f; b.vy+=(cdy/cd)*f; }
      
      for (let j = i + 1; j < BUBBLE_COUNT; j++) {
        const o = bubbles[j];
        const dx = b.x - o.x;
        const dy = b.y - o.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const md = (b.r + o.r) * 0.85;
        if (d < md && d > 0.5) {
          const f = (md - d) / md * 0.25;
          const nx = dx / d;
          const ny = dy / d;
          b.vx += nx * f; b.vy += ny * f;
          o.vx -= nx * f; o.vy -= ny * f;
        }
      }

      b.vx*=0.97; b.vy*=0.97;
      if(b.x-b.r<0) { b.x=b.r; b.vx=Math.abs(b.vx)*0.65; } if(b.x+b.r>window.innerWidth) { b.x=window.innerWidth-b.r; b.vx=-Math.abs(b.vx)*0.65; }
      if(b.y-b.r<0) { b.y=b.r; b.vy=Math.abs(b.vy)*0.65; } if(b.y+b.r>window.innerHeight) { b.y=window.innerHeight-b.r; b.vy=-Math.abs(b.vy)*0.65; }
      b.x+=b.vx; b.y+=b.vy;
      
      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%, -50%)`;
      
      const clip=`circle(${b.r}px at ${b.x}px ${b.y}px)`;
      bubbleWarps[i].style.clipPath=clip; bubbleWarps[i].style.webkitClipPath=clip;
    });
    requestAnimationFrame(ab);
  })();
}

// ── PORTFOLIO SPECIFIC: STAR IMPLOSION ENTRY ──
const tc = document.getElementById('trans');
if (tc) {
  const portfolioCtx = tc.getContext('2d');
  
  function resizePortfolioTrans() { 
    tc.width = window.innerWidth; 
    tc.height = window.innerHeight; 
  }
  resizePortfolioTrans();
  window.addEventListener('resize', resizePortfolioTrans);

  (function entryAnim() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const pts = Array.from({ length: 160 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(window.innerWidth, window.innerHeight) * 0.8 + 200;
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        tx: cx,
        ty: cy,
        col: ['#00f5ff', '#ff00ff', '#0080ff', '#bf00ff', '#ffffff'][Math.floor(Math.random() * 5)],
        a: 1,
        done: false,
        w: Math.random() * 1.2 + 0.3
      };
    });

    let frame = 0;
    function draw() {
      frame++;
      portfolioCtx.clearRect(0, 0, tc.width, tc.height);
      if (frame > 35) { 
        portfolioCtx.clearRect(0, 0, tc.width, tc.height); 
        return; 
      }
      
      const prog = frame / 35;
      pts.forEach(p => {
        const cx2 = p.x + (p.tx - p.x) * prog * 1.2;
        const cy2 = p.y + (p.ty - p.y) * prog * 1.2;
        const tail = p.x + (p.tx - p.x) * Math.max(0, prog - 0.12) * 1.2;
        const tail2 = p.y + (p.ty - p.y) * Math.max(0, prog - 0.12) * 1.2;
        
        portfolioCtx.beginPath();
        portfolioCtx.moveTo(cx2, cy2);
        portfolioCtx.lineTo(tail, tail2);
        portfolioCtx.strokeStyle = p.col;
        portfolioCtx.globalAlpha = 1 - prog;
        portfolioCtx.lineWidth = p.w;
        portfolioCtx.lineCap = 'round';
        portfolioCtx.stroke();
        portfolioCtx.globalAlpha = 1;
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

function burstOut(href) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const pts = Array.from({ length: 200 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 22 + 8; // Match the punchy initial velocity
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        col: ['#00f5ff', '#ff00ff', '#0080ff', '#bf00ff', '#ffffff'][Math.floor(Math.random() * 5)],
        a: 1,
        da: -(Math.random() * 0.03 + 0.015), // Snappier decay
        w: Math.random() * 2.0 + 0.5
      };
    });

    // FIXED: Swapped harsh white flash background for the matching cinematic neon bloom vignette
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99989;
      background: radial-gradient(circle at center, rgba(0, 245, 255, 0.15) 0%, rgba(255, 0, 255, 0.05) 50%, transparent 100%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease-out;
    `;
    document.body.appendChild(flash);
    
    requestAnimationFrame(() => {
      flash.style.opacity = '1';
    });
    
    let el = 0;
    function drawBurst() {
      el++;
      portfolioCtx.clearRect(0, 0, tc.width, tc.height);
      
      // Deep dark overlay curtain sweeps in
      if (el > 10) {
        const fa = Math.min((el - 10) / 15, 1);
        portfolioCtx.fillStyle = `rgba(0,4,8,${(fa * 0.98).toFixed(2)})`;
        portfolioCtx.fillRect(0, 0, tc.width, tc.height);
        flash.style.opacity = (1 - fa).toString();
      }
      
      pts.forEach(p => {
        if (p.a <= 0) return;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Premium atmospheric drag physics
        p.vy *= 0.94;
        p.a += p.da;
        
        const tx = p.x - p.vx * 5;
        const ty = p.y - p.vy * 5;
        
        portfolioCtx.beginPath();
        portfolioCtx.moveTo(p.x, p.y);
        portfolioCtx.lineTo(tx, ty);
        portfolioCtx.strokeStyle = p.col;
        portfolioCtx.globalAlpha = Math.max(0, p.a);
        portfolioCtx.lineWidth = p.w;
        portfolioCtx.lineCap = 'round';
        portfolioCtx.stroke();
      });
      
      portfolioCtx.globalAlpha = 1;
      
      // FIXED: Snapped load handoff down to 24 frames to match layout continuity rules
      if (el > 24) {
        if (flash.parentNode) flash.parentNode.removeChild(flash);
        window.location.href = href;
        return;
      }
      requestAnimationFrame(drawBurst);
    }
    drawBurst();
  }

  document.querySelectorAll('.nav-back').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      burstOut(a.getAttribute('href'));
    });
  });
}