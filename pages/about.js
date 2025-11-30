// Enhanced Mobile Navigation and Interactions
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

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

    // Enhanced Dark Mode Toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const icon = darkModeToggle?.querySelector('i');
    
    function applyDarkModeState(enabled) {
        document.body.classList.toggle('dark-mode', enabled);
        if (icon) {
            icon.classList.toggle('fa-sun', enabled);
            icon.classList.toggle('fa-moon', !enabled);
        }
    }

    const savedDarkMode = localStorage.getItem('aboutDarkMode') === 'enabled';
    applyDarkModeState(savedDarkMode);

    darkModeToggle?.addEventListener('click', () => {
        const enabled = !document.body.classList.contains('dark-mode');
        applyDarkModeState(enabled);
        localStorage.setItem('aboutDarkMode', enabled ? 'enabled' : 'disabled');
    });

    // Initialize AOS
    if (window.AOS) {
        AOS.init({ 
            duration: 800, 
            once: true,
            offset: 100
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header
    const header = document.querySelector('header');
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .team-card, .impact-card, .achievement-badge');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Mobile viewport height fix
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Style Google Translate widget in mobile menu
    function styleMobileTranslateWidget() {
        const mobileSelect = document.querySelector('.mobile-language-selector .goog-te-combo');
        if (mobileSelect) {
            mobileSelect.style.border = '1px solid var(--primary-green)';
            mobileSelect.style.borderRadius = '8px';
            mobileSelect.style.padding = '8px 12px';
            mobileSelect.style.backgroundColor = 'transparent';
            mobileSelect.style.color = 'var(--dark-text)';
            mobileSelect.style.cursor = 'pointer';
            mobileSelect.style.fontSize = '14px';
            mobileSelect.style.outline = 'none';
            mobileSelect.style.width = '200px';
            mobileSelect.style.margin = '0 auto';
            mobileSelect.style.display = 'block';
        }
    }
    
    // Style translate widgets when they load
    setTimeout(styleMobileTranslateWidget, 1000);
    setInterval(styleMobileTranslateWidget, 3000);
});
