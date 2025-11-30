const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const icon = darkModeToggle?.querySelector('i');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

document.addEventListener('click', event => {
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

function setDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    if (icon) {
        icon.classList.toggle('fa-sun', enabled);
        icon.classList.toggle('fa-moon', !enabled);
    }
}

const savedDarkMode = localStorage.getItem('learnMoreDarkMode') === 'enabled';
setDarkMode(savedDarkMode);

darkModeToggle?.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('dark-mode');
    setDarkMode(enabled);
    localStorage.setItem('learnMoreDarkMode', enabled ? 'enabled' : 'disabled');
});

window.AOS?.init({ duration: 1000, once: true });
