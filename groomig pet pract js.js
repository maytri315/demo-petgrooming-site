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
    const viewBookingsBtn = document.getElementById('viewBookingsBtn');
    const adminStatus = document.getElementById('adminStatus');
    const donePopup = document.getElementById('donePopup');

    if (!loader || !main || !modal || !form || !closeButton || !donePopup) {
        console.error('Critical DOM elements missing:', { loader, main, modal, form, closeButton, donePopup });
        return;
    }

    // Initial setup
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Loader
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
            main.removeAttribute('hidden');
        }, 500);
    }, 1500);

    // Modal Open
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Opening modal');
            modal.showModal();
        });
    });

    // Modal Close
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
            const targetSection = document.getElementById(targetId);
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

    // View Bookings (Direct Link)
    if (viewBookingsBtn) {
        viewBookingsBtn.addEventListener('click', () => {
            window.location.href = 'https://maytri315.github.io/pet-grooming-bookingpage/index.html'; // Direct redirect to bookings.html
        });
    }

    // Form Submission with "Done" Popup
    form.addEventListener('submit', e => {
        e.preventDefault();
        console.log('Form submitted - Saving to localStorage');

        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const dateInput = document.getElementById('date');
        const serviceInput = document.getElementById('service');

        if (!nameInput || !phoneInput || !dateInput || !serviceInput) {
            console.error('Form inputs missing');
            alert('Form is incomplete. Please try again.');
            return;
        }

        const nameValue = nameInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const dateValue = dateInput.value;
        const serviceValue = serviceInput.value;

        // Validation
        if (!nameValue) {
            alert('Please enter your name.');
            nameInput.focus();
            return;
        }
        if (!phoneValue || !/^\d{10}$/.test(phoneValue)) {
            alert('Phone number must be exactly 10 digits.');
            phoneInput.focus();
            return;
        }
        if (!dateValue) {
            alert('Please select a date.');
            dateInput.focus();
            return;
        }
        if (!serviceValue) {
            alert('Please select a service.');
            serviceInput.focus();
            return;
        }

        // Save booking
        const booking = { name: nameValue, phone: phoneValue, date: dateValue, service: serviceValue };
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Booking saved:', booking);

        // Show "Done" popup
        donePopup.classList.add('active');
        setTimeout(() => {
            donePopup.classList.remove('active');
        }, 2000);

        // Reset form and close modal
        modal.close();
        form.reset();
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Blog Read More Toggle
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const blogCard = link.closest('.blog-card');
            const fullText = blogCard.querySelector('.full-text');

            if (blogCard && fullText) {
                if (blogCard.classList.contains('expanded')) {
                    blogCard.classList.remove('expanded');
                    fullText.setAttribute('hidden', '');
                    link.textContent = 'Read more';
                } else {
                    blogCard.classList.add('expanded');
                    fullText.removeAttribute('hidden');
                    link.textContent = 'Read less';
                }
            }
        });
    });
});
