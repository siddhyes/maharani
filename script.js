// ============================================
// MAHARANI PALACE - INTERACTIONS v2
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1800);
    });

    // Fallback - hide preloader after 3 seconds max
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 3000);

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    let lastScrollY = 0;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class after 50px
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load

    // ============================================
    // MOBILE MENU
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // HERO SLIDER
    // ============================================
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        // Wrap around
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    // Auto-play
    const startAutoPlay = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
        clearInterval(slideInterval);
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(i);
            startAutoPlay();
        });
    });

    // Start slider
    if (slides.length > 0) {
        startAutoPlay();
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const fadeUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeUpObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.section-label, .section-header h2, .about-features .af-item, ' +
        '.room-card, .gallery-item, .info-card, .footer-brand, .footer-links, .footer-contact'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        fadeUpObserver.observe(el);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // PARALLAX EFFECT ON HERO
    // ============================================
    const heroSlider = document.querySelector('.hero-slider');

    if (heroSlider) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const heroHeight = document.querySelector('.hero').offsetHeight;

                    if (scrolled < heroHeight) {
                        const parallaxValue = scrolled * 0.4;
                        heroSlider.style.transform = `translateY(${parallaxValue}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // FORM HANDLING
    // ============================================
    const form = document.getElementById('reservationForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('.btn-submit');
            const originalContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span>✓ Thank you! We\'ll contact you soon.</span>';
                submitBtn.style.background = '#27ae60';

                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3500);
            }, 1500);
        });

        // Set minimum date for check-in to today
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');

        if (checkinInput) {
            const today = new Date().toISOString().split('T')[0];
            checkinInput.min = today;

            checkinInput.addEventListener('change', () => {
                if (checkoutInput) {
                    checkoutInput.min = checkinInput.value;
                    if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
                        checkoutInput.value = '';
                    }
                }
            });
        }
    }

    // ============================================
    // IMAGE LOADING ENHANCEMENT
    // ============================================
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // ============================================
    // GALLERY HOVER EFFECT
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            galleryItems.forEach(other => {
                if (other !== this) {
                    other.style.opacity = '0.6';
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            galleryItems.forEach(other => {
                other.style.opacity = '1';
            });
        });
    });

    // ============================================
    // ROOM CARDS HOVER EFFECT
    // ============================================
    const roomCards = document.querySelectorAll('.room-card');

    roomCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            roomCards.forEach(other => {
                if (other !== this) {
                    other.style.opacity = '0.7';
                    other.style.transform = 'scale(0.98)';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            roomCards.forEach(other => {
                other.style.opacity = '1';
                other.style.transform = '';
            });
        });
    });

    // ============================================
    // CURRENT YEAR
    // ============================================
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }

    // ============================================
    // LAZY LOADING FOR PERFORMANCE
    // ============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // PHONE NUMBER CLICK TRACKING
    // ============================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Phone number clicked:', link.href);
            // Add analytics tracking here if needed
        });
    });

    // ============================================
    // CONSOLE BRANDING
    // ============================================
    console.log('%c🏰 Maharani Palace', 'font-size: 24px; font-weight: bold; color: #C9A962;');
    console.log('%cLuxury Hotel in Varanasi', 'font-size: 14px; color: #666;');
    console.log('%cWhere Royalty Lives', 'font-size: 12px; color: #999; font-style: italic;');

    // ============================================
    // BOOKING MODAL
    // ============================================
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalTriggers = document.querySelectorAll('.open-booking-modal');

    // Function to open modal
    const openModal = (e) => {
        if (e) e.preventDefault();
        modal.style.display = 'block';
        // Small delay to allow display:block to apply before adding opacity class for transition
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300); // Wait for transition
    };

    // Event listeners for triggers
    // Note: Triggers are added via class in HTML, but we also handle dynamic adding if needed
    // This part handles existing elements with the class
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    // We also delegate for potential dynamically added elements or if we can't easily select all
    document.addEventListener('click', (e) => {
        if (e.target.closest('.open-booking-modal')) {
            openModal(e);
        }
    });

    // Close button event
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

});
