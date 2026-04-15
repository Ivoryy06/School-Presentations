// ── Suffering cards accordion ──
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

// ── Timeline accordion ──
document.querySelectorAll('.timeline__item').forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.timeline__item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
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
    opacity: Math.random() * 0.5 + 0.1,
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
    ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
animateParticles();


const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');
const progressEl = document.getElementById('progress');
const slides = document.querySelectorAll('.slide');

let current = 0;

function triggerTransition(slide) {
  const t = slide.dataset.transition;
  if (!t) return;

  // clear previous anim classes
  slide.classList.remove('anim-fade-rise','anim-slide-left','anim-scale-up','anim-split');
  slide.querySelectorAll('.stagger-item').forEach(el => {
    el.classList.remove('anim-rise');
    el.style.animationDelay = '';
  });

  void slide.offsetWidth; // reflow

  if (t === 'fade-rise')   slide.classList.add('anim-fade-rise');
  if (t === 'slide-left')  slide.classList.add('anim-slide-left');
  if (t === 'scale-up')    slide.classList.add('anim-scale-up');
  if (t === 'split')       slide.classList.add('anim-split');

  if (t === 'stagger-left' || t === 'stagger-up' || t === 'pop-stagger') {
    const items = slide.querySelectorAll('.stagger-item');
    items.forEach((el, i) => {
      el.style.animationDelay = `${i * 80}ms`;
      setTimeout(() => el.classList.add('anim-rise'), i * 80);
    });
  }
}

function goTo(index) {
  slides[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  currentEl.textContent = current + 1;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
  progressEl.style.width = ((current + 1) / slides.length * 100) + '%';
  triggerTransition(slides[current]);
}

totalEl.textContent = slides.length;
prevBtn.addEventListener('click', () => current > 0 && goTo(current - 1));
nextBtn.addEventListener('click', () => current < slides.length - 1 && goTo(current + 1));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextBtn.click();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevBtn.click();
});

goTo(0);

// ── Touch swipe ──
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) dx < 0 ? nextBtn.click() : prevBtn.click();
}, { passive: true });
