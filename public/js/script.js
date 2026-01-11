const ham = document.querySelector('.ham');
const menuEl = document.getElementById('menu');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.close');
ham.addEventListener('click', function () {
    menuEl.style.right = "0";
    overlay.style.zIndex = "998";
    overlay.style.opacity = "0.7";
});
closeBtn.addEventListener('click', function () {
    menuEl.style.right = "-400px";
    overlay.style.opacity = "0";
    overlay.style.zIndex = "-1";
});
overlay.addEventListener('click', function () {
    menuEl.style.right = "-400px";
    overlay.style.opacity = "0";
    overlay.style.zIndex = "-1";
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            if (menuEl.style.right === "0") {
                menuEl.style.right = "-400px";
                overlay.style.opacity = "0";
                overlay.style.zIndex = "-1";
            }
        }
    });
});
const navbar = document.querySelector('nav');
const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY === 0) {
        navbar.style.display = 'flex';
    } else {
        navbar.style.display = 'none';
    }
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});
backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
const faqItems = document.querySelectorAll('.faq-item');
function closeAllFaqs(exceptThis) {
    faqItems.forEach(item => {
        if (item !== exceptThis && item.classList.contains('active')) {
            toggleFaq(item, false);
        }
    });
}
function toggleFaq(faqItem, show = null) {
    const isActive = show !== null ? show : !faqItem.classList.contains('active');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');
    if (isActive) {
        faqItem.classList.add('active');
        faqItem.setAttribute('aria-expanded', 'true');
        answer.style.display = 'block';
        requestAnimationFrame(() => {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.transform = 'scaleY(1)';
            icon.style.transform = 'translateY(-50%) rotate(180deg)';
        });
    } else {
        faqItem.classList.remove('active');
        faqItem.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        answer.style.transform = 'scaleY(0)';
        icon.style.transform = 'translateY(-50%) rotate(0)';
        setTimeout(() => {
            if (!faqItem.classList.contains('active')) {
                answer.style.display = 'none';
            }
        }, 400);
    }
}
faqItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.closest('.faq-answer')) return;
        closeAllFaqs(item);
        toggleFaq(item);
    });
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeAllFaqs(item);
            toggleFaq(item);
        }
    });
    item.addEventListener('touchend', (e) => {
        if (e.target.closest('.faq-answer')) return;
        e.preventDefault();
        closeAllFaqs(item);
        toggleFaq(item);
    });
});
faqItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
            item.style.transform = 'translateY(-5px)';
        }
    });
    item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
            item.style.transform = 'translateY(0)';
        }
    });
});
const innerCursor = document.querySelector('.custom-cursor.inner');
const outerCursor = document.querySelector('.custom-cursor.outer');
let mouseX = 0;
let mouseY = 0;
let outerX = 0;
let outerY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  innerCursor.style.left = `${mouseX}px`;
  innerCursor.style.top = `${mouseY}px`;
});
function animateOuterCursor() {
  outerX += (mouseX - outerX) / 8;
  outerY += (mouseY - outerY) / 8;
  outerCursor.style.left = `${outerX}px`;
  outerCursor.style.top = `${outerY}px`;
  requestAnimationFrame(animateOuterCursor);
}
animateOuterCursor();
document.addEventListener('DOMContentLoaded', () => {
  const loadingOverlay = document.querySelector('.loading-overlay');
  
  if (sessionStorage.getItem('siteLoaded')) {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }

  const progressFill = document.querySelector('.loading-progress-fill');
  const percentageText = document.querySelector('.loading-percentage');
  
  if (loadingOverlay && progressFill && percentageText && !sessionStorage.getItem('siteLoaded')) {
    let progress = 0;
    const duration = 2000;
    const interval = 50;
    const increment = (interval / duration) * 100;
    
    const progressInterval = setInterval(() => {
      const easeOutProgress = 1 - Math.pow(1 - (progress / 100), 3);
      const actualProgress = Math.min(easeOutProgress * 100, 95);
      
      progressFill.style.width = actualProgress + '%';
      percentageText.textContent = Math.floor(actualProgress) + '%';
      
      progress += increment;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        setTimeout(() => {
          progressFill.style.width = '100%';
          percentageText.textContent = '100%';
          
          setTimeout(() => {
            loadingOverlay.classList.add('loading-hidden');
            sessionStorage.setItem('siteLoaded', 'true');
            setTimeout(() => {
              loadingOverlay.style.display = 'none';
            }, 800);
          }, 500);
        }, 200);
      }
    }, interval);
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (!loadingOverlay.classList.contains('loading-hidden')) {
          clearInterval(progressInterval);
          progressFill.style.width = '100%';
          percentageText.textContent = '100%';
          
          setTimeout(() => {
            loadingOverlay.classList.add('loading-hidden');
            setTimeout(() => {
              loadingOverlay.style.display = 'none';
            }, 800);
          }, 300);
        }
      }, 2000);
    });
  }
  function initializeParticles(particleColors, linkColor) {
    tsParticles.load("particles-js", {
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
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const particleColors = ['#FFFFFF', '#FF0000', '#F5F5DC', '#EEDC82', '#DEB887'];
  const linkColorDark = '#f81f01';
  const linkColorLight = '#C0A080';
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light');
  applyTheme(savedTheme);
  if (savedTheme === 'dark') {
    initializeParticles(particleColors, linkColorDark);
  } else {
    initializeParticles(particleColors, linkColorLight);
  }
  function applyTheme(theme) {
    if (theme === 'light') {
      htmlElement.classList.add('light-mode');
    } else {
      htmlElement.classList.remove('light-mode');
    }
  }
  function updateThemeIcon() {
    if (!themeToggle) return;
    if (htmlElement.classList.contains('light-mode')) {
      themeToggle.textContent = '☀️';
    } else {
      themeToggle.textContent = '🌙';
    }
  }
  updateThemeIcon();
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('light-mode');
    const newTheme = htmlElement.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    if (tsParticles.dom.length > 0) {
      tsParticles.dom.forEach(particle => particle.destroy());
    }
    const currentLinkColor = newTheme === 'dark' ? linkColorDark : linkColorLight;
    initializeParticles(particleColors, currentLinkColor);
  });
  }
  const aboutContent = document.querySelector('.about-content');
  if (aboutContent) {
    aboutContent.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = aboutContent.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        aboutContent.style.transform = `
            perspective(1000px)
            rotateY(${x * 5}deg)
            rotateX(${y * -5}deg)
            translateZ(10px)
        `;
    });
    aboutContent.addEventListener('mouseleave', () => {
        aboutContent.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
    });
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const statSection = document.querySelector('.stats-showcase');
  if (statSection && statNumbers.length > 0) {
      const statObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  animateStatsNew();
                  statObserver.unobserve(statSection);
              }
          });
      }, { threshold: 0.5 });
      statObserver.observe(statSection);
  }

  function animateStatsNew() {
      statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          const originalText = stat.textContent;
          let suffix = '';
          
          if (originalText.includes('+')) {
              suffix = '+';
          } else if (originalText.includes('h/7')) {
              suffix = 'h/7';
          } else if (originalText.includes('/7')) {
              suffix = '/7';
          }
          
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const updateCounter = () => {
              current += step;
              if (current < target) {
                  stat.textContent = Math.floor(current) + suffix;
                  requestAnimationFrame(updateCounter);
              } else {
                  stat.textContent = target + suffix;
              }
          };
          updateCounter();
      });
  }
});
const testimonialCarousel = document.querySelector('.testimonial-carousel');
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonialIndex = 0;
let testimonialInterval;
function initTestimonialSlider() {
    if (testimonialCarousel && testimonialCards.length > 0) {
        for (let i = 0; i < Math.min(3, testimonialCards.length); i++) {
            const clone = testimonialCards[i].cloneNode(true);
            testimonialCarousel.appendChild(clone);
        }
        startTestimonialSlider();
    }
}
function startTestimonialSlider() {
    testimonialInterval = setInterval(() => {
        currentTestimonialIndex++;
        updateTestimonialSlider();
    }, 5000);
}
function stopTestimonialSlider() {
    clearInterval(testimonialInterval);
}
function updateTestimonialSlider() {
    const cardWidth = testimonialCards[0].offsetWidth + 24;
    testimonialCarousel.style.transform = `translateX(-${currentTestimonialIndex * cardWidth}px)`;
    if (currentTestimonialIndex >= testimonialCards.length) {
        setTimeout(() => {
            testimonialCarousel.style.transition = 'none';
            currentTestimonialIndex = 0;
            testimonialCarousel.style.transform = `translateX(0px)`;
            setTimeout(() => {
                testimonialCarousel.style.transition = 'transform 0.5s ease';
            }, 50);
        }, 500);
    }
}
const modal = document.getElementById('testimonialModal');
if (modal) {
  const modalContent = modal.querySelector('.modal-content');
  const modalClose = modal.querySelector('.modal-close');
  const modalOverlay = modal.querySelector('.modal-overlay');
  const body = document.body;
  document.querySelectorAll('.testimonial-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        stopTestimonialSlider();
        const title = card.querySelector('h3').textContent;
        const quote = card.querySelector('blockquote').innerHTML;
        const author = card.querySelector('cite').textContent;
        modalContent.querySelector('h3').textContent = title;
        modalContent.querySelector('blockquote').innerHTML = quote;
        modalContent.querySelector('cite').textContent = author;
        body.style.overflow = 'hidden';
        modal.classList.add('active');
        modalContent.focus();
    });
});
const closeModal = () => {
    modal.classList.remove('active');
    body.style.overflow = '';
    startTestimonialSlider();
};
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});
modalContent.addEventListener('click', (e) => {
    e.stopPropagation();
});
}
document.addEventListener('DOMContentLoaded', () => {
    initTestimonialSlider();
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const originalCards = Array.from(document.querySelectorAll('.carousel-card'));
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');
    const carouselSection = document.querySelector('.masterclass-carousel-section');
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (!track || originalCards.length === 0) return;
    
    let currentIndex = 0;
    let cardsPerView = 3;
    let isAnimating = false;
    let autoScrollInterval;
    let observers = [];
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    
    function setupInfiniteScroll() {
        track.querySelectorAll('.carousel-card-clone').forEach(el => el.remove());
        
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('carousel-card-clone');
            track.appendChild(clone);
        });
        
        for (let i = originalCards.length - 1; i >= 0; i--) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('carousel-card-clone');
            track.insertBefore(clone, track.firstChild);
        }
        
        setupVideoPreviewHover();
    }
    
    function setupVideoPreviewHover() {
        const allCards = document.querySelectorAll('.carousel-card, .carousel-card-clone');
        
        observers.forEach(observer => observer.disconnect());
        observers = [];
        
        allCards.forEach(card => {
            const video = card.querySelector('.carousel-video-preview');
            if (video) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !isDragging) {
                            video.play().catch(() => {});
                        } else {
                            video.pause();
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(card);
                observers.push(observer);
                
                if (window.innerWidth > 768) {
                    card.addEventListener('mouseenter', () => {
                        video.play().catch(() => {});
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        if (!isCardInView(card)) {
                            video.pause();
                        }
                    });
                }
            }
        });
    }
    
    function isCardInView(card) {
        const rect = card.getBoundingClientRect();
        const containerRect = track.parentElement.getBoundingClientRect();
        return rect.left >= containerRect.left && rect.right <= containerRect.right;
    }
    
    function updateCardsPerView() {
        if (window.innerWidth <= 768) {
            cardsPerView = 1;
        } else if (window.innerWidth <= 1200) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
    }
    
    function getCardWidth() {
        const card = originalCards[0];
        const gap = window.innerWidth <= 480 ? 16 : window.innerWidth <= 768 ? 20 : 32;
        return card.offsetWidth + gap;
    }
    
    function updateCarousel(smooth = true) {
        const cardWidth = getCardWidth();
        const offset = -(currentIndex + originalCards.length) * cardWidth;
        
        if (smooth) {
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(${offset}px)`;
        
        const dotIndex = ((currentIndex % originalCards.length) + originalCards.length) % originalCards.length;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }
    
    function handleTransitionEnd() {
        if (currentIndex >= originalCards.length) {
            currentIndex = 0;
            updateCarousel(false);
        } else if (currentIndex < 0) {
            currentIndex = originalCards.length - 1;
            updateCarousel(false);
        }
        isAnimating = false;
    }
    
    function next() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex++;
        updateCarousel(true);
    }
    
    function prev() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex--;
        updateCarousel(true);
    }
    
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        stopAutoScroll();
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                next();
            } else {
                prev();
            }
        }
        
        startAutoScroll();
        touchStartX = 0;
        touchEndX = 0;
    }
    
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    
    track.addEventListener('transitionend', handleTransitionEnd);
    
    carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    carouselContainer.addEventListener('touchend', handleTouchEnd);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex = index;
            updateCarousel(true);
        });
    });
    
    function startAutoScroll() {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            next();
        }, 4000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    if (window.innerWidth > 768) {
        carouselSection.addEventListener('mouseenter', stopAutoScroll);
        carouselSection.addEventListener('mouseleave', startAutoScroll);
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCardsPerView();
            updateCarousel(false);
        }, 250);
    });
    
    updateCardsPerView();
    setupInfiniteScroll();
    updateCarousel(false);
    startAutoScroll();
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Website initialized');
    } catch (error) {
        console.warn('Initialization error:', error);
    }
});
