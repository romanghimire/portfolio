/**
 * ============================================================================
 * ROMAN GHIMIRE - PORTFOLIO JAVASCRIPT
 * Computer Engineering Student Portfolio
 * Features:
 *  - Canvas Particle Background with Proximity Connections & Mouse Interaction
 *  - Dynamic Typing Animation for Hero Subtitle
 *  - Sticky Navbar & Active Section Highlighting
 *  - Mobile Navigation Drawer with Backdrop Blur
 *  - Viewport-Triggered Counter Animation for Stats
 *  - Viewport-Triggered Animated Skill Progress Bars
 *  - Interactive Category Filter for Creative Gallery
 *  - Fullscreen Lightbox Modal with Carousel Navigation
 *  - Interactive Contact Form with Validation & Feedback
 *  - Copy Email to Clipboard with Toast Notification
 *  - IntersectionObserver Scroll-Reveal Engine
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Toast Notification Utility
     -------------------------------------------------------------------------- */
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimer = null;

  function showToast(message, type = 'success') {
    if (!toast || !toastMsg) return;

    if (toastTimer) clearTimeout(toastTimer);

    toastMsg.textContent = message;
    if (type === 'success') {
      toastIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i>';
    } else if (type === 'info') {
      toastIcon.innerHTML = '<i class="fa-solid fa-circle-info" style="color: var(--accent-cyan);"></i>';
    } else {
      toastIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i>';
    }

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  /* --------------------------------------------------------------------------
     2. Interactive Particle Background Canvas
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.density = Math.random() * 20 + 1;
        // Color variation between indigo, purple, and soft cyan
        const colors = [
          'rgba(99, 102, 241, 0.65)',
          'rgba(139, 92, 246, 0.65)',
          'rgba(6, 182, 212, 0.55)',
          'rgba(236, 72, 153, 0.45)'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wall bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction: push away gently
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density * 0.5;
            const directionY = forceDirectionY * force * this.density * 0.5;

            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      // Adjust density based on screen resolution
      const numberOfParticles = Math.min(Math.floor((width * height) / 14000), 85);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 120;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     3. Hero Subtitle Typing Effect
     -------------------------------------------------------------------------- */
  const portraitWrapper = document.querySelector('.hero-image');
  const portraitVisual = document.querySelector('.hero-visual');
  const bioText = document.querySelector('.hero-description');
  const bioDivider = document.querySelector('.bio-divider');
  const educationTable = document.querySelector('.education-table');
  const educationDivider = document.querySelector('.education-divider');
  const educationHeading = document.querySelector('.education-heading');

  function alignPortraitCropWithBio() {
    if (!bioText) return;

    if (bioDivider) {
      const heroSection = bioDivider.closest('.hero-section');
      const heroRect = heroSection.getBoundingClientRect();
      bioDivider.style.top = `${bioText.getBoundingClientRect().bottom - heroRect.top + 12}px`;
    }

    if (educationTable && educationDivider) {
      const educationSection = educationDivider.closest('.education-section');
      const sectionRect = educationSection.getBoundingClientRect();
      if (bioDivider) {
        educationTable.style.top = `${bioDivider.getBoundingClientRect().bottom - sectionRect.top + 50}px`;
      }
      if (educationHeading) {
        const tableTop = educationTable.offsetTop;
        educationHeading.style.top = `${Math.max(0, tableTop - educationHeading.offsetHeight - 10)}px`;
      }
      educationDivider.style.top = `${educationTable.getBoundingClientRect().bottom - sectionRect.top + 50}px`;
      educationSection.style.height = `${educationDivider.offsetTop + educationDivider.offsetHeight}px`;
      educationSection.style.height = `${educationDivider.offsetTop + educationDivider.offsetHeight}px`;
    }

    if (!portraitWrapper || !portraitVisual) return;

    const cropTop = portraitVisual.getBoundingClientRect().top;
    const bioBottom = bioText.getBoundingClientRect().bottom;

    if (cropTop < bioBottom) {
      portraitWrapper.style.height = `${Math.max(0, Math.ceil(bioBottom - cropTop))}px`;
    } else {
      portraitWrapper.style.height = '';
    }
  }

  requestAnimationFrame(() => requestAnimationFrame(alignPortraitCropWithBio));
  window.addEventListener('resize', alignPortraitCropWithBio);
  if ('ResizeObserver' in window && bioText && portraitWrapper) {
    const cropObserver = new ResizeObserver(alignPortraitCropWithBio);
    cropObserver.observe(bioText);
    if (educationTable) cropObserver.observe(educationTable);
  }

  const typingTarget = document.getElementById('typing-text');
  if (typingTarget) {
    const roles = [
      'Future Computer Engineer',
      'Problem Solver',
      'Tech Enthusiast'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typingTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at full word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    setTimeout(typeLoop, 600);
  }

  /* --------------------------------------------------------------------------
     4. Navigation Bar Scrolled State & Mobile Drawer
     -------------------------------------------------------------------------- */
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const desktopLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow & blur on scroll
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Drawer open / close handlers
  function openMobileDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    hamburgerBtn?.classList.add('active');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    hamburgerBtn?.classList.remove('active');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('open')) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  });

  drawerCloseBtn?.addEventListener('click', closeMobileDrawer);
  drawerBackdrop?.addEventListener('click', closeMobileDrawer);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Active section observer for desktop & mobile navigation
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* --------------------------------------------------------------------------
     5. Scroll-Reveal Animation Engine (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     6. Stats Counter Animation
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  function animateCounters() {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800; // milliseconds
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quad
        const easeOutProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(easeOutProgress * target);

        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          animateCounters();
        }
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(aboutSection);
  }

  /* --------------------------------------------------------------------------
     7. Skills Progress Bar Fill Animation
     -------------------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.progress-bar-fill');
  let hasAnimatedSkills = false;

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedSkills) {
          hasAnimatedSkills = true;
          skillBars.forEach((bar) => {
            const targetWidth = bar.getAttribute('data-progress');
            bar.style.width = `${targetWidth}%`;
          });
        }
      },
      { threshold: 0.2 }
    );
    skillsObserver.observe(skillsSection);
  }

  /* --------------------------------------------------------------------------
     8. Creative Gallery Filter & Lightbox Modal
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Filter functionality
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Re-trigger animation
          setTimeout(() => {
            item.classList.add('revealed');
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxVisual = document.getElementById('lightbox-visual');
  const lightboxCardIcon = document.getElementById('lightbox-card-icon');
  const lightboxCardTag = document.getElementById('lightbox-card-tag');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryList = [];
  let currentActiveIndex = 0;

  function updateVisibleGalleryList() {
    currentGalleryList = Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
  }

  function renderLightbox(index) {
    if (!currentGalleryList.length) return;

    if (index < 0) index = currentGalleryList.length - 1;
    if (index >= currentGalleryList.length) index = 0;

    currentActiveIndex = index;
    const targetItem = currentGalleryList[currentActiveIndex];

    const title = targetItem.getAttribute('data-title') || 'Creative Work';
    const desc = targetItem.getAttribute('data-desc') || 'A visual exploration from my portfolio.';
    const category = targetItem.getAttribute('data-category') || 'Portfolio';
    const gradientClass = targetItem.getAttribute('data-gradient') || 'gradient-aurora';

    // Extract icon class from inner markup
    const innerIcon = targetItem.querySelector('.placeholder-icon');
    const iconClass = innerIcon ? innerIcon.className : 'fa-solid fa-image';

    // Apply visual styling
    lightboxVisual.className = `lightbox-visual ${gradientClass}`;
    lightboxCardIcon.className = `${iconClass} lightbox-card-icon`;
    lightboxCardTag.textContent = title;
    lightboxCategory.textContent = category;
    lightboxCounter.textContent = `${currentActiveIndex + 1} of ${currentGalleryList.length}`;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
  }

  function openLightbox(itemElement) {
    updateVisibleGalleryList();
    const index = currentGalleryList.indexOf(itemElement);
    if (index !== -1) {
      renderLightbox(index);
      lightboxModal?.classList.add('active');
      lightboxModal?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    lightboxModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    renderLightbox(currentActiveIndex - 1);
  });

  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    renderLightbox(currentActiveIndex + 1);
  });

  // Keyboard controls for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderLightbox(currentActiveIndex - 1);
    if (e.key === 'ArrowRight') renderLightbox(currentActiveIndex + 1);
  });

  /* --------------------------------------------------------------------------
     9. Interactive Contact Form with Validation
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  const submitBtn = document.getElementById('form-submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  function clearErrors() {
    [nameError, emailError, subjectError, messageError].forEach((el) => {
      if (el) el.textContent = '';
    });
    if (formFeedback) {
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
    }
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      nameError.textContent = 'Name must be at least 2 characters.';
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectError.textContent = 'Please provide a subject.';
      isValid = false;
    } else if (subjectInput.value.trim().length < 4) {
      subjectError.textContent = 'Subject must be at least 4 characters.';
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please write a message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 15) {
      messageError.textContent = 'Message should be at least 15 characters long.';
      isValid = false;
    }

    if (!isValid) return;

    // Start loading state
    submitBtn?.classList.add('loading');
    submitBtn?.setAttribute('disabled', 'true');

    // Simulate server dispatch delay
    setTimeout(() => {
      submitBtn?.classList.remove('loading');
      submitBtn?.removeAttribute('disabled');

      // Success Feedback
      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. Roman will respond within 24 hours.';
      }

      showToast('Message sent successfully! Thank you for reaching out.', 'success');
      contactForm.reset();
    }, 1400);
  });

  /* --------------------------------------------------------------------------
     10. Copy Email to Clipboard Feature
     -------------------------------------------------------------------------- */
  const emailCopyCard = document.getElementById('email-copy-card');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  function copyEmailAction(e) {
    e.preventDefault();
    const emailToCopy = '';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(emailToCopy)
        .then(() => {
          showToast(`Copied ${emailToCopy} to clipboard!`, 'info');
        })
        .catch(() => {
          fallbackCopyText(emailToCopy);
        });
    } else {
      fallbackCopyText(emailToCopy);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`, 'info');
    } catch (err) {
      showToast('Could not automatically copy email. Please select and copy manually.', 'error');
    }
    document.body.removeChild(textArea);
  }

  emailCopyCard?.addEventListener('click', (e) => {
    // If user clicked the mailto link itself, allow default action
    if (e.target.tagName.toLowerCase() === 'a') return;
    copyEmailAction(e);
  });

  copyEmailBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    copyEmailAction(e);
  });

  /* --------------------------------------------------------------------------
     11. Back to Top Button & Dynamic Copyright Year
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     12. Initial Console Welcome Brand
     -------------------------------------------------------------------------- */
  console.log(
    '%c Roman Ghimire %c Computer Engineering Student %c\nPortfolio',
    'background: #6366f1; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #8b5cf6; color: #fff; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    'color: #94a3b8; font-style: italic; margin-top: 4px;'
  );
});
