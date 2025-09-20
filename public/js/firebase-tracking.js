function initializeAnalytics() {
    const waitForAnalytics = () => {
        if (window.analyticsService && window.analyticsService.isInitialized) {
            setupAnalyticsTracking();
        } else {
            setTimeout(waitForAnalytics, 100);
        }
    };
    waitForAnalytics();
}

function setupAnalyticsTracking() {
    const analytics = window.analyticsService;
    
    analytics.trackPageView('home_page', 'GeorgeTheTutor - Homepage');
    
    analytics.getAndTrackLocation();
    
    document.querySelectorAll('nav a, .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const linkText = link.textContent.trim();
            const href = link.getAttribute('href');
            analytics.trackButtonClick(`nav_${linkText.toLowerCase().replace(/\s+/g, '_')}`, 'navigation');
        });
    });
    
    const ham = document.querySelector('.ham');
    const closeBtn = document.querySelector('.close');
    
    if (ham) {
        ham.addEventListener('click', () => {
            analytics.trackButtonClick('mobile_menu_open', 'navigation');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            analytics.trackButtonClick('mobile_menu_close', 'navigation');
        });
    }
    
    let maxScrollDepth = 0;
    let scrollDepthMarkers = [25, 50, 75, 90, 100];
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
        
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            scrollDepthMarkers.forEach(marker => {
                if (scrollPercent >= marker && maxScrollDepth < marker + 5) {
                    analytics.trackScrollDepth(marker);
                }
            });
        }
    });
    
    document.querySelectorAll('[href*="whatsapp"], [href*="tel:"], [href*="mailto:"], [href*="reddit.com"], [href*="discord.com"]').forEach(button => {
        button.addEventListener('click', () => {
            const href = button.getAttribute('href');
            let contactMethod = 'unknown';
            
            if (href.includes('whatsapp')) contactMethod = 'whatsapp';
            else if (href.includes('tel:')) contactMethod = 'phone';
            else if (href.includes('mailto:')) contactMethod = 'email';
            else if (href.includes('reddit.com')) contactMethod = 'reddit';
            else if (href.includes('discord.com')) contactMethod = 'discord';
            
            analytics.trackContactAttempt(contactMethod, {
                button_text: button.textContent.trim(),
                button_location: getElementSection(button),
                contact_url: href
            });
        });
    });
    
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3')?.textContent || 'Unknown';
            analytics.trackEngagement('testimonial_view', {
                testimonial_title: title,
                testimonial_index: index
            });
        });
    });
    
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            analytics.trackButtonClick('back_to_top', 'navigation');
        });
    }
    
    let pageLoadTime = Date.now();
    let isPageVisible = true;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isPageVisible) {
                const timeOnPage = Date.now() - pageLoadTime;
                analytics.trackEngagement('page_hidden', {
                    time_on_page: timeOnPage,
                    page_path: window.location.pathname
                });
                isPageVisible = false;
            }
        } else {
            if (!isPageVisible) {
                analytics.trackEngagement('page_visible', {
                    page_path: window.location.pathname
                });
                pageLoadTime = Date.now();
                isPageVisible = true;
            }
        }
    });
    
    window.addEventListener('error', (event) => {
        analytics.trackError(event.error || event.message, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });
    
    console.log('Firebase Analytics tracking initialized');
}

function getElementSection(element) {
    const sections = ['hero', 'about', 'services', 'testimonials', 'contact', 'footer'];
    
    for (let section of sections) {
        const sectionElement = document.getElementById(section) || document.querySelector(`.${section}`);
        if (sectionElement && sectionElement.contains(element)) {
            return section;
        }
    }
    
    return 'unknown';
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
});