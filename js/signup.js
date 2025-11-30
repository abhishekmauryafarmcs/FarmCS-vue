document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
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

    function validateForm(formData) {
        const errors = [];
        
        if (!formData.firstName.trim()) errors.push('First Name is required');
        if (!formData.lastName.trim()) errors.push('Last Name is required');
        if (!formData.mobile.trim()) errors.push('Mobile number is required');
        if (!isValidMobile(formData.mobile)) errors.push('Please enter a valid 10-digit mobile number');
        if (!formData.password) errors.push('Password is required');
        if (formData.password.length < 8) errors.push('Password must be at least 8 characters long');
        if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
        if (!formData.state) errors.push('State is required');
        if (!formData.district) errors.push('District is required');
        return errors;
    }

    function isValidMobile(mobile) {
        return /^[0-9]{10}$/.test(mobile);
    }

    function displayErrors(errors) {
        if (!errorDisplay) return;
        
        if (Array.isArray(errors)) {
            errorDisplay.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        } else if (typeof errors === 'string') {
            errorDisplay.innerHTML = `<p>${errors}</p>`;
        }
        errorDisplay.style.display = errors && (Array.isArray(errors) ? errors.length > 0 : true) ? 'block' : 'none';
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    function populateStates() {
        const stateSelect = document.getElementById('state');
        if (!stateSelect) return;
        const stateOptions = Object.keys(districts)
            .sort()
            .map(state => `<option value="${state}">${state}</option>`)
            .join('');
        stateSelect.innerHTML = `<option value="">Select State</option>${stateOptions}`;
    }

    populateStates();

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted');

            const submitButton = this.querySelector('button[type="submit"]');
            if (!submitButton) {
                console.error('Submit button not found');
                return;
            }

            const formData = {
                firstName: document.getElementById('firstName')?.value || '',
                lastName: document.getElementById('lastName')?.value || '',
                mobile: document.getElementById('mobile')?.value || '',
                password: document.getElementById('password')?.value || '',
                confirmPassword: document.getElementById('confirmPassword')?.value || '',
                state: document.getElementById('state')?.value || '',
                district: document.getElementById('district')?.value || ''
            };

            console.log('Form data:', { ...formData, password: '***', confirmPassword: '***' });

            const validationErrors = validateForm(formData);
            if (validationErrors.length > 0) {
                console.log('Validation errors:', validationErrors);
                displayErrors(validationErrors);
                return;
            }

            displayErrors([]);
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Creating Account...';

            try {
                if (!supabaseClient) {
                    throw new Error('Supabase is not configured. Please check supabase.config.js');
                }

                const mobile = formData.mobile.trim();
                const { data: existingUsers, error: existingError } = await supabaseClient
                    .from('users')
                    .select('id')
                    .eq('mobile', mobile);

                if (existingError) throw existingError;
                if (existingUsers && existingUsers.length > 0) {
                    displayErrors('An account with this mobile number already exists.');
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    return;
                }

                const password_hash = await hashPassword(formData.password);
                const { error: insertError } = await supabaseClient
                    .from('users')
                    .insert({
                        first_name: formData.firstName.trim(),
                        last_name: formData.lastName.trim(),
                        mobile,
                        state: formData.state,
                        district: formData.district,
                        password_hash
                    });

                if (insertError) throw insertError;

                submitButton.textContent = 'Account Created!';
                alert('Account created successfully! Please login to continue.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error during signup:', error);
                displayErrors(error.message || 'Failed to create account. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Handle district selection
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');

    if (stateSelect && districtSelect) {
        stateSelect.addEventListener('change', function() {
            const state = this.value;
            districtSelect.disabled = !state;
            
            if (!state) {
                districtSelect.innerHTML = '<option value="">Select District</option>';
                return;
            }

            loadDistricts(state);
        });
    }
});
