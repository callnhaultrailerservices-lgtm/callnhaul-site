/* Call N Haul Trailer Services LLC — App JS */

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav')) {
    navLinks?.classList.remove('open');
  }
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// Animate elements into view
const animItems = document.querySelectorAll('.service-card, .contact-card, .about-text, .about-image');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animItems.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  fadeObserver.observe(el);
});

// Contact form handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const error = document.getElementById('form-error');

    // Hide previous error
    error.setAttribute('hidden', '');

    // Client-side validation
    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const service = form.querySelector('#service').value;

    if (!name || !phone || !service) {
      error.textContent = 'Please fill in your name, phone number, and the service you need.';
      error.removeAttribute('hidden');
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://formspree.io/f/xzdjlkvl', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (response.ok) {
        window.location.href = 'thank-you.html';
      } else {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        error.textContent = 'Something went wrong. Please try again or call us at (623) 850-8221.';
        error.removeAttribute('hidden');
      }
    } catch {
      clearTimeout(timeout);
      btn.textContent = 'Send Message';
      btn.disabled = false;
      error.textContent = 'Something went wrong. Please try again or call us at (623) 850-8221.';
      error.removeAttribute('hidden');
    }
  });
}
