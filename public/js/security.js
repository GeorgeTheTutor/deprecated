class SecurityManager {
  constructor() {
    this.initSecurity();
  }

  initSecurity() {
    this.disableRightClick();
    this.disableCopying();
    this.disableDevTools();
    this.disableKeyboardShortcuts();
    this.disableTextSelection();
    this.detectDevTools();
    console.log('Security measures activated');
  }

  disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  disableCopying() {
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('cut', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('paste', (e) => {
      e.preventDefault();
      return false;
    });
  }

  disableTextSelection() {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });

    document.onselectstart = () => false;
    document.ondragstart = () => false;
  }

  disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S') ||
        (e.ctrlKey && e.key === 'a') ||
        (e.ctrlKey && e.key === 'A') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'v') ||
        (e.ctrlKey && e.key === 'V') ||
        (e.ctrlKey && e.key === 'x') ||
        (e.ctrlKey && e.key === 'X') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 'P')
      ) {
        e.preventDefault();
        return false;
      }
    });
  }

  disableDevTools() {
    let devtools = {open: false, orientation: null};
    let threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.handleDevToolsOpen();
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    if (typeof console !== 'undefined') {
      let originalLog = console.log;
      console.log = function() {
        if (arguments.length > 0 && typeof arguments[0] === 'string' && arguments[0].includes('dev')) {
          return;
        }
        originalLog.apply(console, arguments);
      };
    }
  }

  detectDevTools() {
    let element = new Image();
    let start = performance.now();
    
    element.__defineGetter__('id', function() {
      let end = performance.now();
      if (end - start > 100) {
        this.handleDevToolsOpen();
      }
    });

    setInterval(() => {
      console.dir(element);
    }, 1000);
  }

  handleDevToolsOpen() {
    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial;"><h1>Access Denied</h1></div>';
    window.location.reload();
  }

  addCSSProtection() {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  clearConsole() {
    setInterval(() => {
      console.clear();
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const security = new SecurityManager();
  security.addCSSProtection();
  security.clearConsole();
});

if (window.analytics && window.analytics.trackEvent) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey)) {
      window.analytics.trackEvent('security_violation', {
        attempt_type: 'dev_tools_access',
        key_combination: e.key,
        timestamp: Date.now()
      });
    }
  });

  document.addEventListener('contextmenu', (e) => {
    window.analytics.trackEvent('security_violation', {
      attempt_type: 'right_click',
      timestamp: Date.now()
    });
  });
}
