// ====================================
// Configuration
// ====================================
const EVENT_DATE = new Date('2025-11-28T20:00:00').getTime(); // Nov 28, 2025, 08:00 PM

// ====================================
// Smooth Scrolling
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// ====================================
// Navbar Scroll Effect
// ====================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ====================================
// Mobile Hamburger Menu
// ====================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
});

// Close menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// ====================================
// Countdown Timer
// ====================================
function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;
    
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
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
updateProgress(35, 100);

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
// Payment Method Buttons (Placeholder)
// ====================================
const paymentBtns = document.querySelectorAll('.payment-method-btn');

paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Payment details will be shared after registration form submission. Please complete the registration form first.');
    });
});

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
// Console Log for Debugging
// ====================================
console.log('All scripts loaded successfully!');
console.log('Event Date:', new Date(EVENT_DATE).toLocaleString());

// Export functions for external use (if needed)
window.updateProgress = updateProgress;
