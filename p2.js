$(document).ready(function () {
    // Validation functions
    function validateFullName(name) {
        return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }

    function validatePassword(password) {
        // At least 8 characters, one uppercase, one lowercase, one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    function validateDOB(dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        return (age > 16 ||
            (age === 16 && monthDiff > 0) ||
            (age === 16 && monthDiff === 0 && today.getDate() >= birthDate.getDate()));
    }

    // Real-time validation
    $('#fullName').on('input', function () {
        const name = $(this).val().trim();
        const errorSpan = $('#fullNameError');

        if (!validateFullName(name)) {
            errorSpan.text('Please enter a valid name (at least 2 characters, letters only)');
        } else {
            errorSpan.text('');
        }
    });

    $('#email').on('input', function () {
        const email = $(this).val().trim();
        const errorSpan = $('#emailError');

        if (!validateEmail(email)) {
            errorSpan.text('Please enter a valid email address');
        } else {
            errorSpan.text('');
        }
    });

    $('#phone').on('input', function () {
        const phone = $(this).val().trim();
        const errorSpan = $('#phoneError');

        if (!validatePhone(phone)) {
            errorSpan.text('Please enter a valid 10-digit phone number');
        } else {
            errorSpan.text('');
        }
    });

    $('#dob').on('change', function () {
        const dob = $(this).val();
        const errorSpan = $('#dobError');

        if (!validateDOB(dob)) {
            errorSpan.text('You must be at least 16 years old');
        } else {
            errorSpan.text('');
        }
    });

    $('#password').on('input', function () {
        const password = $(this).val();
        const errorSpan = $('#passwordError');

        if (!validatePassword(password)) {
            errorSpan.text('Password must be at least 8 characters, include uppercase, lowercase, and a number');
        } else {
            errorSpan.text('');
        }
    });

    $('#confirm-password').on('input', function () {
        const password = $('#password').val();
        const confirmPassword = $(this).val();
        const errorSpan = $('#confirmPasswordError');

        if (password !== confirmPassword) {
            errorSpan.text('Passwords do not match');
        } else {
            errorSpan.text('');
        }
    });

    // Form submission handling
    $('#registrationForm').on('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const formData = {
            fullName: $('#fullName').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            dob: $('#dob').val(),
            gender: $('#gender').val(),
            address: $('#address').val().trim(),
            education: $('#education').val().trim(),
            skills: $('#skills').val().trim(),
            terms: $('#terms').is(':checked')
        };

        // Validate all fields
        let isValid = true;
        const validations = [
            { field: 'fullName', validator: validateFullName, errorId: '#fullNameError', errorMsg: 'Please enter a valid name' },
            { field: 'email', validator: validateEmail, errorId: '#emailError', errorMsg: 'Please enter a valid email' },
            { field: 'phone', validator: validatePhone, errorId: '#phoneError', errorMsg: 'Please enter a valid phone number' },
            { field: 'dob', validator: validateDOB, errorId: '#dobError', errorMsg: 'You must be at least 16 years old' }
        ];

        validations.forEach(function (validation) {
            const value = formData[validation.field];
            const errorSpan = $(validation.errorId);

            if (!validation.validator(value)) {
                errorSpan.text(validation.errorMsg);
                isValid = false;
            } else {
                errorSpan.text('');
            }
        });

        // Validate password
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();
        const passwordError = $('#passwordError');
        const confirmPasswordError = $('#confirmPasswordError');

        if (!validatePassword(password)) {
            passwordError.text('Password must be at least 8 characters, include uppercase, lowercase, and a number');
            isValid = false;
        } else {
            passwordError.text('');
        }

        if (password !== confirmPassword) {
            confirmPasswordError.text('Passwords do not match');
            isValid = false;
        } else {
            confirmPasswordError.text('');
        }

        // Terms agreement
        if (!formData.terms) {
            $('#termsError').text('You must agree to the terms and conditions');
            isValid = false;
        } else {
            $('#termsError').text('');
        }

        // If all validations pass, submit via AJAX
        // If all validations pass, submit via AJAX
        if (isValid) {
            $.ajax({
                type: 'POST',
                url: 'process_registration.php',
                data: formData,
                dataType: 'html', // Explicitly set dataType to html
                success: function (response) {
                    // Replace the entire body content with the response
                    $('body').html(response);
                },
                error: function (xhr, status, error) {
                    $('#registrationResult')
                        .removeClass('success')
                        .addClass('error')
                        .html('Registration failed: ' + xhr.responseText);
                    console.error('AJAX Error:', status, error);
                }
            });
        }
    });
});