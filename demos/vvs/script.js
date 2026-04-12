/* ===================================================================
   RENRÖR VVS — Script
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar scroll effect --- */
    const navbar = document.getElementById('navbar');
    const stickyCta = document.getElementById('stickyCta');

    // Show/hide sticky CTA after scrolling past hero
    const handleScroll = () => {
        const heroBottom = document.getElementById('hero');
        if (heroBottom) {
            const rect = heroBottom.getBoundingClientRect();
            if (stickyCta) {
                stickyCta.style.transform = rect.bottom < 0 ? 'translateY(0)' : 'translateY(100%)';
            }
        }
    };

    // Initialize sticky CTA as hidden
    if (stickyCta) {
        stickyCta.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        stickyCta.style.transform = 'translateY(100%)';
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();


    /* --- Mobile menu toggle --- */
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('mobile-open');
                document.body.style.overflow = '';
            });
        });
    }


    /* --- Reveal on scroll (IntersectionObserver) --- */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach((el, index) => {
            // Stagger siblings
            const parent = el.parentElement;
            const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [];
            const siblingIndex = Array.from(siblings).indexOf(el);

            if (siblingIndex > 0) {
                el.style.transitionDelay = `${siblingIndex * 80}ms`;
            }

            observer.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }


    /* --- Smooth scroll for anchor links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
