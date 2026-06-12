// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let cx = -100, cy = -100; // cursor position (instant)
  let rx = -100, ry = -100; // ring position (lerped)

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
  });

  // Smooth ring follow
  function update() {
    rx += (cx - rx) * 0.15;
    ry += (cy - ry) * 0.15;
    cursor.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(update);
  }
  update();

  // Hover states
  document.querySelectorAll('a:not(.project), button, .nav__cta').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  document.querySelectorAll('.project').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-project'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-project'));
  });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initReveal() {
  // Single elements
  document.querySelectorAll(
    '.about__grid, .recognition__grid, .work__header, .work__row, ' +
    '.experience__label, .contact__inner'
  ).forEach(el => el.classList.add('reveal'));

  // Stagger groups
  document.querySelectorAll('.experience__list').forEach(el => el.classList.add('reveal-stagger'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
}

// ============================================
// SMOOTH NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// PARALLAX ON PROJECT VISUALS
// ============================================
function initParallax() {
  const projects = document.querySelectorAll('.project');

  projects.forEach(project => {
    const visual = project.querySelector('.project__visual');
    if (!visual) return;

    project.addEventListener('mousemove', (e) => {
      const rect = project.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });

    project.addEventListener('mouseleave', () => {
      visual.style.transform = 'translate(0, 0)';
      visual.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { visual.style.transition = ''; }, 500);
    });
  });
}

// ============================================
// NAV TRANSPARENCY ON SCROLL
// ============================================
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('is-scrolled');
      nav.style.borderBottomColor = 'rgba(0,0,0,0.1)';
    } else {
      nav.classList.remove('is-scrolled');
      nav.style.borderBottomColor = 'rgba(0,0,0,0.05)';
    }
  }, { passive: true });
}


// ============================================
// HERO BLOBS — MOUSE INTERACTION
// ============================================
function initBlobsInSection(container, blobSelector) {
  const blobs = container.querySelectorAll(blobSelector);
  if (blobs.length < 2) return;

  let w, h;
  function measure() {
    const r = container.getBoundingClientRect();
    w = r.width;
    h = r.height;
  }
  measure();
  window.addEventListener('resize', measure);

  let mouseActive = false;
  let mouseX = w / 2, mouseY = h / 2;
  let idleTimer = null;

  const state = [
    { x: w * 0.25, y: h * 0.35, wanderX: w * 0.25, wanderY: h * 0.35, angle: 0, speed: 0.0008 },
    { x: w * 0.7, y: h * 0.6, wanderX: w * 0.7, wanderY: h * 0.6, angle: Math.PI, speed: 0.0006 },
  ];

  function setIdle() {
    mouseActive = false;
    state[0].wanderX = w * (0.15 + Math.random() * 0.3);
    state[0].wanderY = h * (0.2 + Math.random() * 0.3);
    state[1].wanderX = w * (0.55 + Math.random() * 0.3);
    state[1].wanderY = h * (0.45 + Math.random() * 0.3);
  }

  container.addEventListener('mousemove', (e) => {
    const r = container.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
    mouseActive = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(setIdle, 1500);
  });

  container.addEventListener('mouseleave', () => {
    clearTimeout(idleTimer);
    setIdle();
  });

  function update() {
    state.forEach((s, i) => {
      if (mouseActive) {
        const offsetX = (i === 0 ? -80 : 80);
        const offsetY = (i === 0 ? -40 : 40);
        s.x += (mouseX + offsetX - s.x) * 0.035;
        s.y += (mouseY + offsetY - s.y) * 0.035;
      } else {
        s.angle += s.speed;
        const driftX = s.wanderX + Math.sin(s.angle * 1.3 + i * 3) * 80;
        const driftY = s.wanderY + Math.cos(s.angle * 0.9 + i * 2) * 60;
        s.x += (driftX - s.x) * 0.015;
        s.y += (driftY - s.y) * 0.015;
      }
      blobs[i].style.left = s.x + 'px';
      blobs[i].style.top = s.y + 'px';
    });
    requestAnimationFrame(update);
  }
  update();
}

function initBlobs() {
  const hero = document.querySelector('.hero');
  if (hero) initBlobsInSection(hero, '.hero__blob');

  const contact = document.querySelector('.contact');
  if (contact) initBlobsInSection(contact, '.contact__blob');
}

// ============================================
// HERO LETTERS — DEPTH OF FIELD BLUR
// ============================================
function initHeroLetters() {
  document.querySelectorAll('.hero__line--interactive').forEach(line => {
    const text = line.textContent;
    line.textContent = '';

    const letters = [];

    [...text].forEach(char => {
      const span = document.createElement('span');
      span.classList.add('hero__letter');
      if (char === ' ') {
        span.classList.add('hero__letter--space');
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      line.appendChild(span);
      letters.push(span);
    });

    letters.forEach((letter, i) => {
      letter.addEventListener('mouseenter', () => {
        letters.forEach((l, j) => {
          l.classList.remove('focus-near', 'focus-mid');
          const dist = Math.abs(j - i);
          if (dist === 1) l.classList.add('focus-near');
          else if (dist === 2) l.classList.add('focus-mid');
        });
      });
    });

    line.addEventListener('mouseleave', () => {
      letters.forEach(l => l.classList.remove('focus-near', 'focus-mid'));
    });
  });
}

// ============================================
// NAV SCROLL SPY — highlight current section in nav pill
// ============================================
function initNavScrollSpy() {
  const navLinks = document.querySelectorAll('.nav__pill a[href^="#"]');
  if (!navLinks.length) return;

  const linkMap = new Map();
  const sections = [];
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) {
      linkMap.set(id, link);
      sections.push(section);
    }
  });

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initParallax();
  initCursor();
  initHeroLetters();
  initBlobs();
  initNavScrollSpy();
});
