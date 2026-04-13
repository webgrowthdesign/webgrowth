document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        const icon = mobileNav.classList.contains('open') ? 'x' : 'menu';
        mobileBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            mobileBtn.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });

    // 3. Menu Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuPanes = document.querySelectorAll('.menu-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            menuPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding pane
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // 4. Booking Form Submission Mock
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('booking-success');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulerar ett anrop till servern
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Bokar...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Återställ knapp
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                // Visa success meddelande
                successMsg.classList.remove('hidden');
                
                // Rensa formulär
                bookingForm.reset();

                // Dölj meddelandet efter 5 sekunder
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 5000);
            }, 1000);
        });
    }

    // Initialize Lucide Icons for dynamically added content if any
    lucide.createIcons();
});
