(() => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const currentEl = document.getElementById('current');
  const totalEl = document.getElementById('total');
  const progressEl = document.getElementById('progress');
  let current = 0;
  const total = slides.length;
  totalEl.textContent = total;
  function goTo(index) {
    slides[current].classList.remove('active');
    slides[current].classList.add('exit');
    setTimeout(() => slides[current - (current !== index ? 0 : 0)].classList.remove('exit'), 500);
    const old = current;
    setTimeout(() => slides[old].classList.remove('exit'), 500);
    current = index;
    slides[current].classList.add('active');
    currentEl.textContent = current + 1;
    progressEl.style.width = ((current + 1) / total * 100) + '%';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    const canvas = slides[current].querySelector('canvas');
    if (canvas) initParticles(canvas);
  }
  prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  nextBtn.addEventListener('click', () => { if (current < total - 1) goTo(current + 1); });
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      if (current < total - 1) goTo(current + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (current > 0) goTo(current - 1);
    }
  });
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && current < total - 1) goTo(current + 1);
      else if (dx > 0 && current > 0) goTo(current - 1);
    }
  });
  goTo(0);
  function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,165,0,${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      animId = requestAnimationFrame(draw);
    }
    if (canvas._animId) cancelAnimationFrame(canvas._animId);
    draw();
    canvas._animId = animId;
  }
  const hint = document.createElement('div');
  hint.className = 'key-hint';
  hint.textContent = '← → Arrow keys to navigate';
  document.body.appendChild(hint);
  setTimeout(() => { hint.style.transition = 'opacity 1s'; hint.style.opacity = '0'; }, 4000);
})();
