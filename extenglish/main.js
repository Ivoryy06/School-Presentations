const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('nav-dots');
let current = 0;


slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.onclick = () => goTo(i);
  dotsContainer.appendChild(dot);
});

function goTo(index) {
  slides[current].classList.remove('active');
  dotsContainer.children[current].classList.remove('active');
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides[current].classList.add('active');
  dotsContainer.children[current].classList.add('active');
}

function changeSlide(dir) { goTo(current + dir); }

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') changeSlide(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   changeSlide(-1);
});


const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const flakes = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 3 + 1,
  speed: Math.random() * 1.2 + 0.4,
  drift: Math.random() * 0.6 - 0.3,
  opacity: Math.random() * 0.5 + 0.3,
}));

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
    ctx.fill();
    f.y += f.speed;
    f.x += f.drift;
    if (f.y > canvas.height) { f.y = -f.r; f.x = Math.random() * canvas.width; }
    if (f.x > canvas.width)  f.x = 0;
    if (f.x < 0)             f.x = canvas.width;
  });
  requestAnimationFrame(drawSnow);
}
drawSnow();
