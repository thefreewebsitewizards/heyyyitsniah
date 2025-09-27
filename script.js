// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLoading();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    // Hero animations will be initialized after loading screen
    initializeBrandCarousel();
    initializeVideoCarousel();
    initializeDesktopMarquee();
    initializeBrandMarquees();
    initializeBubbleAnimation();
    
    // Initialize AOS (Animate On Scroll) - will be properly enabled after loading
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: false
        });
    }
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    const heroBackground = document.querySelector('.hero-background');
    const heroContent = document.querySelector('.hero-content');
    
    // Lock scrolling immediately when loading screen is active
    document.documentElement.classList.add('scroll-locked');
    document.body.classList.add('scroll-locked');
    
    // Ensure hero content is initially hidden
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
    }
    
    // Preload critical assets
    const profileImg = new Image();
    profileImg.src = 'Images/Profile.jpg';
    
    // Add performance optimizations
    profileImg.loading = 'eager';
    
    let assetsLoaded = false;
    let pageLoaded = false;
    
    // Check if all assets are loaded
    profileImg.onload = function() {
        assetsLoaded = true;
        checkLoadingComplete();
    };
    
    profileImg.onerror = function() {
        assetsLoaded = true; // Continue even if profile image fails to load
        checkLoadingComplete();
    };
    
    // Check if page is loaded
    window.addEventListener('load', function() {
        pageLoaded = true;
        checkLoadingComplete();
    });
    
    function checkLoadingComplete() {
        if (assetsLoaded && pageLoaded) {
            // Minimum loading time of 1 second for better UX
            setTimeout(() => {
                // Start hiding loading screen
                loadingScreen.classList.add('hidden');
                
                // After loading screen starts hiding, begin hero animations
                setTimeout(() => {
                    // Show hero background
                    if (heroBackground) {
                        heroBackground.classList.add('loaded');
                    }
                    
                    // Show hero content with animation
                    if (heroContent) {
                        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
                        heroContent.style.opacity = '1';
                        heroContent.style.transform = 'translateY(0)';
                    }
                    
                    // Initialize hero animations after loading screen is completely hidden
                     initializeHeroAnimations();
                     
                     // Refresh AOS animations after hero is ready
                     setTimeout(() => {
                         if (typeof AOS !== 'undefined') {
                             AOS.refresh(); // Refresh existing AOS instead of reinitializing
                         }
                         initializeTypewriter();
                     }, 500);
                }, 400);
                
                // Remove loading screen from DOM and unlock scrolling
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Unlock scrolling after loading screen is completely removed
                    document.documentElement.classList.remove('scroll-locked');
                    document.body.classList.remove('scroll-locked');
                }, 800);
            }, 1500);
        }
    }
}

// Hero Animations (called after loading completes)
function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Animate hero elements with staggered timing
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translate3d(0, 0, 0)';
        }, 200);
    }
    
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translate3d(0, 0, 0)';
        }, 400);
    }
    
    if (heroDescription) {
        setTimeout(() => {
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translate3d(0, 0, 0)';
        }, 600);
    }
    
    if (heroCta) {
        setTimeout(() => {
            heroCta.style.opacity = '1';
            heroCta.style.transform = 'translate3d(0, 0, 0)';
        }, 800);
    }
    
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }, 1000);
    }
}

// Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Store the navbar's original position on page load
    const navbarElement = document.querySelector('.navbar');
    let navbarOriginalTop = 0;
    
    if (navbarElement) {
        // Get the original position before any sticky behavior
        navbarOriginalTop = navbarElement.offsetTop;
    }
    
    // Scroll effect for navbar sticky behavior
    window.addEventListener('scroll', function() {
        if (navbarElement) {
            // Make navbar sticky when it reaches the top of the viewport
            // Use the stored original position, not the current offsetTop
            if (window.scrollY >= navbarOriginalTop) {
                navbar.classList.add('sticky');
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('sticky');
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Full-screen overlay elements
    const navOverlay = document.getElementById('navOverlay');
    const navOverlayClose = document.getElementById('navOverlayClose');
    const navOverlayLinks = document.querySelectorAll('.nav-overlay-link');
    
    // Full-screen overlay toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : 'auto';
        
        // Update aria-hidden for accessibility
        navOverlay.setAttribute('aria-hidden', !navOverlay.classList.contains('active'));
        
        // Focus management for accessibility
        if (navOverlay.classList.contains('active')) {
            // Focus the first navigation link when overlay opens
            setTimeout(() => {
                const firstLink = navOverlay.querySelector('.nav-overlay-link');
                if (firstLink) firstLink.focus();
            }, 300);
        }
    });
    
    // Close overlay with close button
    navOverlayClose.addEventListener('click', function() {
        closeNavOverlay();
    });
    
    // Close overlay when clicking on links
    navOverlayLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeNavOverlay();
        });
    });
    
    // Close overlay with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
            closeNavOverlay();
        }
    });
    
    // Close overlay function
    function closeNavOverlay() {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Update aria-hidden for accessibility
        navOverlay.setAttribute('aria-hidden', 'true');
        
        // Return focus to hamburger button
        hamburger.focus();
    }
    
    // Trap focus within overlay when active
    navOverlay.addEventListener('keydown', function(e) {
        if (!navOverlay.classList.contains('active')) return;
        
        if (e.key === 'Tab') {
            const focusableElements = navOverlay.querySelectorAll(
                '.nav-overlay-close, .nav-overlay-link, .nav-overlay-social-link'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    // Legacy mobile menu support (fallback)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate proper offset based on section type
                let offsetTop;
                
                if (targetId === '#home') {
                    // For home section (hero-secondary), scroll to exact top
                    offsetTop = targetSection.offsetTop;
                } else if (targetId === '#about' || targetId === '#services' || targetId === '#portfolio' || targetId === '#contact') {
                    // For other sections, account for navbar height
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    offsetTop = targetSection.offsetTop - navbarHeight;
                } else {
                    // Default fallback
                    offsetTop = targetSection.offsetTop - 80;
                }
                
                // Enhanced scroll with better timing
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize active navigation highlighting within this function
    initializeActiveNavigation();
}



// Scroll Effects
function initializeScrollEffects() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Scroll progress indicator
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
    
    // Parallax effect for secondary hero section
    const heroSecondary = document.querySelector('.hero-secondary');
    const parallaxImage = document.querySelector('.parallax-image');
    const floatingShapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSecondaryTop = heroSecondary ? heroSecondary.offsetTop : 0;
        const heroSecondaryHeight = heroSecondary ? heroSecondary.offsetHeight : 0;
        
        // Only apply parallax when the secondary hero is in view
        if (scrolled + window.innerHeight > heroSecondaryTop && 
            scrolled < heroSecondaryTop + heroSecondaryHeight) {
            const rate = (scrolled - heroSecondaryTop) * 0.5;
            
            if (parallaxImage) {
                parallaxImage.style.transform = `translateY(${rate}px)`;
            }
        }
        
        // Animate floating shapes with different speeds
        floatingShapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .link-card, .stat-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter Animation
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayNumber = Math.floor(current);
        if (displayNumber >= 1000) {
            displayNumber = (displayNumber / 1000).toFixed(0) + 'K';
        }
        
        element.textContent = displayNumber + suffix;
    }, 16);
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    let i = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                typewriterElement.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// Brand Carousel
function initializeBrandCarousel() {
    const carousel = document.querySelector('.brands-carousel');
    if (!carousel) return;
    
    // Clone brands for infinite scroll
    const brands = carousel.innerHTML;
    carousel.innerHTML = brands + brands;
    
    // Pause animation on hover
    carousel.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}

// Smooth scroll for CTA buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Calculate proper offset based on section type
            let offsetTop;
            
            if (targetId === '#home') {
                // For home section (hero-secondary), scroll to exact top
                offsetTop = target.offsetTop;
            } else if (targetId === '#about' || targetId === '#services' || targetId === '#portfolio' || targetId === '#contact') {
                // For other sections, account for navbar height
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                offsetTop = target.offsetTop - navbarHeight;
            } else {
                // Default fallback
                offsetTop = target.offsetTop - 80;
            }
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Add ripple effect to buttons
document.querySelectorAll('.cta-button, .link-button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add ripple styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgba(255, 255, 255, 0.6);
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Lazy loading for images (when you add real images)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    };
    
    // Load critical resources
    const criticalStyles = [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalStyles.forEach(href => {
        // Check if stylesheet is already loaded
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        }
    });
}

// Initialize performance optimizations
optimizePerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration (disabled - no sw.js file)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//         navigator.serviceWorker.register('/sw.js')
//             .then(function(registration) {
//                 console.log('ServiceWorker registration successful');
//             })
//             .catch(function(err) {
//                 console.log('ServiceWorker registration failed');
//             });
//     });
// }

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Replace with your analytics service (Google Analytics, etc.)
    console.log('Event tracked:', eventName, eventData);
}

// Track important interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.cta-button')) {
        trackEvent('CTA_Click', {
            button_text: e.target.textContent.trim(),
            section: e.target.closest('section')?.id || 'unknown'
        });
    }
    
    if (e.target.matches('.social-link')) {
        trackEvent('Social_Click', {
            platform: e.target.className.split(' ').find(c => c !== 'social-link') || 'unknown'
        });
    }
});

// Accessibility improvements
function improveAccessibility() {
    // Improve focus management for other accessibility features
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Initialize accessibility improvements
improveAccessibility();

// Video Carousel Functionality
function initializeVideoCarousel() {
    const carousel = document.querySelector('.mobile-phone-container .video-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.video-slide');
    const videos = carousel.querySelectorAll('.carousel-video');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const counter = carousel.querySelector('.video-counter');
    
    let currentIndex = 0;
    let currentVideo = null;
    
    // Initialize carousel
    updateCarousel();
    updateCounter();
    
    // Navigation functions
    function goToSlide(index) {
        // Pause current video if playing
        if (currentVideo && !currentVideo.paused) {
            currentVideo.pause();
        }
        
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Update current index
        currentIndex = index;
        
        // Ensure index is within bounds
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        }
        
        // Update carousel
        updateCarousel();
        updateCounter();
        
        // Set current video
        currentVideo = videos[currentIndex];
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function updateCarousel() {
        if (track && slides.length > 0) {
            const slideWidth = slides[0].offsetWidth;
            const offset = -currentIndex * slideWidth;
            track.style.transform = `translateX(${offset}px)`;
            
            // Add active class to current slide
            slides[currentIndex].classList.add('active');
        }
    }
    
    function updateCounter() {
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${slides.length}`;
        }
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous button clicked');
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked');
            nextSlide();
        });
    }
    
    // Video event listeners - removed play/pause functionality since videos now autoplay
    videos.forEach((video, index) => {
        video.addEventListener('ended', function() {
            video.currentTime = 0;
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (carousel.closest('.portfolio').getBoundingClientRect().top < window.innerHeight && 
            carousel.closest('.portfolio').getBoundingClientRect().bottom > 0) {
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
            }
        }
    });
    
    // Auto-advance carousel (only for mobile)
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
        // Only start auto-advance on mobile devices (768px and below)
        if (window.innerWidth <= 768) {
            autoAdvanceInterval = setInterval(() => {
                nextSlide();
            }, 8000); // Change slide every 8 seconds for more comfortable viewing
        }
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
        }
    }
    
    // Start auto-advance only on mobile
    startAutoAdvance();
    
    // Pause auto-advance on hover (mobile only)
    carousel.addEventListener('mouseenter', stopAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);
    
    // Pause auto-advance when user interacts (mobile only)
    carousel.addEventListener('click', () => {
        stopAutoAdvance();
        setTimeout(startAutoAdvance, 10000); // Resume after 10 seconds
    });
    
    // Handle window resize - restart auto-advance based on screen size
    window.addEventListener('resize', () => {
        updateCarousel();
        stopAutoAdvance();
        startAutoAdvance();
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    let isScrolling = false;
    
    const mobileContainer = document.querySelector('.mobile-phone-container');
    if (mobileContainer) {
        mobileContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        mobileContainer.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const diffX = Math.abs(startX - currentX);
            const diffY = Math.abs(startY - currentY);
            
            // Determine if user is scrolling vertically or swiping horizontally
            if (diffY > diffX) {
                isScrolling = true;
            } else if (diffX > 10) {
                // Prevent vertical scrolling when swiping horizontally
                e.preventDefault();
            }
        }, { passive: false });
        
        mobileContainer.addEventListener('touchend', function(e) {
            if (isScrolling) return; // Don't handle swipe if user was scrolling
            
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    }
    
    // Initialize first slide as active
    goToSlide(0);
}

// Desktop Multi-Phone Marquee
function initializeDesktopMarquee() {
    const desktopMarquee = document.querySelector('.desktop-phone-marquee');
    if (!desktopMarquee) return;
    
    const marqueeTrack = desktopMarquee.querySelector('.marquee-track');
    const phoneContainers = desktopMarquee.querySelectorAll('.phone-container');
    
    if (!marqueeTrack || phoneContainers.length === 0) return;
    
    // Initialize individual videos for each phone
    phoneContainers.forEach((phoneContainer, phoneIndex) => {
        const video = phoneContainer.querySelector('.carousel-video');
        if (video) {
            initializePhoneVideo(video, phoneIndex);
        }
    });
    
    // Intersection Observer to handle video playback based on visibility
    const observerOptions = {
        root: desktopMarquee,
        rootMargin: '0px',
        threshold: 0.5 // Play video when 50% visible
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.carousel-video');
            if (video) {
                if (entry.isIntersecting) {
                    if (video.readyState >= 2) {
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(e => {
                                if (e.name !== 'AbortError') {
                                    console.log('Video play failed:', e);
                                }
                            });
                        }
                    }
                } else {
                    video.pause();
                }
            }
        });
    }, observerOptions);
    
    // Observe all phone containers
    phoneContainers.forEach(container => {
        videoObserver.observe(container);
    });
    
    // Pause/resume marquee animation on hover
    marqueeTrack.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });
    
    marqueeTrack.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
    
    // Click handlers removed - video modal functionality handles clicks now
}

// Individual phone video carousel functionality
function initializePhoneVideo(video, phoneIndex) {
    const phoneContainer = video.closest('.phone-container');
    
    function playVideo() {
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    // Only log if it's not an AbortError (which is expected when rapidly switching)
                    if (e.name !== 'AbortError') {
                        console.log('Video play failed:', e);
                    }
                });
            }
        }
    }
    
    function pauseVideo() {
        video.pause();
    }
    
    // Auto-play when phone comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playVideo();
            } else {
                pauseVideo();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(phoneContainer);
    
    // Click to play/pause
    video.addEventListener('click', function() {
        if (video.paused) {
            playVideo();
        } else {
            pauseVideo();
        }
    });
    
    // Initialize video
    if (phoneIndex === 0) {
        // Auto-play the first video
        playVideo();
    }
}

// Add keyboard navigation styles
const keyboardStyles = document.createElement('style');
keyboardStyles.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--accent-dark) !important;
        outline-offset: 2px !important;
    }
    
    .keyboard-navigation .nav-link:focus::after {
        width: 100%;
    }
`;
document.head.appendChild(keyboardStyles);



// Brand Marquees
function initializeBrandMarquees() {
    const brandMarquees = document.querySelectorAll('.brand-marquee');
    
    brandMarquees.forEach(marquee => {
        const track = marquee.querySelector('.brand-marquee-track');
        if (!track) return;
        
        // Clone items for seamless loop
        const items = track.querySelectorAll('.brand-item');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
        
        // Calculate animation duration based on content width
        const trackWidth = track.scrollWidth;
        const containerWidth = marquee.offsetWidth;
        const duration = Math.max(20, trackWidth / 50); // Minimum 20s, adjust speed as needed
        
        track.style.animationDuration = `${duration}s`;
        
        // Pause on hover
        marquee.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        marquee.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // Handle reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            track.style.animationDuration = '60s'; // Much slower for accessibility
        }
    });
}

// Bubble Animation System
function initializeBubbleAnimation() {
    const canvas = document.getElementById('bubbleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    let animationId;
    let isVisible = true;
    
    // Color palette with new warm earth tone colors
    const colors = [
        'rgba(225, 186, 155, 0.4)',  // primary color
        'rgba(209, 151, 114, 0.4)',  // secondary color
        'rgba(151, 80, 48, 0.4)',    // accent color
        'rgba(240, 208, 184, 0.4)',  // primary light
        'rgba(220, 168, 137, 0.4)',  // secondary light
    ];
    
    // Bubble class with realistic physics
    class Bubble {
        constructor() {
            this.reset();
            this.age = Math.random() * 1000; // Random starting age for variety
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100; // Start below canvas
            this.radius = Math.random() * 25 + 10; // 10-35px radius
            this.baseRadius = this.radius;
            this.vx = (Math.random() - 0.5) * 0.5; // Horizontal drift
            this.vy = -(Math.random() * 0.8 + 0.3); // Upward movement
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.4 + 0.3; // 0.3-0.7 opacity
            this.wobble = Math.random() * 0.02 + 0.01; // Wobble frequency
            this.phase = Math.random() * Math.PI * 2; // Random phase offset
            this.age = 0;
            this.maxAge = Math.random() * 2000 + 3000; // 3-5 seconds lifespan
        }
        
        update() {
            this.age++;
            
            // Natural floating movement with wobble
            this.x += this.vx + Math.sin(this.age * this.wobble + this.phase) * 0.3;
            this.y += this.vy;
            
            // Gentle size variation (breathing effect)
            const breathe = Math.sin(this.age * 0.03) * 0.1;
            this.radius = this.baseRadius * (1 + breathe);
            
            // Slight acceleration upward (buoyancy)
            this.vy *= 0.999;
            
            // Boundary bouncing with energy loss
            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                this.vx *= -0.7; // Energy loss on collision
                this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
            }
            
            // Reset when bubble goes off screen or ages out
            if (this.y + this.radius < -50 || this.age > this.maxAge) {
                this.reset();
            }
            
            // Fade effect based on age
            const ageFactor = Math.min(this.age / 500, 1); // Fade in over first 500ms
            const fadeOut = this.age > this.maxAge * 0.8 ? 
                (this.maxAge - this.age) / (this.maxAge * 0.2) : 1;
            this.currentOpacity = this.opacity * ageFactor * fadeOut;
        }
        
        draw() {
            if (this.currentOpacity <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = this.currentOpacity;
            
            // Create gradient for realistic bubble appearance
            const gradient = ctx.createRadialGradient(
                this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
                this.x, this.y, this.radius
            );
            
            // Parse color and create gradient
            const baseColor = this.color.replace('0.4', '0.6');
            const highlightColor = this.color.replace('0.4', '0.2');
            
            gradient.addColorStop(0, highlightColor);
            gradient.addColorStop(0.7, baseColor);
            gradient.addColorStop(1, this.color);
            
            // Draw bubble
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add subtle highlight
            ctx.beginPath();
            ctx.arc(
                this.x - this.radius * 0.3, 
                this.y - this.radius * 0.3, 
                this.radius * 0.2,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity * 0.3})`;
            ctx.fill();
            
            ctx.restore();
        }
        
        // Check collision with another bubble
        checkCollision(other) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = this.radius + other.radius;
            
            if (distance < minDistance && distance > 0) {
                // Simple elastic collision
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                
                // Rotate velocities
                const vx1 = this.vx * cos + this.vy * sin;
                const vy1 = this.vy * cos - this.vx * sin;
                const vx2 = other.vx * cos + other.vy * sin;
                const vy2 = other.vy * cos - other.vx * sin;
                
                // Exchange velocities (simplified)
                const finalVx1 = vx2 * 0.8; // Energy loss
                const finalVx2 = vx1 * 0.8;
                
                // Rotate back
                this.vx = finalVx1 * cos - vy1 * sin;
                this.vy = vy1 * cos + finalVx1 * sin;
                other.vx = finalVx2 * cos - vy2 * sin;
                other.vy = vy2 * cos + finalVx2 * sin;
                
                // Separate bubbles
                const overlap = minDistance - distance;
                const separationX = (dx / distance) * overlap * 0.5;
                const separationY = (dy / distance) * overlap * 0.5;
                
                this.x += separationX;
                this.y += separationY;
                other.x -= separationX;
                other.y -= separationY;
            }
        }
    }
    
    // Resize canvas to match container
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    // Initialize bubbles
    function createBubbles() {
        bubbles = [];
        
        // Enhanced mobile bubble count
        const isMobile = window.innerWidth <= 1000;
        let bubbleCount;
        
        if (isMobile) {
            // More bubbles on mobile for richer experience
            bubbleCount = Math.min(Math.floor(canvas.width / 25), 25);
        } else {
            // Standard count for desktop/tablet
            bubbleCount = Math.min(Math.floor(canvas.width / 50), 30);
        }
        
        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push(new Bubble());
        }
    }
    
    // Animation loop
    function animate() {
        if (!isVisible) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw bubbles
        bubbles.forEach((bubble, index) => {
            bubble.update();
            bubble.draw();
            
            // Check collisions with other bubbles
            for (let j = index + 1; j < bubbles.length; j++) {
                bubble.checkCollision(bubbles[j]);
            }
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    createBubbles();
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createBubbles();
    });
    
    // Pause animation when page is not visible (performance optimization)
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Reduce bubble count and movement for accessibility
        bubbles = bubbles.slice(0, Math.floor(bubbles.length / 2));
        bubbles.forEach(bubble => {
            bubble.vx *= 0.3;
            bubble.vy *= 0.3;
            bubble.wobble *= 0.3;
        });
    }
}

// Video Modal Functionality with Navigation
function initializeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalClose = document.querySelector('.video-modal-close');
    const modalOverlay = document.querySelector('.video-modal-overlay');
    const prevBtn = document.getElementById('prevVideoBtn');
    const nextBtn = document.getElementById('nextVideoBtn');
    const currentVideoIndex = document.getElementById('currentVideoIndex');
    const totalVideos = document.getElementById('totalVideos');
    
    if (!modal || !modalVideo || !modalClose || !modalOverlay) {
        console.warn('Video modal elements not found');
        return;
    }
    
    // Video management
    let videoList = [];
    let currentIndex = 0;
    
    // Function to collect all videos (limit to 5)
    function collectVideos() {
        const videoData = [];
        for (let i = 1; i <= 5; i++) {
            videoData.push({
                src: `${window.location.origin}/Videos/${i}.mp4`,
                title: ``
            });
        }
        return videoData;
    }
    
    // Function to update video counter
    function updateVideoCounter() {
        if (currentVideoIndex && totalVideos) {
            currentVideoIndex.textContent = currentIndex + 1;
            totalVideos.textContent = videoList.length;
        }
    }
    
    // Function to load video at specific index
    function loadVideo(index) {
        if (index < 0 || index >= videoList.length) return;
        
        currentIndex = index;
        const video = videoList[currentIndex];
        
        // Set video source
        const videoSource = modalVideo.querySelector('source');
        if (videoSource) {
            videoSource.src = video.src;
            modalVideo.load(); // Reload video with new source
        }
        
        // Update counter
        updateVideoCounter();
        
        // Update navigation button states
        updateNavigationButtons();
        
        // Update video title if available
        const videoTitle = document.getElementById('videoTitle');
        if (videoTitle) {
            videoTitle.textContent = video.title || '';
        }
    }
    
    // Function to update navigation button states
    function updateNavigationButtons() {
        if (prevBtn) {
            prevBtn.style.opacity = currentIndex > 0 ? '0.8' : '0.3';
            prevBtn.disabled = currentIndex <= 0;
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentIndex < videoList.length - 1 ? '0.8' : '0.3';
            nextBtn.disabled = currentIndex >= videoList.length - 1;
        }
    }
    
    // Function to open modal with video
    function openModal(videoSrc) {
        if (!videoSrc) return;
        
        // Refresh video list
        videoList = collectVideos();
        
        // Find the index of the clicked video
        const videoIndex = videoList.findIndex(video => video.src === videoSrc);
        if (videoIndex !== -1) {
            currentIndex = videoIndex;
        } else {
            currentIndex = 0;
        }
        
        // Load the video
        loadVideo(currentIndex);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus on close button for accessibility
        modalClose.focus();
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Pause and reset video
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }
    
    // Navigation functions
    function showPreviousVideo() {
        if (currentIndex > 0) {
            loadVideo(currentIndex - 1);
        }
    }
    
    function showNextVideo() {
        if (currentIndex < videoList.length - 1) {
            loadVideo(currentIndex + 1);
        }
    }
    
    // Add click handlers using event delegation
    function addVideoClickHandlers() {
        // Use event delegation on the portfolio section
        const portfolioSection = document.getElementById('portfolio');
        if (!portfolioSection) {
            return;
        }
        
        // Remove existing event listener to avoid duplicates
        portfolioSection.removeEventListener('click', handlePortfolioClick);
        
        // Add event delegation listener
        portfolioSection.addEventListener('click', handlePortfolioClick);
        
        // Also add visual indicators to make videos look clickable
        const allVideos = portfolioSection.querySelectorAll('.carousel-video');
        
        allVideos.forEach((video, index) => {
            // Find the appropriate clickable container
            const phoneContainer = video.closest('.phone-container');
            const videoSlide = video.closest('.video-slide');
            const phoneScreen = video.closest('.phone-screen');
            
            // Apply cursor and title to the most appropriate container
            const clickableContainer = phoneContainer || videoSlide || phoneScreen || video.parentElement;
            if (clickableContainer) {
                clickableContainer.style.cursor = 'pointer';
                clickableContainer.setAttribute('title', 'Click to view in full screen');
            }
        });
    }
    
    // Handle clicks within the portfolio section
    function handlePortfolioClick(event) {
        // Find the closest video element - check multiple possible structures
        let video = null;
        
        // First, check if we clicked directly on a video
        if (event.target.classList.contains('carousel-video')) {
            video = event.target;
        }
        // Then check if we clicked on a phone container and find video inside
        else if (event.target.closest('.phone-container')) {
            video = event.target.closest('.phone-container').querySelector('.carousel-video');
        }
        // Check if we clicked on a video slide
        else if (event.target.closest('.video-slide')) {
            video = event.target.closest('.video-slide').querySelector('.carousel-video');
        }
        // Check if we clicked on phone screen
        else if (event.target.closest('.phone-screen')) {
            video = event.target.closest('.phone-screen').querySelector('.carousel-video');
        }
        
        if (video) {
            // Get video source - check both src attribute and source tags
            let videoSrc = video.src || video.currentSrc;
            if (!videoSrc) {
                const sourceTag = video.querySelector('source');
                if (sourceTag) {
                    videoSrc = sourceTag.src;
                }
            }
            
            // Convert relative URLs to work with current server
            if (videoSrc && videoSrc.startsWith('Videos/')) {
                videoSrc = window.location.origin + '/' + videoSrc;
            }
            
            if (videoSrc) {
                event.preventDefault();
                event.stopPropagation();
                openModal(videoSrc);
            }
        }
    }
    
    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Navigation button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreviousVideo();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextVideo();
        });
    }
    
    // Keyboard support
    document.addEventListener('keydown', (event) => {
        if (modal.classList.contains('active')) {
            switch(event.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    showPreviousVideo();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    showNextVideo();
                    break;
            }
        }
    });
    
    // Prevent modal content clicks from closing modal
    document.querySelector('.video-modal-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });
    
    // Initialize video click handlers
    addVideoClickHandlers();
    
    // Re-initialize handlers when carousel changes (for dynamic content)
    const observer = new MutationObserver(() => {
        addVideoClickHandlers();
    });
    
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        observer.observe(portfolioSection, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize video modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all other scripts have finished
    setTimeout(() => {
        initializeVideoModal();
    }, 100);
});

// Fallback initialization on window load
window.addEventListener('load', () => {
    setTimeout(() => {
        initializeVideoModal();
    }, 200);
});

// Active Navigation Highlighting
function initializeActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    
    function updateActiveNavigation() {
        let currentSection = '';
        
        // Dynamically calculate navbar height and appropriate offset
        const navbarHeight = navbar ? navbar.offsetHeight : 60;
        const scrollOffset = navbarHeight + 10; // Smaller buffer for more accurate detection
        const scrollPosition = window.scrollY + scrollOffset;
        
        // Special handling for the very top of the page (home section)
        if (window.scrollY <= 100) {
            currentSection = 'home';
        } else {
            // Find the current section by checking which section's top is closest to current scroll position
            let closestSection = '';
            let closestDistance = Infinity;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;
                
                // Check if we're within this section
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.getAttribute('id');
                    return; // Found exact match, use it
                }
                
                // Also track the closest section in case we're between sections
                const distanceFromTop = Math.abs(scrollPosition - sectionTop);
                if (distanceFromTop < closestDistance) {
                    closestDistance = distanceFromTop;
                    closestSection = section.getAttribute('id');
                }
            });
            
            // If no exact section match found, use the closest one
            if (!currentSection && closestSection) {
                currentSection = closestSection;
            }
        }
        
        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial check
    updateActiveNavigation();
    
    // Listen for scroll events with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Active navigation will be initialized within the main navigation function