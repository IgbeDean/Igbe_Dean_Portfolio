document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // PRECISE 3-SECOND PRELOADER WITH TRIGGER
    // ==========================================
    window.addEventListener('load', () => {
        const preloader = document.getElementById('game-preloader');
        const progressFill = document.getElementById('loader-progress-fill');
        const percentageNum = document.getElementById('loader-percentage-num');
        const homeSection = document.getElementById('home'); 

        let progress = 0;
        const totalDuration = 3000; 
        const intervalTime = 30;    
        const totalTicks = totalDuration / intervalTime; 
        const increment = 100 / totalTicks;             
        
        const loaderInterval = setInterval(() => {
            progress += increment;
            
            const currentPercent = Math.min(Math.floor(progress), 100);
            
            progressFill.style.width = `${currentPercent}%`;
            percentageNum.innerText = `${String(currentPercent).padStart(2, '0')}%`;
            
            if (progress >= 100) {
                clearInterval(loaderInterval);
                
                // 1. Initiate the CSS fade out of the loader screen
                preloader.classList.add('fade-out');
                
                // 2. TRIGGER HOME ANIMATIONS & TYPEWRITER exactly as loader vanishes
                if (homeSection) {
                    homeSection.classList.add('start-animations');
                }
                
                // Fire up typing sequence engine now that layout is visible
                typingEffect();
                
                // 3. Completely drop the loader layout layer
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600); 
            }
        }, intervalTime); 
    });
            
    // ==========================================
    // A. TYPEWRITER EFFECT (REFACTORED)
    // ==========================================
    const words = ["Backend Engineer", "Django Developer", "Python Developer", "Full Stack Specialist"];
    let i = 0;
    let timer;

    function typingEffect() {
        const typewriterEl = document.getElementById('typewriter');
        if (!typewriterEl) return; 
        
        let wordChars = words[i].split("");
        
        const loopTyping = function() {
            if (wordChars.length > 0) {
                typewriterEl.innerHTML += wordChars.shift();
                timer = setTimeout(loopTyping, 100);
            } else {
                setTimeout(deletingEffect, 2000);
            }
        };
        loopTyping();
    }

    function deletingEffect() {
        const typewriterEl = document.getElementById('typewriter');
        if (!typewriterEl) return;

        let wordChars = words[i].split("");
        
        const loopDeleting = function() {
            if (wordChars.length > 0) {
                wordChars.pop();
                typewriterEl.innerHTML = wordChars.join("");
                timer = setTimeout(loopDeleting, 60);
            } else {
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                setTimeout(typingEffect, 500);
            }
        };
        loopDeleting();
    }


    // ==========================================
    // B. NAVBAR DYNAMIC TRANSPARENCY ON SCROLL
    // ==========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }


    // ==========================================
    // C. UNIFIED SCROLL SPY & REVEAL ENGINE
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const spyOptions = {
        root: null,
        rootMargin: '-10% 0px -20% 0px', // Forgiving margins so top/bottom edge sections trigger reliably
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        // Skip updates if a click-scroll animation is currently in transit
        if (typeof isClickScrolling !== 'undefined' && isClickScrolling) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // 1. NAVIGATION ACTIVE LINK TOGGLER
                navLinks.forEach(link => link.classList.remove('active'));
                const targetLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
                if (targetLink) targetLink.classList.add('active');

                // 2. ENTRANCE ANIMATION TRIGGER (Only for lower sections)
                if (entry.target.classList.contains('reveal-on-scroll')) {
                    entry.target.classList.add('is-visible');
                }
            }
        });
    }, spyOptions);

    sections.forEach(section => spyObserver.observe(section));


    // D. UNIVERSAL SECTION SMOOTH FADE-IN REVEAL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealOptions = {
        root: null,
        rootMargin: '-80px 0px', 
        threshold: 0.10          
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(element => revealObserver.observe(element));


    // ==========================================
    // E. STAGGERED SKILLS PROGRESS BARS FILL
    // ==========================================
    const skillsSection = document.getElementById('skills');
    const progressLines = document.querySelectorAll('.progress-line');

    const skillsOptions = {
        root: null,
        threshold: 0.15
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressLines.forEach((line, index) => {
                    setTimeout(() => {
                        const targetWidth = line.getAttribute('data-progress');
                        line.style.width = targetWidth;
                    }, index * 150); 
                });
                observer.unobserve(entry.target);
            }
        });
    }, skillsOptions);

    if (skillsSection) skillsObserver.observe(skillsSection);


    // ==========================================
    // F. AUTOMATIC TOAST DISMISSAL SCHEDULER
    // ==========================================
    const activeToasts = document.querySelectorAll('#toast-notification-container .toast-card');
    
    activeToasts.forEach((toast) => {
        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    });
});


// ==========================================================================
// SECTION-BY-SECTION FLUID GLIDE SCROLL ENGINE
// ==========================================================================

// Custom Easing Function: cubic ease-in-out for a smooth start and gentle deceleration
function easeInOutCubic(t) {
    return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothGlideTo(targetPosition, duration) {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Temporarily pause scroll observers during manual glide animation
    if (typeof isClickScrolling !== 'undefined') {
        isClickScrolling = true;
    }

    function animationStep(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Calculate the eased position for the current animation frame
        const easeProgress = easeInOutCubic(progress);
        const currentScrollPosition = startPosition + (distance * easeProgress);

        // Frame-by-frame scroll update
        window.scrollTo(0, currentScrollPosition);

        if (timeElapsed < duration) {
            // Request the next animation frame to keep motion uninterrupted
            requestAnimationFrame(animationStep);
        } else {
            // Ensure exact landing on the final pixel target
            window.scrollTo(0, targetPosition);
            
            // Re-enable scroll spy after animation finishes
            if (typeof isClickScrolling !== 'undefined') {
                isClickScrolling = false;
            }
        }
    }

    requestAnimationFrame(animationStep);
}

// Attach the custom fluid glide engine to all internal navigation links & back-to-top button
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();

            // Calculate exact position taking fixed navbar offset into account
            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            const startPosition = window.pageYOffset || document.documentElement.scrollTop;
            const distance = Math.abs(targetPosition - startPosition);

            // Calculate duration based on distance to ensure a consistent, visible travel speed
            // Base time 800ms + proportional distance scaling (max 1800ms for full-page traversal)
            const duration = Math.min(Math.max(800, distance * 0.45), 1800);

            smoothGlideTo(targetPosition, duration);
        }
    });
});



// ==========================================
// CV DOWNLOAD DROPDOWN CLICK HANDLER
// ==========================================
const cvDropdown = document.getElementById('cvDropdown');
const cvToggleBtn = document.getElementById('cvToggleBtn');

if (cvDropdown && cvToggleBtn) {
    cvToggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cvDropdown.classList.toggle('is-open');
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function(e) {
        if (!cvDropdown.contains(e.target)) {
            cvDropdown.classList.remove('is-open');
        }
    });
}