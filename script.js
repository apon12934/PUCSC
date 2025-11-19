// ====================================
// Configuration
// ====================================
const EVENT_DATE = new Date('2025-11-24T00:00:00').getTime(); // Nov 24, 2025, 12:00 AM - Registration Deadline

// Ensure off-screen images decode asynchronously when possible
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img:not([decoding])').forEach((img) => {
        img.decoding = 'async';
    });
});

let scrollLockPosition = 0;

const lockBodyScroll = () => {
    scrollLockPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollLockPosition}px`;
    document.body.style.width = '100%';
};

const unlockBodyScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollLockPosition);
};

// ====================================
// Smooth Scrolling
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Check if mobile menu is open
            const mobileMenu = document.getElementById('mobileMenu');
            const isMenuOpen = mobileMenu && mobileMenu.classList.contains('active');
            const navbar = document.getElementById('navbar');
            const navHeight = navbar ? navbar.offsetHeight : 0;

            if (isMenuOpen) {
                const targetOffset = target.getBoundingClientRect().top + scrollLockPosition - navHeight;
                mobileMenu.classList.remove('active');
                const hamburger = document.getElementById('hamburger');
                if (hamburger) {
                    hamburger.setAttribute('aria-expanded', 'false');
                }
                unlockBodyScroll();
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: targetOffset,
                        behavior: 'smooth'
                    });
                });
            } else {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = target.getBoundingClientRect().top + currentScroll - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ====================================
// Navbar Scroll Effect
// ====================================
let lastScroll = 0;
let navbarTicking = false;
const handleNavbarScroll = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        navbarTicking = false;
        return;
    }
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
    navbarTicking = false;
};

window.addEventListener('scroll', () => {
    if (!navbarTicking) {
        navbarTicking = true;
        window.requestAnimationFrame(handleNavbarScroll);
    }
});

handleNavbarScroll();

// ====================================
// Mobile Hamburger Menu
// ====================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    lockBodyScroll();
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    unlockBodyScroll();
});

// Close menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        unlockBodyScroll();
    }
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        unlockBodyScroll();
    }
});

// ====================================
// Countdown Timer
// ====================================
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;
    
    if (distance < 0) {
        daysEl.innerHTML = '00';
        hoursEl.innerHTML = '00';
        minutesEl.innerHTML = '00';
        secondsEl.innerHTML = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Use innerHTML and force width to prevent reflow
    daysEl.innerHTML = String(days).padStart(2, '0');
    hoursEl.innerHTML = String(hours).padStart(2, '0');
    minutesEl.innerHTML = String(minutes).padStart(2, '0');
    secondsEl.innerHTML = String(seconds).padStart(2, '0');
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// ====================================
// Swiper Slider Initialization
// ====================================
const swiper = new Swiper('.hackathonSwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    speed: 800,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        1280: {
            slidesPerView: 4,
            spaceBetween: 32,
        },
    },
});

if ('IntersectionObserver' in window) {
    const sliderSection = document.querySelector('.slider-section');
    if (sliderSection && swiper?.autoplay) {
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    swiper.autoplay.start();
                } else {
                    swiper.autoplay.stop();
                }
            });
        }, { threshold: 0.2 });
        sliderObserver.observe(sliderSection);
    }
}

// ====================================
// Registration Progress Bar
// ====================================
function updateProgress(current, max) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const percentage = Math.min((current / max) * 100, 100);
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = `${current} / ${max}`;
}

// Example: Initialize with sample data
updateProgress(5, 15);

// You can call this function from anywhere to update the progress
// Example: updateProgress(50, 100);

// ====================================
// Google Form Show/Hide
// ====================================
const showFormBtn = document.getElementById('showFormBtn');
const formContainer = document.getElementById('formContainer');

showFormBtn.addEventListener('click', () => {
    formContainer.classList.toggle('active');
    
    if (formContainer.classList.contains('active')) {
        showFormBtn.innerHTML = '<i class="fas fa-chevron-up mr-2"></i>Hide Registration Form';
        
        // Smooth scroll to form
        setTimeout(() => {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    } else {
        showFormBtn.innerHTML = '<i class="fas fa-chevron-down mr-2"></i>Show Registration Form';
    }
});

// ====================================
// Accordion Functionality
// ====================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const expanded = header.getAttribute('aria-expanded') === 'true';
        const content = document.getElementById(header.getAttribute('aria-controls'));
        
        // Close all other accordions
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header) {
                otherHeader.setAttribute('aria-expanded', 'false');
                const otherContent = document.getElementById(otherHeader.getAttribute('aria-controls'));
                otherContent.classList.remove('active');
            }
        });
        
        // Toggle current accordion
        header.setAttribute('aria-expanded', !expanded);
        content.classList.toggle('active');
    });
    
    // Keyboard navigation
    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
        }
    });
});

// ====================================
// Intersection Observer for Scroll Animations
// ====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ====================================
// Payment Method Buttons - Removed alert
// ====================================
// Copy functionality is now handled by copyNumber() function

// ====================================
// Focus Management for Accessibility
// ====================================
// Trap focus in mobile menu when open
const focusableElements = 'a[href], button, textarea, input, select';

mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableContent = mobileMenu.querySelectorAll(focusableElements);
        const firstFocusable = focusableContent[0];
        const lastFocusable = focusableContent[focusableContent.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
});

// ====================================
// Console Welcome Message
// ====================================
console.log('%c🚀 CSE FEST Cyber Security Hackathon 2025', 'color: #00D9FF; font-size: 20px; font-weight: bold;');
console.log('%cDefend • Detect • Dominate', 'color: #22D3EE; font-size: 14px;');
console.log('%cPowered by PUCSC', 'color: #fff; font-size: 12px;');

// ====================================
// Prevent Default Form Submission (if any)
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Let Google Form handle its own submission
            if (!form.action.includes('google.com')) {
                e.preventDefault();
            }
        });
    });
});

// ====================================
// Dynamic Year in Footer (if needed)
// ====================================
const currentYear = new Date().getFullYear();
const copyrightText = document.querySelector('footer p');
if (copyrightText && copyrightText.textContent.includes('2025')) {
    // Keep 2025 as it's the event year
    // But you could update if needed
}

// ====================================
// Lazy Loading for Images (Optional Enhancement)
// ====================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ====================================
// Preload Critical Assets
// ====================================
window.addEventListener('load', () => {
    // Preload logo
    const logoLink = document.createElement('link');
    logoLink.rel = 'preload';
    logoLink.as = 'image';
    logoLink.href = 'assets/logos/pucsc_logo.svg';
    document.head.appendChild(logoLink);
    
    // Preload hero image
    const heroLink = document.createElement('link');
    heroLink.rel = 'preload';
    heroLink.as = 'image';
    heroLink.href = 'assets/heros/hero-main.png';
    document.head.appendChild(heroLink);
});

// ====================================
// Handle Navigation Active State
// ====================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ====================================
// Copy Number Function
// ====================================
function copyNumber(number, source) {
    event.preventDefault();
    event.stopPropagation();
    
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = number;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        // Show "Copied!" text
        const copiedText = document.getElementById(`${source}-copied`);
        copiedText.style.opacity = '1';
        
        setTimeout(() => {
            copiedText.style.opacity = '0';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    } finally {
        document.body.removeChild(textarea);
    }
}

// ====================================
// Lightbox Functions
// ====================================
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ====================================
// Console Log for Debugging
// ====================================
console.log('All scripts loaded successfully!');
console.log('Event Date:', new Date(EVENT_DATE).toLocaleString());

// Export functions for external use (if needed)
window.updateProgress = updateProgress;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.copyNumber = copyNumber;
