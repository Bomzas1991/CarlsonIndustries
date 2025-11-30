// script.js
(() => {
  const title = document.getElementById('royal-text');

  // spotlight follow: update CSS variables based on mouse position (relative to element)
  function handleMove(e) {
    const rect = title.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    title.style.setProperty('--mx', `${x}%`);
    title.style.setProperty('--my', `${y}%`);
  }

  // For touch devices use touchmove
  function handleTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    handleMove(e.touches[0]);
  }

  // Sparkle particles on click
  function spawnParticles(event) {
    // compute position relative to document
    const rect = title.getBoundingClientRect();
    const clickX = (event.clientX ?? (event.touches && event.touches[0].clientX)) || (rect.left + rect.width/2);
    const clickY = (event.clientY ?? (event.touches && event.touches[0].clientY)) || (rect.top + rect.height/2);

    // create a bunch of tiny spans and animate them
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle ' + (Math.random() > 0.7 ? 'large' : (Math.random() > 0.6 ? 'small' : ''));
      document.body.appendChild(p);

      // random direction and distance
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 110; // px
      const tx = clickX + Math.cos(angle) * distance;
      const ty = clickY + Math.sin(angle) * distance - (10 + Math.random()*40);

      // starting position
      p.style.left = `${clickX}px`;
      p.style.top = `${clickY}px`;

      // random delay and duration
      const duration = 650 + Math.random() * 500;
      const delay = Math.random() * 60;

      // animate using requestAnimationFrame and CSS transforms
      p.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(${tx - clickX}px, ${ty - clickY}px) scale(${0.4 + Math.random()*0.9})`, opacity: 0 }
      ], {
        duration,
        delay,
        easing: 'cubic-bezier(.2,.9,.2,1)'
      });

      // remove after animation
      setTimeout(() => {
        try { p.remove(); } catch (e) { /* ignore */ }
      }, duration + delay + 20);
    }
  }

  // keyboard activation
  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // synthesize a click in center of element
      const rect = title.getBoundingClientRect();
      const fakeEvent = { clientX: rect.left + rect.width/2, clientY: rect.top + rect.height/2 };
      spawnParticles(fakeEvent);
    }
  }

  // Event listeners
  title.addEventListener('mousemove', handleMove);
  title.addEventListener('touchmove', handleTouchMove, { passive: true });
  title.addEventListener('click', spawnParticles);
  title.addEventListener('touchstart', (e) => { handleTouchMove(e); spawnParticles(e.touches[0]); }, { passive: true });
  title.addEventListener('keydown', handleKey);

  // reset spotlight when leaving
  title.addEventListener('mouseleave', () => {
    title.style.setProperty('--mx', '50%');
    title.style.setProperty('--my', '50%');
  });

  // small startup sparkle for attention
  window.addEventListener('load', () => {
    const rect = title.getBoundingClientRect();
    const event = { clientX: rect.left + rect.width*0.7, clientY: rect.top + rect.height*0.3 };
    setTimeout(() => spawnParticles(event), 700);
  });
})();

