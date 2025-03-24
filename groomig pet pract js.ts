document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, starting script execution...');

    // Selectors with null checks
    const loader = document.querySelector('.loader');
    const main = document.querySelector('main');
    const modal = document.getElementById('booking-modal');
    const openButtons = document.querySelectorAll('[data-modal-open]');
    const closeButton = modal?.querySelector('.modal-close');
    const form = modal?.querySelector('.booking-form');
    const navLinks = document.querySelectorAll('.nav-links a');
    const settingsLink = document.getElementById('settingsLink');
    const settingsCard = document.getElementById('settingsCard');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const adminStatus = document.getElementById('adminStatus');

    // Exit early if critical elements are missing
    if (!loader || !main || !modal || !form || !closeButton) {
        console.error('Critical DOM elements missing, exiting early:', { loader, main, modal, form, closeButton });
        return;
    }

    // Initial setup: default password and phone
    let businessPassword = localStorage.getItem('businessPassword') || 'grooming123';
    let businessPhone = localStorage.getItem('businessPhone') || '07845984597';

    // Load existing bookings
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Loader
    setTimeout(() => {
        console.log('Hiding loader');
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
            main.removeAttribute('hidden');
            displayBookings(); // Display bookings after page loads
        }, 500);
    }, 1500);

    // Modal Open
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Opening modal');
            modal.showModal();
        });
    });

    // Modal Close handlers
    closeButton.addEventListener('click', () => modal.close());
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.close();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.open) modal.close();
    });

    // Navigation Scroll
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href')?.slice(1);
            const targetSection = targetId ? document.getElementById(targetId) : null;
            targetSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Settings Card Toggle
    if (settingsLink && settingsCard && closeSettingsBtn) {
        settingsLink.addEventListener('click', e => {
            e.preventDefault();
            settingsCard.classList.add('active');
            document.body.classList.add('settings-open');
        });
        closeSettingsBtn.addEventListener('click', () => {
            settingsCard.classList.remove('active');
            document.body.classList.remove('settings-open');
        });
    }

    // Change Password Logic
    if (changePasswordBtn && adminStatus) {
        changePasswordBtn.addEventListener('click', () => {
            const enteredPhone = prompt('Enter your phone number to verify:')?.trim();
            if (enteredPhone === null) return; // User canceled prompt
            if (enteredPhone === businessPhone) {
                const newPassword = prompt('Enter your new password:')?.trim();
                if (newPassword === null) return; // User canceled prompt
                if (newPassword) {
                    businessPassword = newPassword;
                    localStorage.setItem('businessPassword', newPassword);
                    adminStatus.textContent = 'Password updated successfully!';
                    setTimeout(() => adminStatus.textContent = '', 3000);
                } else {
                    adminStatus.textContent = 'Password cannot be empty.';
                }
            } else {
                adminStatus.textContent = 'Incorrect phone number.';
            }
        });
    }

    // Form Submission to localStorage
    form.addEventListener('submit', e => {
        e.preventDefault();
        console.log('Form submitted - Saving to localStorage');

        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const dateInput = document.getElementById('date');
        const serviceInput = document.getElementById('service');

        if (!nameInput || !phoneInput || !dateInput || !serviceInput) {
            console.error('Form inputs missing:', { nameInput, phoneInput, dateInput, serviceInput });
            alert('Form is incomplete. Please try again.');
            return;
        }

        const nameValue = nameInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const dateValue = dateInput.value;
        const serviceValue = serviceInput.value;

        // Validation
        if (!nameValue) {
            console.log('Validation failed: No name');
            alert('Please enter your name.');
            nameInput.focus();
            return;
        }
        if (!phoneValue || !/^\d{10}$/.test(phoneValue)) {
            console.log('Validation failed: Invalid phone');
            alert('Phone number must be exactly 10 digits.');
            phoneInput.focus();
            return;
        }
        if (!dateValue) {
            console.log('Validation failed: No date');
            alert('Please select a date.');
            dateInput.focus();
            return;
        }
        if (!serviceValue) {
            console.log('Validation failed: No service');
            alert('Please select a service.');
            serviceInput.focus();
            return;
        }

        // Save booking to localStorage
        const booking = {
            name: nameValue,
            phone: phoneValue,
            date: dateValue,
            service: serviceValue
        };
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Booking saved:', booking);

        // Display bookings and reset form
        displayBookings();
        modal.close();
        form.reset();
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Function to display bookings day-wise
    function displayBookings() {
        const display = document.getElementById('bookingsDisplay');
        if (!display) return;

        display.innerHTML = '<h2>Upcoming Bookings</h2>';
        const bookingsByDate = {};

        // Group bookings by date
        bookings.forEach(booking => {
            if (!bookingsByDate[booking.date]) bookingsByDate[booking.date] = [];
            bookingsByDate[booking.date].push(booking);
        });

        // Sort dates and display
        Object.keys(bookingsByDate).sort().forEach(date => {
            const dateSection = document.createElement('div');
            dateSection.className = 'date-section';
            dateSection.innerHTML = `<h3>${formatDate(date)}</h3>`;
            bookingsByDate[date].forEach(booking => {
                const bookingDiv = document.createElement('div');
                bookingDiv.className = 'booking-item';
                bookingDiv.innerHTML = `
                    <strong>${booking.name}</strong><br>
                    Phone: ${booking.phone}<br>
                    Service: ${booking.service}
                `;
                dateSection.appendChild(bookingDiv);
            });
            display.appendChild(dateSection);
        });
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Initial display of bookings
    displayBookings();
});