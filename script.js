/* ==========================================================================
   DEVSPACE 3D PROFESSIONAL PORTFOLIO - MAIN JAVASCRIPT
   All 10 features implemented with professional architecture
   ========================================================================== */

(() => {
  'use strict';

  // ==========================================================================
  // UTILITIES & HELPERS
  // ==========================================================================

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const state = {
    theme: 'dark',
    toasts: [],
    typewriter: {
      phrases: [
        'React & Three.js',
        'Real-time Multiplayer',
        '3D Web Graphics',
        'Performance Focused',
      ],
      currentPhraseIndex: 0,
      currentCharIndex: 0,
      isDeleting: false,
      speed: 80,
      pauseDuration: 2000,
    },
  };

  // ==========================================================================
  // FEATURE 1: THEME TOGGLE (Dark/Light Mode)
  // ==========================================================================

  function initTheme() {
    const themeBtn = $('#themeBtn');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('devspace-theme');
    if (savedTheme) {
      state.theme = savedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      state.theme = 'light';
    }

    applyTheme(state.theme);

    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
      localStorage.setItem('devspace-theme', state.theme);
      showToast('info', `Switched to ${state.theme} mode`);
    });

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      themeBtn.setAttribute('aria-pressed', theme === 'dark');
    }
  }

  // ==========================================================================
  // FEATURE 2: RESPONSIVE HAMBURGER MENU
  // ==========================================================================

  function initHamburgerMenu() {
    const hamburgerBtn = $('#hamburgerBtn');
    const navLinks = $('#navLinks');
    const navLinkElements = $$('.nav-link', navLinks);

    if (!hamburgerBtn || !navLinks) return;

    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isOpen);
      navLinks.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    navLinkElements.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        hamburgerBtn.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // FEATURE 3: BACK TO TOP BUTTON
  // ==========================================================================

  function initBackToTop() {
    const backToTopBtn = $('#backToTop');
    const hero = $('#home');

    if (!backToTopBtn || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          backToTopBtn.hidden = false;
          requestAnimationFrame(() => backToTopBtn.classList.add('visible'));
        } else {
          backToTopBtn.classList.remove('visible');
          setTimeout(() => {
            if (!backToTopBtn.classList.contains('visible')) {
              backToTopBtn.hidden = true;
            }
          }, 300);
        }
      },
      { rootMargin: '-100px 0px 0px 0px', threshold: 0 }
    );

    observer.observe(hero);

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      showToast('info', 'Scrolled to top');
    });
  }

  // ==========================================================================
  // FEATURE 4: TOAST NOTIFICATIONS
  // ==========================================================================

  function initToastSystem() {
    // Container is in HTML
  }

  function showToast(type, message, duration = 4000) {
    const container = $('#toastContainer');
    if (!container) return;

    const icons = {
      success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
      error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Dismiss notification">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    const closeBtn = $('.toast-close', toast);
    closeBtn.addEventListener('click', () => hideToast(toast));

    container.appendChild(toast);

    // Trigger show animation
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto-hide
    const hideTimer = setTimeout(() => hideToast(toast), duration);

    // Pause on hover
    toast.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    toast.addEventListener('mouseleave', () => {
      setTimeout(() => hideToast(toast), 1000);
    });

    return toast;
  }

  function hideToast(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }

  // ==========================================================================
  // FEATURE 5: TYPEWRITER EFFECT (Hero Subtitle)
  // ==========================================================================

  function initTypewriter() {
    const typewriterText = $('#typewriterText');
    if (!typewriterText) return;

    const { phrases } = state.typewriter;
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let animationId = null;

    function type() {
      const currentPhrase = phrases[currentPhraseIndex];
      const speed = isDeleting ? 40 : state.typewriter.speed;

      if (isDeleting) {
        currentCharIndex--;
        typewriterText.textContent = currentPhrase.slice(0, currentCharIndex);
      } else {
        currentCharIndex++;
        typewriterText.textContent = currentPhrase.slice(0, currentCharIndex);
      }

      // Determine next action
      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        // Finished typing, pause then delete
        isDeleting = true;
        setTimeout(type, state.typewriter.pauseDuration);
        return;
      }

      if (isDeleting && currentCharIndex === 0) {
        // Finished deleting, move to next phrase
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        setTimeout(type, 500);
        return;
      }

      animationId = requestAnimationFrame(type);
    }

    // Start typewriter
    if (!prefersReducedMotion()) {
      type();
    } else {
      typewriterText.textContent = phrases[0];
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (animationId) cancelAnimationFrame(animationId);
    });
  }

  // ==========================================================================
  // FEATURE 6: PROJECT FILTER GRID (Isotope-style)
  // ==========================================================================

  function initProjectFilter() {
    const filterBtns = $$('.filter-btn');
    const projectCards = $$('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards with animation
        projectCards.forEach((card, index) => {
          const categories = card.dataset.category.split(' ');
          const matches = filter === 'all' || categories.includes(filter);

          if (matches) {
            card.style.setProperty('--delay', `${index * 60}ms`);
            card.classList.remove('hidden');
            // Force reflow for animation
            card.offsetHeight;
          } else {
            card.classList.add('hidden');
          }
        });

        showToast('info', `Showing ${filter === 'all' ? 'all projects' : filter} projects`);
      });
    });
  }

  // ==========================================================================
  // FEATURE 7: ANIMATED SKILL BARS
  // ==========================================================================

  function initSkillBars() {
    const skillBars = $$('.skill-bar');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
    );

    skillBars.forEach(bar => observer.observe(bar));
  }

  // ==========================================================================
  // FEATURE 8: FAQ ACCORDION
  // ==========================================================================

  function initFaqAccordion() {
    const faqItems = $$('.faq-item');

    faqItems.forEach(item => {
      const summary = $('summary', item);
      const answer = $('.faq-answer', item);

      if (!summary || !answer) return;

      // Set initial height for animation
      item.style.setProperty('--faq-height', '0px');

      item.addEventListener('toggle', () => {
        if (item.open) {
          // Calculate height
          answer.style.display = 'block';
          const height = answer.scrollHeight;
          answer.style.height = '0px';
          answer.style.transition = 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

          requestAnimationFrame(() => {
            answer.style.height = `${height}px`;
          });

          // Cleanup after animation
          setTimeout(() => {
            answer.style.height = 'auto';
            answer.style.transition = '';
          }, 300);
        } else {
          const height = answer.scrollHeight;
          answer.style.height = `${height}px`;
          answer.style.transition = 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

          requestAnimationFrame(() => {
            answer.style.height = '0px';
          });

          setTimeout(() => {
            answer.style.display = 'none';
            answer.style.height = '';
            answer.style.transition = '';
          }, 300);
        }
      });

      // Keyboard support
      summary.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.open = !item.open;
        }
      });
    });
  }

  // ==========================================================================
  // FEATURE 9: ANIMATED COUNTERS (About Stats)
  // ==========================================================================

  function initAnimatedCounters() {
    const stats = $$('.stat[data-target]');
    if (!stats.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach(stat => observer.observe(stat));

    function animateCounter(stat) {
      const target = parseInt(stat.dataset.target, 10);
      const suffix = stat.dataset.suffix || '';
      const valueEl = $('.stat-value', stat);
      if (!valueEl) return;

      const duration = 1200;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration, 0, 1);

        // Easing: easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(eased * target);

        valueEl.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    }
  }

  // ==========================================================================
  // FEATURE 10: MESSAGE CHARACTER COUNTER (Contact Form)
  // ==========================================================================

  function initCharCounter() {
    const textarea = $('#message');
    const charCount = $('#charCount');

    if (!textarea || !charCount) return;

    const maxLength = parseInt(textarea.getAttribute('maxlength'), 10) || 500;

    function updateCounter() {
      const length = textarea.value.length;
      charCount.textContent = length;

      // Update visual state
      charCount.parentElement.classList.remove('warning', 'error');
      if (length > maxLength * 0.9) {
        charCount.parentElement.classList.add('warning');
      }
      if (length >= maxLength) {
        charCount.parentElement.classList.add('error');
      }
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter(); // Initial
  }

  // ==========================================================================
  // FEATURE 11: SCROLL REVEAL ANIMATIONS
  // ==========================================================================

  function initScrollReveal() {
    const revealElements = $$(
      '.section-header, .glass-card, .project-card, .faq-item, .contact-method, .stat, .skill-bar'
    );

    if (!revealElements.length) return;

    // Add reveal class
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // CONTACT FORM HANDLING
  // ==========================================================================

  function initContactForm() {
    const form = $('#contactForm');
    const formMessage = $('#formMessage');
    const submitBtn = $('button[type="submit"]', form);

    if (!form || !formMessage || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate
      const formData = new FormData(form);
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const subject = formData.get('subject')?.trim();
      const message = formData.get('message')?.trim();

      if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      showFormMessage(`Thank you, ${name}! Your message has been sent.`, 'success');
      showToast('success', 'Message sent successfully!');
      form.reset();
      $('#charCount').textContent = '0';
    });

    function showFormMessage(text, type) {
      formMessage.textContent = text;
      formMessage.className = `form-message ${type}`;

      if (type === 'success') {
        setTimeout(() => {
          formMessage.textContent = '';
          formMessage.className = 'form-message';
        }, 5000);
      }
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }

  // ==========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================

  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = $('.nav')?.offsetHeight || 72;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });

      // Update URL without scrolling
      history.pushState(null, '', href);
    });
  }

  // ==========================================================================
  // PARALLAX HERO CODE BLOCKS (Enhanced 3D)
  // ==========================================================================

  function initHeroParallax() {
    if (prefersReducedMotion()) return;

    const codeBlocks = $$('.floating-code');
    const heroCube = $('#heroCube');
    const heroShapes = $$('.hero-shape');
    if (!codeBlocks.length && !heroCube && !heroShapes.length) return;

    const hero = $('#home');
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Mouse move handler for cube interaction
    if (hero) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      });

      hero.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
      });
    }

    function animate() {
      // Smooth interpolation for mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      const scrollY = window.scrollY;
      if (!hero) return;

      const heroRect = hero.getBoundingClientRect();
      const heroCenter = heroRect.top + heroRect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = (viewportCenter - heroCenter) * 0.3;

      // Animate floating code blocks with scroll + mouse
      codeBlocks.forEach((block, i) => {
        const speed = 0.02 + i * 0.005;
        const rotationY = scrollY * speed + targetX * 5;
        const rotationX = distance * 0.001 + targetY * 5;
        const translateZ = Math.sin(scrollY * 0.001 + i) * 20;

        block.style.transform = `
          translate3d(0, 0, ${translateZ}px)
          rotateY(${rotationY}deg)
          rotateX(${rotationX}deg)
        `;
      });

      // Animate hero cube with mouse follow via CSS custom properties
      if (heroCube) {
        const cubeRotateX = targetY * 30;
        const cubeRotateY = targetX * 30;
        heroCube.style.setProperty('--auto-rotate-x', `${cubeRotateX}deg`);
        heroCube.style.setProperty('--auto-rotate-y', `${cubeRotateY}deg`);
      }

      // Animate hero shapes with subtle mouse follow via CSS custom properties
      heroShapes.forEach((shape) => {
        const speed = parseFloat(shape.style.getPropertyValue('--shape-speed')) || 1;
        shape.style.setProperty('--shape-mouse-x', targetX.toFixed(3));
        shape.style.setProperty('--shape-mouse-y', targetY.toFixed(3));
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // ==========================================================================
  // NAV ACTIVE STATE ON SCROLL
  // ==========================================================================

  function initNavActiveState() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
  }

  // ==========================================================================
   // PERFORMANCE: LAZY LOAD NON-CRITICAL
   // ==========================================================================

  function initLazyFeatures() {
    // Defer non-critical initializations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initHeroParallax();
        initNavActiveState();
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        initHeroParallax();
        initNavActiveState();
      }, 2000);
    }
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  function init() {
    // Core features (immediate)
    initTheme();
    initHamburgerMenu();
    initBackToTop();
    initToastSystem();
    initTypewriter();
    initProjectFilter();
    initSkillBars();
    initFaqAccordion();
    initAnimatedCounters();
    initCharCounter();
    initScrollReveal();
    initContactForm();
    initSmoothScroll();

    // Deferred features
    initLazyFeatures();

    // Announce ready
    console.log('%c DevSpace v2.0 initialized', 'color: #00D4FF; font-size: 14px; font-weight: bold; font-family: monospace;');
    console.log('%c Features: Theme, Hamburger, Back-to-top, Toast, Typewriter, Filter, Skills, FAQ, Counters, Char Counter, Scroll Reveal, Hero 3D Parallax', 'color: #6BA3BF; font-size: 11px; font-family: monospace;');
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.DevSpace = {
    showToast,
    state,
  };
})();