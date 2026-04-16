const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('nav-dots');
let current = 0;

// Build dots
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
