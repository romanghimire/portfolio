document.addEventListener('DOMContentLoaded', () => {
  'use strict';

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
    let typingSpeed = 600;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
        typingSpeed = 45;
      } else {
        charIndex++;
        typingSpeed = 90;
      }

      typingTarget.textContent = currentRole.substring(0, charIndex);

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      window.setTimeout(typeLoop, typingSpeed);
    }

    window.setTimeout(typeLoop, typingSpeed);
  }

  const bioText = document.querySelector('.hero-description');
  const bioDivider = document.querySelector('.bio-divider');
  const educationTable = document.querySelector('.education-table');
  const educationDivider = document.querySelector('.education-divider');
  const educationHeading = document.querySelector('.education-heading');
  const portraitWrapper = document.querySelector('.hero-image');
  const portraitVisual = document.querySelector('.hero-visual');

  function alignPageLayout() {
    if (!bioText) return;

    if (bioDivider) {
      const heroSection = bioDivider.closest('.hero-section');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        bioDivider.style.top = `${bioText.getBoundingClientRect().bottom - heroRect.top + 12}px`;
      }
    }

    if (educationTable && educationDivider) {
      const educationSection = educationDivider.closest('.education-section');
      if (educationSection) {
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
      }
    }

    if (portraitWrapper && portraitVisual) {
      const cropTop = portraitVisual.getBoundingClientRect().top;
      const bioBottom = bioText.getBoundingClientRect().bottom;
      portraitWrapper.style.height = cropTop < bioBottom
        ? `${Math.max(0, Math.ceil(bioBottom - cropTop))}px`
        : '';
    }
  }

  requestAnimationFrame(() => requestAnimationFrame(alignPageLayout));
  window.addEventListener('resize', alignPageLayout, { passive: true });

  if ('ResizeObserver' in window && bioText && portraitWrapper) {
    const layoutObserver = new ResizeObserver(alignPageLayout);
    layoutObserver.observe(bioText);
    if (educationTable) layoutObserver.observe(educationTable);
  }
});
