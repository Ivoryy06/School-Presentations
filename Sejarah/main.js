// ── Suffering/pillars accordion ──
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

// ── Particles ──
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

// ── Slide navigation ──
const prevBtn    = document.getElementById('prev');
const nextBtn    = document.getElementById('next');
const currentEl  = document.getElementById('current');
const totalEl    = document.getElementById('total');
const progressEl = document.getElementById('progress');
const allSlides  = document.querySelectorAll('.slide');
const slides     = Array.from(allSlides).filter(s => !s.classList.contains('slide--detail'));

let current = 0;

function triggerTransition(slide) {
  const t = slide.dataset.transition;
  if (!t) return;

  slide.classList.remove('anim-fade-rise','anim-slide-left','anim-scale-up','anim-split');
  slide.querySelectorAll('.stagger-item').forEach(el => {
    el.classList.remove('anim-rise');
    el.style.animationDelay = '';
  });

  void slide.offsetWidth;

  if (t === 'fade-rise')  slide.classList.add('anim-fade-rise');
  if (t === 'slide-left') slide.classList.add('anim-slide-left');
  if (t === 'scale-up')   slide.classList.add('anim-scale-up');
  if (t === 'split')      slide.classList.add('anim-split');

  if (t === 'flag-question') {
    const img = slide.querySelector('.flag-q__img');
    const q   = slide.querySelector('.flag-q__question');
    const lbl = slide.querySelector('.flag-q__label');
    [img, q, lbl].forEach(el => { if (el) { el.style.animation = 'none'; el.style.opacity = '0'; } });
    void slide.offsetWidth;
    if (lbl) lbl.style.animation = 'fq-fade 0.5s ease 0.1s forwards';
    if (img) img.style.animation = 'fq-drag 0.6s cubic-bezier(.22,.68,0,1.2) 0.2s forwards';
    if (q)   q.style.animation   = 'fq-fade 0.6s ease 0.9s forwards';
    return;
  }
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
      triggerTransition(slide);
    });
  } else {
    slide.classList.add('active');
    triggerTransition(slide);
  }

  currentEl.textContent = current + 1;
  updateButtons();
  progressEl.style.width = ((current + 1) / slides.length * 100) + '%';
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

goTo(0);
