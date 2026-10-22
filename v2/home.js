// Reuse the original eased custom cursor on the homepage.
const cursor = document.getElementById('cursor');
if (cursor) {
  let x = -100;
  let y = -100;
  let ringX = -100;
  let ringY = -100;

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    x = event.clientX;
    y = event.clientY;
  });

  const follow = () => {
    ringX += (x - ringX) * 0.15;
    ringY += (y - ringY) * 0.15;
    cursor.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(follow);
  };
  follow();

  document.querySelectorAll('a:not(.work-card), button').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
  document.querySelectorAll('.work-card').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('is-project'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('is-project'));
  });
}

// Bring back the original depth-of-field hover effect for the homepage headline.
document.querySelectorAll('.intro__line--interactive').forEach((line) => {
  const characters = [...line.textContent];
  line.textContent = '';
  const letters = characters.map((character) => {
    const letter = document.createElement('span');
    letter.className = 'hero__letter';
    if (character === ' ') {
      letter.classList.add('hero__letter--space');
      letter.innerHTML = '&nbsp;';
    } else {
      letter.textContent = character;
    }
    return letter;
  });

  letters.forEach((letter) => line.appendChild(letter));

  letters.forEach((letter, index) => {
    letter.addEventListener('mouseenter', () => {
      letters.forEach((neighbor, neighborIndex) => {
        neighbor.classList.remove('focus-near', 'focus-mid');
        const distance = Math.abs(neighborIndex - index);
        if (distance === 1) neighbor.classList.add('focus-near');
        else if (distance === 2) neighbor.classList.add('focus-mid');
      });
    });
  });

  line.addEventListener('mouseleave', () => {
    letters.forEach((letter) => letter.classList.remove('focus-near', 'focus-mid'));
  });
});

// Restore the original slow-moving, cursor-responsive color blobs.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.intro, .contact-section').forEach((section) => {
    const blobs = section.querySelectorAll('.home-blob');
    if (blobs.length < 2) return;

    let width = section.clientWidth;
    let height = section.clientHeight;
    const state = [
      { x: width * .25, y: height * .35, wanderX: width * .25, wanderY: height * .35, angle: 0, speed: .0008 },
      { x: width * .7, y: height * .6, wanderX: width * .7, wanderY: height * .6, angle: Math.PI, speed: .0006 },
    ];
    const measure = () => { width = section.clientWidth; height = section.clientHeight; };
    window.addEventListener('resize', measure);

    let cursorActive = false;
    let cursorX = width / 2;
    let cursorY = height / 2;
    let idleTimer;
    const returnToIdle = () => {
      cursorActive = false;
      state[0].wanderX = width * (.15 + Math.random() * .3);
      state[0].wanderY = height * (.2 + Math.random() * .3);
      state[1].wanderX = width * (.55 + Math.random() * .3);
      state[1].wanderY = height * (.45 + Math.random() * .3);
    };

    section.addEventListener('pointermove', (event) => {
      const bounds = section.getBoundingClientRect();
      cursorX = event.clientX - bounds.left;
      cursorY = event.clientY - bounds.top;
      cursorActive = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(returnToIdle, 1500);
    });
    section.addEventListener('pointerleave', () => { clearTimeout(idleTimer); returnToIdle(); });

    const animate = () => {
      state.forEach((blob, index) => {
        if (cursorActive) {
          const offsetX = index === 0 ? -80 : 80;
          const offsetY = index === 0 ? -40 : 40;
          blob.x += (cursorX + offsetX - blob.x) * .035;
          blob.y += (cursorY + offsetY - blob.y) * .035;
        } else {
          blob.angle += blob.speed;
          const driftX = blob.wanderX + Math.sin(blob.angle * 1.3 + index * 3) * 80;
          const driftY = blob.wanderY + Math.cos(blob.angle * .9 + index * 2) * 60;
          blob.x += (driftX - blob.x) * .015;
          blob.y += (driftY - blob.y) * .015;
        }
        blobs[index].style.left = `${blob.x}px`;
        blobs[index].style.top = `${blob.y}px`;
      });
      requestAnimationFrame(animate);
    };
    animate();
  });
}
