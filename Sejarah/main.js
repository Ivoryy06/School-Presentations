
document.querySelectorAll('.suffer-card').forEach(card => {
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.suffer-card').forEach(c => c.classList.remove('active'));
    if (!isActive) card.classList.add('active');
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});


const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function spawnParticle() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 10,
    size: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.4 + 0.2,
    opacity: Math.random() * 0.4 + 0.1,
    drift: (Math.random() - 0.5) * 0.3,
  };
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (particles.length < 60) particles.push(spawnParticle());
  particles = particles.filter(p => p.y > -10);
  for (const p of particles) {
    p.y -= p.speed;
    p.x += p.drift;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(74,158,138,${p.opacity})`;
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
animateParticles();


const prevBtn    = document.getElementById('prev');
const nextBtn    = document.getElementById('next');
const currentEl  = document.getElementById('current');
const totalEl    = document.getElementById('total');
const progressEl = document.getElementById('progress');
const allSlides  = document.querySelectorAll('.slide');
const slides     = Array.from(allSlides).filter(s => !s.classList.contains('slide--detail'));

let current = 0;

function triggerTransition(slide, index) {
  let t = slide.dataset.transition;
  if (!t) return;

  
  if (t === 'fade-rise' || t === 'slide-left') {
    t = (index % 2 === 0) ? 'slide-left' : 'slide-right-custom';
  }

  slide.classList.remove('anim-fade-rise','anim-slide-left','anim-slide-right','anim-scale-up','anim-split');
  slide.querySelectorAll('.stagger-item').forEach(el => {
    el.classList.remove('anim-rise');
    el.style.animationDelay = '';
  });

  void slide.offsetWidth;

  if (t === 'slide-left')        slide.classList.add('anim-slide-left');
  if (t === 'slide-right-custom') slide.classList.add('anim-slide-right');
  if (t === 'scale-up')             slide.classList.add('anim-scale-up');
  if (t === 'split')                slide.classList.add('anim-split');

  if (t === 'flag-question') {
    const img = slide.querySelector('.flag-q__img');
    const q   = slide.querySelector('.flag-q__question');
    const lbl = slide.querySelector('.flag-q__label');
    [img, q, lbl].forEach(el => { if (el) { el.style.animation = 'none'; el.style.opacity = '0'; } });
    void slide.offsetWidth;
    if (lbl) lbl.style.animation = 'fq-fade 0.5s ease 0.1s forwards';
    if (img) img.style.animation = 'fq-drag 0.6s cubic-bezier(.22,.68,0,1.2) 0.2s forwards';
    if (q)   q.style.animation   = 'fq-fade 0.6s ease 0.9s forwards';
  } else if (t === 'stagger-left' || t === 'stagger-up' || t === 'pop-stagger') {
    slide.querySelectorAll('.stagger-item').forEach((el, i) => {
      el.style.animationDelay = `${i * 80}ms`;
      setTimeout(() => el.classList.add('anim-rise'), i * 80);
    });
  } else {
    slide.querySelectorAll('.stagger-item').forEach(el => el.classList.add('anim-rise'));
  }
}

const mobilePrev = document.getElementById('mobilePrev');
const mobileNext = document.getElementById('mobileNext');
let returnSlide = null;

function updateButtons() {
  const isFirst = current === 0;
  const isLast = current === slides.length - 1;
  prevBtn.disabled = isFirst;
  nextBtn.disabled = isLast;
  mobilePrev.disabled = isFirst;
  mobileNext.disabled = isLast;
}

function goTo(index) {
  slides[current].classList.remove('active');
  current = index;
  const slide = slides[current];
  const t = slide.dataset.transition;
  const isStagger = t === 'stagger-left' || t === 'stagger-up' || t === 'pop-stagger';

  if (isStagger) {
    slide.querySelectorAll('.stagger-item').forEach(el => {
      el.classList.remove('anim-rise');
      el.style.animationDelay = '';
    });
    slide.style.opacity = '0';
    slide.classList.add('active');
    requestAnimationFrame(() => {
      slide.style.opacity = '';
      triggerTransition(slide, current);
    });
  } else {
    slide.classList.add('active');
    triggerTransition(slide, current);
  }

  currentEl.textContent = current + 1;
  updateButtons();
  progressEl.style.width = ((current + 1) / slides.length * 100) + '%';
  if (slide.classList.contains('slide--quiz')) resetQuiz(slide);
}

function goToDetail(detailId) {
  returnSlide = current;
  const detailSlide = document.getElementById(detailId);
  slides[current].classList.remove('active');
  detailSlide.classList.add('active');
  triggerTransition(detailSlide);
}

function backToMain() {
  if (returnSlide !== null) {
    document.querySelector('.slide.active').classList.remove('active');
    slides[returnSlide].classList.add('active');
    triggerTransition(slides[returnSlide]);
    returnSlide = null;
  }
}

totalEl.textContent = slides.length;

prevBtn.addEventListener('click', () => current > 0 && goTo(current - 1));
nextBtn.addEventListener('click', () => current < slides.length - 1 && goTo(current + 1));
mobilePrev.addEventListener('click', () => current > 0 && goTo(current - 1));
mobileNext.addEventListener('click', () => current < slides.length - 1 && goTo(current + 1));

document.querySelectorAll('.fun-fact').forEach(box => {
  box.addEventListener('click', () => goToDetail(box.dataset.detail));
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToDetail(box.dataset.detail);
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextBtn.click();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevBtn.click();
});


function confetti() {
  const colors = ['#4ac68a','#f5c842','#e05c5c','#5b9cf6','#c084fc'];
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    const fromSide = Math.random();
    let startX, startY, dx, dy;
    if (fromSide < 0.33) {
      
      startX = '-10px'; startY = Math.random()*100+'vh';
      dx = 60+Math.random()*200+'px'; dy = (Math.random()-0.3)*300+'px';
    } else if (fromSide < 0.66) {
      
      startX = '100vw'; startY = Math.random()*100+'vh';
      dx = -(60+Math.random()*200)+'px'; dy = (Math.random()-0.3)*300+'px';
    } else {
      
      startX = Math.random()*100+'vw'; startY = '100vh';
      dx = (Math.random()-0.5)*300+'px'; dy = -(100+Math.random()*400)+'px';
    }
    el.style.cssText = `position:fixed;top:${startY};left:${startX};width:9px;height:9px;
      background:${colors[i%colors.length]};border-radius:${Math.random()>0.5?'50%':'2px'};
      pointer-events:none;z-index:9999;animation:confetti-fall ${1.2+Math.random()*1.5}s ease forwards`;
    el.style.setProperty('--dx', dx);
    el.style.setProperty('--dy', dy);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}


document.querySelectorAll('.slide--quiz:not(.slide--decision)').forEach(slide => {
  slide.querySelectorAll('.quiz__opt').forEach(btn => {
    btn.addEventListener('click', () => {
      if (slide.querySelector('.quiz__opt.answered')) return;
      const correct = btn.dataset.correct === 'true';
      slide.querySelectorAll('.quiz__opt').forEach(b => {
        b.classList.add('answered');
        if (b.dataset.correct === 'true') b.classList.add('quiz__opt--correct');
      });
      if (!correct) btn.classList.add('quiz__opt--wrong');
      else confetti();
      slide.querySelector('.quiz__explanation').hidden = false;
    });
  });
});


document.querySelectorAll('.slide--decision').forEach(slide => {
  slide.querySelectorAll('.decision__opt').forEach(btn => {
    btn.addEventListener('click', () => {
      slide.querySelectorAll('.decision__opt').forEach(b => b.classList.remove('chosen'));
      slide.querySelectorAll('.decision__opt').forEach(b => b.classList.add('answered'));
      btn.classList.add('chosen');
      slide.querySelectorAll('.decision__outcome').forEach(el => { el.hidden = true; });
      document.getElementById(btn.dataset.outcome).hidden = false;
    });
  });
});

function resetQuiz(slide) {
  if (slide.classList.contains('slide--decision')) {
    slide.querySelectorAll('.decision__opt').forEach(b => b.className = 'quiz__opt decision__opt');
    slide.querySelectorAll('.decision__outcome').forEach(el => { el.hidden = true; });
  } else {
    slide.querySelectorAll('.quiz__opt').forEach(b => b.className = 'quiz__opt');
    slide.querySelector('.quiz__explanation').hidden = true;
  }
}

goTo(0);
