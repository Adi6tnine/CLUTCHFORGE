/* ================================
   CLUTCHFORGE Gaming Website Scripts
   Interactive Functionality
   ================================ */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeEventFilters();
    initializeContactForm();
    initializeFAQ();
    initializeScrollEffects();
    initializeLoadMore();
});

// Navigation Functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Scroll Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll(
        '.about-card, .event-card, .team-card, .position-card, .value-card, ' +
        '.info-card, .option-card, .partnership-card, .vmv-block, .stat-item'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Event Filters Functionality
function initializeEventFilters() {
    const gameFilter = document.getElementById('game-filter');
    const statusFilter = document.getElementById('status-filter');
    const prizeFilter = document.getElementById('prize-filter');
    const eventsGrid = document.getElementById('events-grid');

    if (!gameFilter || !statusFilter || !prizeFilter || !eventsGrid) return;

    function filterEvents() {
        const gameValue = gameFilter.value;
        const statusValue = statusFilter.value;
        const prizeValue = prizeFilter.value;
        const eventCards = eventsGrid.querySelectorAll('.event-card');

        eventCards.forEach(card => {
            const cardGame = card.dataset.game;
            const cardStatus = card.dataset.status;
            const cardPrize = card.dataset.prize;

            let showCard = true;

            // Game filter
            if (gameValue !== 'all' && cardGame !== gameValue) {
                showCard = false;
            }

            // Status filter
            if (statusValue !== 'all' && cardStatus !== statusValue) {
                showCard = false;
            }

            // Prize filter
            if (prizeValue !== 'all' && cardPrize !== prizeValue) {
                showCard = false;
            }

            // Show/hide card with animation
            if (showCard) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Update displayed count
        const visibleCards = Array.from(eventCards).filter(card => 
            card.style.display !== 'none'
        );
        
        console.log(`Showing ${visibleCards.length} of ${eventCards.length} events`);
    }

    // Add event listeners to filters
    gameFilter.addEventListener('change', filterEvents);
    statusFilter.addEventListener('change', filterEvents);
    prizeFilter.addEventListener('change', filterEvents);

    // Initialize filter styles
    document.querySelectorAll('.event-card').forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (!validateForm(data)) {
            return;
        }

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });

    function validateForm(data) {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.subject) {
            errors.push('Please select a subject');
        }

        if (!data.message || data.message.length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        if (errors.length > 0) {
            showNotification(errors.join('. '), 'error');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Hero scroll indicator
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const nextSection = document.querySelector('.about-preview') || 
                               document.querySelector('section:nth-of-type(2)');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Load More Events
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    let eventsLoaded = 6; // Initial number of events shown
    const eventsPerLoad = 3;

    loadMoreBtn.addEventListener('click', function() {
        // Simulate loading more events
        const loadingText = 'Loading...';
        const originalText = loadMoreBtn.textContent;
        
        loadMoreBtn.textContent = loadingText;
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            // In a real implementation, you would fetch more events from an API
            eventsLoaded += eventsPerLoad;
            
            showNotification(`Loaded ${eventsPerLoad} more events!`, 'success');
            
            loadMoreBtn.textContent = originalText;
            loadMoreBtn.disabled = false;

            // Hide button if no more events (simulate)
            if (eventsLoaded >= 12) {
                loadMoreBtn.style.display = 'none';
                showNotification('All events loaded!', 'info');
            }
        }, 1500);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: '9999',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.9rem',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    // Set background color based on type
    const colors = {
        success: '#00FF88',
        error: '#FF3838',
        warning: '#FFB800',
        info: '#00B8F4'
    };
    notification.style.background = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remove after 5 seconds
    const autoRemoveTimer = setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemoveTimer);
        removeNotification(notification);
    });

    // Style the notification content
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    });

    // Style the close button
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '0',
        marginLeft: 'auto'
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Button Interaction Effects
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        Object.assign(ripple.style, {
            position: 'absolute',
            borderRadius: '50%',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px',
            background: 'rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none'
        });
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Team Card Hover Effects
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 20px 40px rgba(162, 89, 255, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Event Card Registration Tracking
document.querySelectorAll('.event-card .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.textContent.includes('Register')) {
            e.preventDefault();
            const eventTitle = this.closest('.event-card').querySelector('.event-title').textContent;
            showNotification(`Registration initiated for ${eventTitle}`, 'info');
            
            // Simulate registration process
            setTimeout(() => {
                showNotification('Redirecting to registration form...', 'success');
                // In a real implementation, you would redirect to the actual registration
                window.location.href = 'contact.html';
            }, 1500);
        }
    });
});

// Social Media Link Tracking
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function() {
        const platform = this.querySelector('i').className.includes('discord') ? 'Discord' : 
                        this.querySelector('i').className.includes('instagram') ? 'Instagram' : 
                        'Email';
        console.log(`User clicked ${platform} social link`);
    });
});

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-dependent functionality here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Accessibility: Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
    
    // Enter key activates buttons and links
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Form Input Focus Effects
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value) {
            this.parentElement.classList.add('filled');
        } else {
            this.parentElement.classList.remove('filled');
        }
    });
});

// Page Load Performance Tracking
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// Error Handling for Images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.log(`Failed to load image: ${this.src}`);
        // You could set a fallback image here
        // this.src = 'assets/fallback-image.svg';
    });
});

// Console Easter Egg for Developers
console.log(`
%c🎮 CLUTCHFORGE Developer Console 🎮
%cWelcome to the CLUTCHFORGE website!
%cInterested in joining our development team?
%cContact us at: hello@clutchforge.com

%cForging India's Gaming Culture 🚀
`, 
'color: #FF3C38; font-size: 16px; font-weight: bold;',
'color: #00B8F4; font-size: 12px;',
'color: #A259FF; font-size: 12px;',
'color: #00B8F4; font-size: 12px;',
'color: #FF3C38; font-size: 14px; font-weight: bold;'
);
