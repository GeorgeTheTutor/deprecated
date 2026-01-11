document.addEventListener('DOMContentLoaded', function() {
    initializeRecordingsPage();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Recordings',
            page_location: window.location.href
        });
    }
});

function initializeRecordingsPage() {
    initializeVideoSwitching();
    
    addScrollAnimations();
    
    trackVideoInteractions();
    
    addKeyboardNavigation();

    initializeParticles();
    
    setupSidebarVideoPreviews();
}

function setupSidebarVideoPreviews() {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const videoPreview = item.querySelector('.sidebar-video-preview');
        
        if (videoPreview) {
            item.addEventListener('mouseenter', () => {
                videoPreview.play().catch(() => {});
            });
            
            item.addEventListener('mouseleave', () => {
                videoPreview.pause();
                videoPreview.currentTime = 0;
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && window.innerWidth <= 768) {
                        videoPreview.play().catch(() => {});
                    } else {
                        videoPreview.pause();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        }
    });
}

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        observer.observe(item);
    });
}

function initializeVideoSwitching() {
    const videoItems = document.querySelectorAll('.video-item');
    const mainVideoFrame = document.getElementById('mainVideoFrame');
    const mainVideoTitle = document.getElementById('mainVideoTitle');
    const mainVideoDescription = document.getElementById('mainVideoDescription');
    const mainVideoDuration = document.getElementById('mainVideoDuration');
    const mainVideoInstructors = document.getElementById('mainVideoInstructors');
    
    videoItems.forEach(item => {
        item.addEventListener('click', function() {
            videoItems.forEach(v => v.classList.remove('active'));
            
            this.classList.add('active');
            
            const videoUrl = this.getAttribute('data-video-url');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const duration = this.getAttribute('data-duration');
            const instructors = this.getAttribute('data-instructors');
            
            const source = mainVideoFrame.querySelector('source');
            source.src = videoUrl;
            mainVideoFrame.load();
            
            mainVideoTitle.textContent = title;
            mainVideoDescription.textContent = description;
            mainVideoDuration.innerHTML = `<i class="fas fa-clock"></i> ${duration}`;
            if (mainVideoInstructors) {
                mainVideoInstructors.innerHTML = `<i class="fas fa-user"></i> ${instructors}`;
            }
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_switch', {
                    event_category: 'recordings',
                    event_label: title,
                    value: 1
                });
            }
            
            if (window.innerWidth <= 1024) {
                document.querySelector('.main-video-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            console.log(`Switched to video: ${title}`);
        });
    });
}

function trackVideoInteractions() {
    const mainVideoFrame = document.getElementById('mainVideoFrame');
    
    mainVideoFrame.addEventListener('load', function() {
        const currentTitle = document.getElementById('mainVideoTitle').textContent;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_load', {
                event_category: 'recordings',
                event_label: currentTitle,
                value: 1
            });
        }
        
        console.log(`Video loaded: ${currentTitle}`);
    });
}

function initializeLazyLoading() {
    const thumbnails = document.querySelectorAll('.recording-thumbnail');
    
    const thumbnailObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                thumbnailObserver.unobserve(entry.target);
            }
        });
    });

    thumbnails.forEach(thumbnail => {
        thumbnailObserver.observe(thumbnail);
    });
}

function addKeyboardNavigation() {
    const videoItems = document.querySelectorAll('.video-item');
    let currentFocus = -1;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            if (e.key === 'ArrowDown') {
                currentFocus = (currentFocus + 1) % videoItems.length;
            } else {
                currentFocus = currentFocus <= 0 ? videoItems.length - 1 : currentFocus - 1;
            }
            
            videoItems[currentFocus].focus();
            videoItems[currentFocus].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        if (e.key === 'Enter' && currentFocus >= 0) {
            videoItems[currentFocus].click();
        }
    });

    videoItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('focus', () => {
            currentFocus = index;
        });
        
        item.addEventListener('focus', function() {
            this.style.outline = `2px solid var(--primary_dark)`;
        });
        
        item.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recordingCards = document.querySelectorAll('.recording-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            recordingCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const recordingCards = document.querySelectorAll('.recording-card');
        
        recordingCards.forEach(card => {
            const title = card.querySelector('.recording-title').textContent.toLowerCase();
            const description = card.querySelector('.recording-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const recordingCards = document.querySelectorAll('.recording-card');
    
    recordingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

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

const smoothScrollToCard = debounce(function(cardIndex) {
    const card = document.querySelectorAll('.recording-card')[cardIndex];
    if (card) {
        card.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}, 100);

function initializeAutoPlay() {
    const mainVideoFrame = document.getElementById('mainVideoFrame');
    const videoItems = document.querySelectorAll('.video-item');
    
    function playNextVideo() {
        const activeItem = document.querySelector('.video-item.active');
        const activeIndex = Array.from(videoItems).indexOf(activeItem);
        const nextIndex = (activeIndex + 1) % videoItems.length;
        
        if (nextIndex !== activeIndex) {
            videoItems[nextIndex].click();
        }
    }
    
}

function initializeErrorHandling() {
    const mainVideoFrame = document.getElementById('mainVideoFrame');
    
    mainVideoFrame.addEventListener('error', function() {
        console.log('Main video failed to load');
        
        const errorOverlay = document.createElement('div');
        errorOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--dark);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            flex-direction: column;
            gap: 1rem;
            border-radius: 12px;
        `;
        errorOverlay.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary_dark);"></i>
            <p>Video temporarily unavailable</p>
        `;
        
        this.parentNode.appendChild(errorOverlay);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeErrorHandling();
});

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getVideoThumbnail(videoId) {
    return `https://drive.google.com/thumbnail?id=${videoId}&sz=w320`;
}

function initializeParticles() {
    if (typeof tsParticles === 'undefined') return;

    const particleColors = ['#FFFFFF', '#FF0000', '#F5F5DC', '#EEDC82', '#DEB887'];
    const linkColor = '#f81f01';
    
    tsParticles.load("tsparticles", {
        fullScreen: { enable: false },
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
                resize: true
            },
            modes: {
                push: { quantity: 4 },
                repulse: { distance: 150, duration: 0.6 }
            }
        },
        particles: {
            number: { 
                value: 120,
                density: { enable: true, value_area: 800 } 
            },
            color: { value: particleColors },
            shape: { type: "circle" },
            opacity: { 
                value: 0.6,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.3
                }
            },
            size: { 
                value: 4,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 2
                }
            },
            links: { 
                enable: true, 
                distance: 150, 
                color: linkColor,
                opacity: 0.4, 
                width: 1.5
            },
            move: {
                enable: true,
                speed: 1,
                outModes: { default: "out" }
            }
        },
        detectRetina: true
    });
}
