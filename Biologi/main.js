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
    ctx.fillStyle = `rgba(76,175,125,${p.opacity})`;
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
const mobilePrev = document.getElementById('mobilePrev');
const mobileNext = document.getElementById('mobileNext');
const slides     = Array.from(document.querySelectorAll('.slide'));

let current = 0;

function triggerTransition(slide, index) {
  const anim = index % 2 === 0 ? 'anim-slide-left' : 'anim-slide-right';
  slide.classList.remove('anim-slide-left', 'anim-slide-right');
  slide.querySelectorAll('.stagger-item').forEach(el => {
    el.classList.remove('anim-rise');
    el.style.animationDelay = '';
  });
  void slide.offsetWidth;
  slide.classList.add(anim);
  slide.querySelectorAll('.stagger-item').forEach((el, i) => {
    el.style.animationDelay = `${200 + i * 80}ms`;
    setTimeout(() => el.classList.add('anim-rise'), 200 + i * 80);
  });
}

function updateButtons() {
  prevBtn.disabled = mobilePrev.disabled = current === 0;
  nextBtn.disabled = mobileNext.disabled = current === slides.length - 1;
}

function goTo(index) {
  slides[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  triggerTransition(slides[current], current);
  currentEl.textContent = current + 1;
  progressEl.style.width = ((current + 1) / slides.length * 100) + '%';
  updateButtons();
}

totalEl.textContent = slides.length;

prevBtn.addEventListener('click', () => current > 0 && goTo(current - 1));
nextBtn.addEventListener('click', () => current < slides.length - 1 && goTo(current + 1));
mobilePrev.addEventListener('click', () => current > 0 && goTo(current - 1));
mobileNext.addEventListener('click', () => current < slides.length - 1 && goTo(current + 1));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextBtn.click();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevBtn.click();
});

goTo(0);
