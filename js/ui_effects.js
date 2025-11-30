document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const overlay = document.querySelector('.overlay');
    const container = document.querySelector('.signup-container, .login-container');
    const card = document.querySelector('.signup-card, .login-card');
    const header = document.querySelector('.signup-header, .login-header');
    const formGroups = document.querySelectorAll('.form-group');

    // Handle background click
    if (overlay && container) {
        document.body.addEventListener('click', function(e) {
            if (!container.contains(e.target) && !card.contains(e.target)) {
                window.location.href = 'index.php';
            }
        });
        
        container.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Handle page transition
    document.querySelector('.page-transition')?.addEventListener('click', function(e) {
        e.preventDefault();
        const container = document.querySelector('.signup-card, .login-card');
        container.classList.add('fade-out');
        
        setTimeout(() => {
            window.location.href = this.href;
        }, 500);
    });

    // 3D hover effect - DISABLED
    // All perspective and 3D transforms removed to prevent wiggle effects
    if (card && header && formGroups.length) {
        // No 3D effects - keeping containers static
        console.log('3D effects disabled for static containers');
        
        // Floating animation DISABLED - removed for static containers
        // preserve-3d DISABLED - removed for static containers
    }
}); 