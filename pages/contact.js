const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const icon = darkModeToggle.querySelector('i');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!hamburger?.contains(event.target) && !navLinks?.contains(event.target)) {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.style.display = 'block';
    contactForm.reset();
    setTimeout(() => successMessage.style.display = 'none', 4000);
});

function applyDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    icon.classList.toggle('fa-sun', enabled);
    icon.classList.toggle('fa-moon', !enabled);
}

const savedDarkMode = localStorage.getItem('contactDarkMode') === 'enabled';
applyDarkMode(savedDarkMode);

darkModeToggle.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('dark-mode');
    applyDarkMode(enabled);
    localStorage.setItem('contactDarkMode', enabled ? 'enabled' : 'disabled');
});

window.AOS?.init({ duration: 1000, once: true });
