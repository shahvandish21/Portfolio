// Simple frontend login/register/logout simulation using localStorage

// Utility to get users from localStorage
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

// Utility to save users to localStorage
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Utility to get current logged in user
function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

// Utility to set current logged in user
function setCurrentUser(email) {
  localStorage.setItem('currentUser', email);
}

// Utility to clear current user (logout)
function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// Redirect to index if logged in
function redirectIfLoggedIn() {
  if (getCurrentUser()) {
    window.location.href = 'index.html';
  }
}

// Redirect to login if not logged in
function redirectIfNotLoggedIn() {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
  }
}

// On index.html, show logout button if logged in
function setupLogoutButton() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  if (getCurrentUser()) {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'btn-primary logout-btn';
    logoutBtn.style.marginLeft = '1rem';
    logoutBtn.addEventListener('click', () => {
      clearCurrentUser();
      window.location.href = 'login.html';
    });
    nav.querySelector('.social-icons').appendChild(logoutBtn);
  }
}

// Login form handling
function handleLogin() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setCurrentUser(email);
      window.location.href = 'index.html';
    } else {
      alert('Invalid email or password');
    }
  });
}

// Register form handling without OTP verification

function handleRegister() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const mobile = registerForm.mobile.value.trim();

    if (!name || !email || !password || !mobile) {
      alert('Please fill in all fields');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      alert('Email already registered');
      return;
    }

    users.push({ name, email, password, mobile });
    saveUsers(users);
    alert(`Welcome to Vandish's Portfolio, ${name}!`);
    window.location.href = 'login.html';
  });
}

// Function to set active nav link based on scroll position
function setActiveNavLink() {
  const sections = ['hero-section', 'about', 'skills', 'contact'];
  const navLinks = document.querySelectorAll('.nav-links li a');

  let current = '';

  sections.forEach(section => {
    const element = document.getElementById(section) || document.querySelector('.' + section);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        current = section;
      }
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if ((current === 'hero-section' && link.getAttribute('href') === '#') ||
        (current === 'about' && link.getAttribute('href') === '#about') ||
        (current === 'skills' && link.getAttribute('href') === '#skills') ||
        (current === 'contact' && link.getAttribute('href') === '#contact')) {
      link.classList.add('active');
    }
  });
}

// Particle background
function createParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const numParticles = 100;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.5
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Handle contact form submission
function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Initialize EmailJS (replace with your public key)
  emailjs.init('YOUR_PUBLIC_KEY');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields');
      return;
    }

    // Send email using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      from_name: name,
      from_email: email,
      message: message,
      to_email: email // Send to the user's email
    })
    .then((response) => {
      alert('Message sent successfully!');
      contactForm.reset();
    }, (error) => {
      alert('Failed to send message. Please try again.');
      console.error('EmailJS error:', error);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('login.html')) {
    redirectIfLoggedIn();
    handleLogin();
  } else if (window.location.pathname.endsWith('register.html')) {
    redirectIfLoggedIn();
    handleRegister();
  } else if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    redirectIfNotLoggedIn();
    setupLogoutButton();
    handleContactForm(); // Handle contact form
    // Set up scroll listener for active nav
    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink(); // Set initial active

    // Particle background
    createParticles();

    // Fade-in animation on scroll
    const fadeEls = document.querySelectorAll('.hero-section, .about-section, .skills-section, .contact-section');
    const onScroll = () => {
      fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('visible', 'fade-in');
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Typing effect for intro text
    const introTextEl = document.querySelector('.intro-text p');
    if (introTextEl) {
      const text = introTextEl.textContent;
      introTextEl.textContent = '';
      let index = 0;
      const type = () => {
        if (index < text.length) {
          introTextEl.textContent += text.charAt(index);
          index++;
          setTimeout(type, 50);
        }
      };
      type();
    }

    // Animate skill bars on scroll
    const skillLevels = document.querySelectorAll('.skill-level');
    const animateSkills = () => {
      skillLevels.forEach(skill => {
        const rect = skill.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          skill.style.width = skill.getAttribute('style').match(/width: (\d+)%/)[1] + '%';
        }
      });
    };
    window.addEventListener('scroll', animateSkills);
    animateSkills();
  }
});
