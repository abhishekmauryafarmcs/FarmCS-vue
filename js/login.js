document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorDisplay = document.getElementById('errorDisplay');
    
    // Check if Supabase is loaded
    if (!window.supabase) {
        console.error('Supabase library not loaded');
        if (errorDisplay) {
            errorDisplay.textContent = 'Error: Supabase library not loaded. Please refresh the page.';
            errorDisplay.style.display = 'block';
        }
        return;
    }
    
    // Check if config is loaded
    if (!window.__SUPABASE_URL__ || !window.__SUPABASE_ANON_KEY__) {
        console.error('Supabase configuration not found');
        if (errorDisplay) {
            errorDisplay.textContent = 'Error: Supabase configuration missing. Please check supabase.config.js';
            errorDisplay.style.display = 'block';
        }
        return;
    }
    
    const supabaseClient = window.supabase.createClient(
        window.__SUPABASE_URL__,
        window.__SUPABASE_ANON_KEY__
    );

    function showError(message) {
        if (errorDisplay) {
            errorDisplay.textContent = message;
            errorDisplay.style.display = 'block';
        } else {
            alert(message);
        }
    }

    function hideError() {
        if (errorDisplay) {
            errorDisplay.style.display = 'none';
        }
    }

    function formatPhone(mobile) {
        return mobile.startsWith('+') ? mobile : `+91${mobile}`;
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideError();

            if (!supabaseClient) {
                showError('Supabase is not configured. Please check supabase.config.js');
                return;
            }

            const mobile = document.getElementById('mobile')?.value?.trim();
            const password = document.getElementById('password')?.value?.trim();

            if (!mobile || !password) {
                showError('Please enter both mobile number and password');
                return;
            }

            if (!/^[0-9]{10}$/.test(mobile)) {
                showError('Please enter a valid 10-digit mobile number');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';

            try {
                // Hash the password to compare with stored hash
                const passwordHash = await hashPassword(password);
                
                // Query our users table instead of using Supabase Auth
                const { data: userData, error: userError } = await supabaseClient
                    .from('users')
                    .select('*')
                    .eq('mobile', mobile)
                    .single();

                if (userError) {
                    throw new Error('User not found. Please check your mobile number or sign up.');
                }

                // Verify password (simple comparison since we're using SHA-256)
                if (userData.password_hash !== passwordHash) {
                    throw new Error('Invalid password. Please try again.');
                }

                // Create session data
                const sessionData = {
                    id: userData.id,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    mobile: userData.mobile,
                    state: userData.state,
                    district: userData.district,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                };

                // Store session in localStorage
                localStorage.setItem('user', JSON.stringify(sessionData));
                localStorage.setItem('isLoggedIn', 'true');

                // Update last login in database
                await supabaseClient
                    .from('users')
                    .update({ last_login: new Date().toISOString() })
                    .eq('mobile', mobile);

                // Redirect to dashboard
                window.location.href = 'pages/dashboard.html';
            } catch (error) {
                console.error('Login error:', error);
                showError(error.message || 'Unable to login. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Handle background click
    const overlay = document.querySelector('.overlay');
    const loginContainer = document.querySelector('.login-container');

    if (overlay && loginContainer) {
        document.body.addEventListener('click', function(e) {
            if (!loginContainer.contains(e.target)) {
                window.location.href = 'index.html';
            }
        });
        
        loginContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Handle signup link transition
    document.querySelector('.page-transition')?.addEventListener('click', function(e) {
        e.preventDefault();
        const container = document.querySelector('.login-card');
        container.classList.add('fade-out');
        
        setTimeout(() => {
            window.location.href = this.href;
        }, 500);
    });
});
