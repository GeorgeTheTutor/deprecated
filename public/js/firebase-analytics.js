class FirebaseAnalyticsService {
  constructor() {
    this.analytics = window.firebaseAnalytics;
    this.isInitialized = false;
    
    this.waitForInitialization();
  }

  waitForInitialization() {
    const checkInitialization = () => {
      if (window.firebaseAnalytics) {
        this.analytics = window.firebaseAnalytics;
        this.isInitialized = true;
        console.log('Firebase Analytics service ready (v9+ SDK with your config)');
      } else {
        setTimeout(checkInitialization, 100);
      }
    };
    checkInitialization();
  }

  trackPageView(pageName, pageTitle = null) {
    if (!this.isInitialized) {
      console.warn('Firebase Analytics not initialized yet');
      return;
    }

    try {
      this.analytics.logEvent('page_view', {
        page_title: pageTitle || document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_name: pageName
      });
      console.log('Page view tracked:', pageName);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  trackEvent(eventName, parameters = {}) {
    if (!this.isInitialized) {
      console.warn('Firebase Analytics not initialized yet');
      return;
    }

    try {
      this.analytics.logEvent(eventName, parameters);
      console.log('Event tracked:', eventName, parameters);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  trackButtonClick(buttonName, section = null) {
    this.trackEvent('button_click', {
      button_name: buttonName,
      section: section,
      timestamp: Date.now()
    });
  }

  trackFormSubmission(formName, success = true) {
    this.trackEvent('form_submit', {
      form_name: formName,
      success: success,
      timestamp: Date.now()
    });
  }

  trackScrollDepth(percentage) {
    this.trackEvent('scroll', {
      scroll_depth: percentage,
      page_path: window.location.pathname
    });
  }

  trackContactAttempt(method, details = {}) {
    this.trackEvent('contact_attempt', {
      contact_method: method,
      ...details,
      timestamp: Date.now()
    });
  }

  trackEngagement(action, details = {}) {
    this.trackEvent('engagement', {
      engagement_action: action,
      ...details,
      timestamp: Date.now()
    });
  }

  setUserProperty(propertyName, value) {
    if (!this.isInitialized) {
      console.warn('Firebase Analytics not initialized yet');
      return;
    }

    try {
      this.analytics.setUserProperties({
        [propertyName]: value
      });
      console.log('User property set:', propertyName, value);
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  setUserId(userId) {
    if (!this.isInitialized) {
      console.warn('Firebase Analytics not initialized yet');
      return;
    }

    try {
      this.analytics.setUserId(userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  trackTiming(category, variable, value, label = null) {
    this.trackEvent('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }

  trackError(error, context = {}) {
    this.trackEvent('exception', {
      description: error.message || error,
      fatal: false,
      context: JSON.stringify(context)
    });
  }

  trackLocation(locationData) {
    this.trackEvent('user_location', {
      country: locationData.country,
      country_code: locationData.countryCode,
      region: locationData.region,
      region_name: locationData.regionName,
      city: locationData.city,
      timezone: locationData.timezone,
      isp: locationData.isp,
      timestamp: Date.now()
    });
  }

  async getAndTrackLocation() {
    try {
      const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,timezone,isp,query');
      const data = await response.json();
      
      if (data.status === 'success') {
        this.trackLocation(data);
        this.setUserProperty('user_country', data.country);
        this.setUserProperty('user_city', data.city);
        this.setUserProperty('user_timezone', data.timezone);
        console.log('Location tracked:', data.city, data.country);
        return data;
      } else {
        console.warn('Location tracking failed:', data.message);
        return null;
      }
    } catch (error) {
      console.warn('Location API error:', error);
      this.trackError(error, { context: 'location_tracking' });
      return null;
    }
  }
}

window.analyticsService = new FirebaseAnalyticsService();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseAnalyticsService;
}

window.analyticsService = new FirebaseAnalyticsService();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseAnalyticsService;
}
