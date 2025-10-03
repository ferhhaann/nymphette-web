// Polyfills for browser APIs that don't exist in Node.js
if (typeof globalThis === 'undefined') {
  (global as any).globalThis = global;
}

if (typeof window === 'undefined') {
  // Mock localStorage
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };

  // Mock sessionStorage
  (global as any).sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };

  // Mock document
  (global as any).document = {
    createElement: (tagName: string) => ({
      tagName: tagName.toUpperCase(),
      getAttribute: () => null,
      setAttribute: () => {},
      removeAttribute: () => {},
      hasAttribute: () => false,
      appendChild: () => {},
      removeChild: () => {},
      insertBefore: () => {},
      cloneNode: () => ({}),
      style: {
        WebkitAnimation: '',
        WebkitTransition: '',
        animation: '',
        transition: '',
        setProperty: () => {},
        getPropertyValue: () => '',
        removeProperty: () => '',
      },
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => false,
      },
      ownerDocument: null,
      parentNode: null,
      childNodes: [],
      firstChild: null,
      lastChild: null,
      nextSibling: null,
      previousSibling: null,
    } as any),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [] as any,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    createEvent: () => ({
      initEvent: () => {},
      preventDefault: () => {},
      stopPropagation: () => {},
    }),
    cookie: '',
    documentElement: {
      getAttribute: () => null,
      setAttribute: () => {},
      dir: 'ltr',
      lang: 'en',
      style: {
        WebkitAnimation: '',
        WebkitTransition: '',
        MozAnimation: '',
        OAnimation: '',
        animation: '',
        transition: '',
      },
    },
    body: {
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
      } as any,
      style: {
        WebkitAnimation: '',
        WebkitTransition: '',
        animation: '',
        transition: '',
      },
      appendChild: () => {},
      removeChild: () => {},
    },
    head: {
      appendChild: () => {},
      removeChild: () => {},
      insertBefore: () => {},
    },
  };

  // Mock window
  (global as any).window = {
    localStorage: (global as any).localStorage,
    sessionStorage: (global as any).sessionStorage,
    document: (global as any).document,
    location: {
      href: '',
      pathname: '/',
      search: '',
      hash: '',
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '3000',
      origin: 'http://localhost:3000',
    } as any,
    history: {
      length: 1,
      state: null,
      pushState: () => {},
      replaceState: () => {},
      go: () => {},
      back: () => {},
      forward: () => {},
      scrollRestoration: 'auto',
    } as any,
    navigator: {
      userAgent: 'SSR',
      language: 'en-US',
    } as any,
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({
      WebkitAnimation: '',
      WebkitTransition: '',
      MozAnimation: '',
      OAnimation: '',
      animation: '',
      transition: '',
      getPropertyValue: () => '',
    } as any),
    matchMedia: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as any),
    requestAnimationFrame: (cb: any) => setTimeout(cb, 16),
    cancelAnimationFrame: clearTimeout,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    innerWidth: 1024,
    innerHeight: 768,
    outerWidth: 1024,
    outerHeight: 768,
    screen: {
      width: 1024,
      height: 768,
    },
    DeviceOrientationEvent: undefined,
    DeviceMotionEvent: undefined,
    console,
    __STATIC_PROPS__: {},
  };

  // Mock global history
  (global as any).history = (global as any).window.history;

  // Mock CSS and vendor prefixes
  const mockCSSStyleDeclaration = new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string' && (
        prop.startsWith('Webkit') ||
        prop.startsWith('Moz') ||
        prop.startsWith('Ms') ||
        prop.startsWith('O') ||
        prop.includes('Animation') ||
        prop.includes('Transition')
      )) {
        return '';
      }
      return target[prop] || '';
    },
    set: () => true,
    has: () => true,
  });

  // Apply CSS mock to document elements
  Object.defineProperty((global as any).document.documentElement, 'style', {
    value: mockCSSStyleDeclaration,
    writable: true,
  });

  // Mock fetch if not available
  if (typeof fetch === 'undefined') {
    (global as any).fetch = async () => ({
      ok: false,
      status: 500,
      statusText: 'SSR Mock',
      json: async () => ({}),
      text: async () => '',
    } as any);
  }
}

export {};