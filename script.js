/**
 * DANAE — PORTFOLIO
 * script.js  (palette edition)
 *
 * Modules:
 *  1. Headline Line-Inner Wrapping (stagger animation)
 *  2. Blob Hover Injection
 *  3. Sticky Navbar
 *  4. Mobile Hamburger
 *  5. Active Nav Link (Scroll Spy)
 *  6. Smooth Scroll
 *  7. Scroll Reveal
 *  8. Portfolio Toggle (UX/UI · Dev · Art)
 *  9. Skill Bar Animations
 * 10. Back-to-Top
 * 11. Swatch Tooltip (touch fallback)
 * 12. Card Tilt (desktop)
 */

'use strict';

/* ----------------------------------------------------------
   1. HEADLINE LINE-INNER WRAPPING
   Wraps the text content of each .line in .line-inner
   so the CSS clip animation works.
   ---------------------------------------------------------- */
function initHeadlineAnimation() {
  document.querySelectorAll('.hero-headline .line').forEach(line => {
    // Avoid double-wrapping
    if (line.querySelector('.line-inner')) return;

    const inner = document.createElement('span');
    inner.className = 'line-inner';
    // Move all child nodes into inner
    while (line.firstChild) inner.appendChild(line.firstChild);
    line.appendChild(inner);
  });
}

/* ----------------------------------------------------------
   2. BLOB HOVER INJECTION
   Injects a .blob-hover div into every card so the CSS
   fuzzy blob effect has a DOM element to work with.
   ---------------------------------------------------------- */
function initBlobHover() {
  const selectors = [
    '.skill-card',
    '.project-card',
    '.contact-card',
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(card => {
      if (card.querySelector('.blob-hover')) return; // already injected
      const blob = document.createElement('div');
      blob.className = 'blob-hover';
      blob.setAttribute('aria-hidden', 'true');
      // filter: blur is applied via CSS; here we set it for project cards
      if (card.classList.contains('project-card') || card.classList.contains('contact-card')) {
        blob.style.filter = 'blur(50px)';
      }
      card.appendChild(blob);
    });
  });
}

/* ----------------------------------------------------------
   3. STICKY NAVBAR
   ---------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ----------------------------------------------------------
   4. MOBILE HAMBURGER MENU
   ---------------------------------------------------------- */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  let overlay = null;

  const openMenu = () => {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0',
      'background:rgba(44,35,32,0.45)',
      'z-index:998',
      'backdrop-filter:blur(3px)',
      '-webkit-backdrop-filter:blur(3px)',
      'animation:fadeIn 0.2s ease',
    ].join(';');
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    overlay?.remove();
    overlay = null;
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMenu();
  });
}

/* ----------------------------------------------------------
   5. SCROLL SPY — ACTIVE NAV LINK
   ---------------------------------------------------------- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks).map(link => ({
    link,
    el: document.getElementById(link.getAttribute('data-section')),
  })).filter(({ el }) => el !== null);

  const setActive = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === id);
    });
  };

  const onScroll = () => {
    const scrollMid = window.scrollY + window.innerHeight / 3;
    let current = sections[0]?.link.getAttribute('data-section');
    sections.forEach(({ link, el }) => {
      if (el.offsetTop <= scrollMid) current = link.getAttribute('data-section');
    });
    setActive(current);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ----------------------------------------------------------
   6. SMOOTH SCROLL FOR ANCHOR LINKS
   ---------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ----------------------------------------------------------
   7. SCROLL REVEAL ANIMATIONS
   ---------------------------------------------------------- */
function initReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      entry.target.querySelectorAll('.reveal-child').forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 110);
      });

      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ----------------------------------------------------------
   8. PORTFOLIO CATEGORY TOGGLE (UX/UI · Dev · Art)
   ---------------------------------------------------------- */
function initPortfolioToggle() {
  const toggleBtns   = document.querySelectorAll('.toggle-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!toggleBtns.length || !projectCards.length) return;

  const showCategory = (filter) => {
    let visibleIndex = 0;

    projectCards.forEach(card => {
      const matches = card.getAttribute('data-category') === filter;

      if (matches) {
        card.removeAttribute('hidden');
        const delay = visibleIndex * 65;
        visibleIndex++;

        setTimeout(() => {
          card.classList.add('fade-in');
          card.addEventListener('animationend', () => {
            card.classList.remove('fade-in');
          }, { once: true });
        }, delay);
      } else {
        card.setAttribute('hidden', '');
      }
    });
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      showCategory(btn.getAttribute('data-filter'));

      // Re-inject blobs into any newly revealed cards
      setTimeout(initBlobHover, 100);
    });
  });

  // Init with the active filter
  const activeBtn = document.querySelector('.toggle-btn.active');
  if (activeBtn) showCategory(activeBtn.getAttribute('data-filter'));
}

/* ----------------------------------------------------------
   9. SKILL BAR ANIMATIONS
   ---------------------------------------------------------- */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!fills.length) return;

  const animateBars = () => {
    fills.forEach((fill, i) => {
      setTimeout(() => {
        fill.style.width = fill.getAttribute('data-width') + '%';
      }, i * 110);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBars();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const skillSection = document.getElementById('skillBars');
  if (skillSection) observer.observe(skillSection);
}

/* ----------------------------------------------------------
   10. BACK-TO-TOP BUTTON
   ---------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------------------------
   11. SWATCH TOOLTIP — TOUCH FALLBACK
   Hovering works on desktop. On touch devices, tap to
   briefly show the colour name tooltip.
   ---------------------------------------------------------- */
function initSwatchTooltips() {
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('touchstart', () => {
      swatch.classList.add('touched');
      setTimeout(() => swatch.classList.remove('touched'), 2000);
    }, { passive: true });
  });

  // CSS for touched state
  const style = document.createElement('style');
  style.textContent = '.swatch.touched::after { opacity:1 !important; transform:translateX(-50%) scale(1) !important; }';
  document.head.appendChild(style);
}

/* ----------------------------------------------------------
   12. CARD TILT (desktop with mouse)
   ---------------------------------------------------------- */
function initCardTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -3.5;
      const tiltY = dx *  3.5;

      card.style.transform =
        `translateY(-8px) scale(1.015) perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ----------------------------------------------------------
   INIT
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeadlineAnimation();
  initBlobHover();
  initNavbar();
  initHamburger();
  initScrollSpy();
  initSmoothScroll();
  initReveal();
  initPortfolioToggle();
  initSkillBars();
  initBackToTop();
  initSwatchTooltips();
  initCardTilt();
});
