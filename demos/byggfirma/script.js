/* ===================================================================
   BYGGMÄSTER LINDGREN — Script
   Features: scroll effects, mobile menu, reveal animations,
   smooth scrolling, portfolio filter, review carousel, form submit
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------------------
       NAVBAR scroll shadow enhancement
    --------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 20
                ? '0 4px 24px rgba(44, 32, 20, 0.12)'
                : '0 2px 12px rgba(44, 32, 20, 0.07)';
        }
    }, { passive: true });


    /* ---------------------------------------------------------------
       STICKY CTA — show after hero scrolls past viewport
    --------------------------------------------------------------- */
    const stickyCta = document.getElementById('stickyCta');

    const handleStickyScroll = () => {
        const hero = document.getElementById('hero');
        if (!hero || !stickyCta) return;
        const pastHero = hero.getBoundingClientRect().bottom < 0;
        stickyCta.style.transform = pastHero ? 'translateY(0)' : 'translateY(100%)';
    };

    if (stickyCta) {
        stickyCta.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        stickyCta.style.transform = 'translateY(100%)';
    }

    window.addEventListener('scroll', handleStickyScroll, { passive: true });
    handleStickyScroll();


    /* ---------------------------------------------------------------
       MOBILE MENU TOGGLE
    --------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    /* ---------------------------------------------------------------
       REVEAL ON SCROLL (IntersectionObserver)
    --------------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach((el, i) => {
            // Stagger siblings in same parent
            const siblings = el.parentElement
                ? Array.from(el.parentElement.querySelectorAll(':scope > .reveal'))
                : [];
            const idx = siblings.indexOf(el);
            if (idx > 0) el.style.transitionDelay = `${idx * 75}ms`;
            observer.observe(el);
        });
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }


    /* ---------------------------------------------------------------
       SMOOTH SCROLL (anchor links)
    --------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const hash = anchor.getAttribute('href');
            if (hash === '#') return;
            const target = document.querySelector(hash);
            if (!target) return;
            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 0;
            const y = target.getBoundingClientRect().top + window.scrollY - navH - 20;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });


    /* ---------------------------------------------------------------
       PORTFOLIO FILTER TABS
    --------------------------------------------------------------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                const cat = item.dataset.cat;
                const show = filter === 'all' || cat === filter;

                if (show) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });


    /* ---------------------------------------------------------------
       REVIEW CAROUSEL
    --------------------------------------------------------------- */
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('revPrev');
    const nextBtn = document.getElementById('revNext');
    const dotsContainer = document.getElementById('revDots');

    if (track && prevBtn && nextBtn) {
        const cards = Array.from(track.querySelectorAll('.review-card'));
        let currentIdx = 0;

        // How many visible cards at a time (responsive)
        const getVisible = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

        let visibleCount = getVisible();
        let maxIdx = Math.max(0, cards.length - visibleCount);

        // Build dots
        const buildDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const dotCount = maxIdx + 1;
            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement('button');
                dot.className = 'rev-dot' + (i === currentIdx ? ' active' : '');
                dot.setAttribute('aria-label', `Omdöme ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
        };

        const updateDots = () => {
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.rev-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIdx);
            });
        };

        const goTo = (idx) => {
            currentIdx = Math.max(0, Math.min(idx, maxIdx));
            const cardW = cards[0].getBoundingClientRect().width;
            const gap = 24;
            track.style.transform = `translateX(-${currentIdx * (cardW + gap)}px)`;
            updateDots();
        };

        prevBtn.addEventListener('click', () => goTo(currentIdx - 1));
        nextBtn.addEventListener('click', () => goTo(currentIdx + 1));

        // Auto-play
        let autoTimer = setInterval(() => {
            goTo(currentIdx >= maxIdx ? 0 : currentIdx + 1);
        }, 5000);

        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                clearInterval(autoTimer);
                autoTimer = setInterval(() => {
                    goTo(currentIdx >= maxIdx ? 0 : currentIdx + 1);
                }, 5000);
            });
        });

        // Recalc on resize
        window.addEventListener('resize', () => {
            visibleCount = getVisible();
            maxIdx = Math.max(0, cards.length - visibleCount);
            currentIdx = Math.min(currentIdx, maxIdx);
            buildDots();
            goTo(currentIdx);
        }, { passive: true });

        buildDots();
        goTo(0);
    }


    /* ---------------------------------------------------------------
       CONTACT FORM — Submission feedback
    --------------------------------------------------------------- */
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="ph-fill ph-spinner-gap" style="animation:spin 0.8s linear infinite"></i> Skickar...';
            }

            // Simulate async send (replace with real fetch to Netlify or backend)
            await new Promise(r => setTimeout(r, 1200));

            if (form && formSuccess) {
                form.hidden = true;
                formSuccess.hidden = false;

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }


    /* ---------------------------------------------------------------
       COUNTERS — animate numbers when stats band enters view
    --------------------------------------------------------------- */
    const statItems = document.querySelectorAll('.stat-item strong');

    const animateCounter = (el) => {
        const target = el.textContent;
        const isPlus = target.includes('+');
        const isStar = target.includes('★');
        const isPct = target.includes('%');
        const numStr = target.replace(/[^0-9.]/g, '');
        const num = parseFloat(numStr);
        const decimals = numStr.includes('.') ? 1 : 0;

        if (isNaN(num)) return;

        const duration = 1200;
        const steps = 50;
        const stepTime = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            const current = num * eased;

            let display = decimals ? current.toFixed(1) : Math.floor(current).toString();
            if (isStar) display += '★';
            else if (isPlus) display += '+';
            else if (isPct) display += '%';

            el.textContent = display;

            if (step >= steps) {
                clearInterval(timer);
                el.textContent = target; // restore exact value
            }
        }, stepTime);
    };

    if ('IntersectionObserver' in window) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statItems.forEach(animateCounter);
                    counterObs.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsBand = document.querySelector('.stats-band');
        if (statsBand) counterObs.observe(statsBand);
    }

});

/* Spinner keyframes injected via JS (avoids modifying CSS for single use) */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: none; }
}`;
document.head.appendChild(spinStyle);
