const firebaseConfig = {
  apiKey: "AIzaSyDyj28dcdSnicFT3XRcY4RNtj6ftASaSPc",
  authDomain: "deprecated-2cd9a.firebaseapp.com",
  projectId: "deprecated-2cd9a",
  storageBucket: "deprecated-2cd9a.firebasestorage.app",
  messagingSenderId: "280659809880",
  appId: "1:280659809880:web:b729f60f92fac6a78d5c2d",
  measurementId: "G-J4BNV3F9M9"
};

function loadFirebaseScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initializeFirebase() {
  try {
    await loadFirebaseScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
    await loadFirebaseScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js');
    
    const app = firebase.initializeApp(firebaseConfig);
    const analytics = firebase.analytics();
    
    window.firebaseApp = app;
    window.firebaseAnalytics = analytics;
    
    console.log('Firebase v9+ SDK initialized successfully with your configuration');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

initializeFirebase();
