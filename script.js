/* ========================================
   PARKIT — Presentation Script
   Sidebar Nav, Scroll Animations, Counters
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sidebar Navigation ---
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const progressFill = document.querySelector('.progress-fill');

  // Click to scroll
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Active section tracking on scroll
  function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach((section, index) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navItems.forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-target="${section.id}"]`);
        if (activeNav) activeNav.classList.add('active');
      }
    });

    // Update progress bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressFill) {
      progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- Intersection Observer for Animations ---
  const animatedElements = document.querySelectorAll('.animate-in, .animate-scale, .animate-slide-left, .animate-slide-right');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // --- Counter Animation ---
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = Math.round(eased * target);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // --- Keyboard Navigation ---
  let currentSectionIndex = 0;
  const sectionIds = Array.from(sections).map(s => s.id);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      currentSectionIndex = Math.min(currentSectionIndex + 1, sectionIds.length - 1);
      document.getElementById(sectionIds[currentSectionIndex]).scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
      document.getElementById(sectionIds[currentSectionIndex]).scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Keep currentSectionIndex in sync with scroll position
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach((section, index) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        currentSectionIndex = index;
      }
    });
  }, { passive: true });

  // --- Smooth entrance for hero ---
  const heroElements = document.querySelectorAll('#hero .animate-in');
  heroElements.forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });

});
