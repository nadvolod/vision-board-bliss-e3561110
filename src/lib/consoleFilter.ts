// Enhanced console filter with rate limiting and comprehensive error suppression
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalWindowError = window.onerror;

const FILTERED_PATTERNS = [
  'Failed to execute \'postMessage\' on \'DOMWindow\': The target origin provided',
  'Unrecognized feature:',
  'An iframe which has both allow-scripts and allow-same-origin',
  'Failed to execute \'removeChild\' on \'Node\'',
  'ResizeObserver loop limit exceeded',
  'Non-Error promise rejection captured',
  'Script error',
  'preloaded using link preload but not used',
  'React Router Future Flag Warning',
  'server connection lost'
];

// Rate limiting with error counting
const errorCounts = new Map<string, { count: number; lastSeen: number }>();
const MAX_ERRORS_PER_MINUTE = 5;
const MINUTE_MS = 60 * 1000;

const shouldSuppressError = (message: string): boolean => {
  // Check if message matches filtered patterns
  if (FILTERED_PATTERNS.some(pattern => message.includes(pattern))) {
    return true;
  }

  // Rate limiting for repeated errors
  const now = Date.now();
  const errorKey = message.substring(0, 100); // Use first 100 chars as key
  const errorData = errorCounts.get(errorKey);

  if (errorData) {
    // Reset count if more than a minute has passed
    if (now - errorData.lastSeen > MINUTE_MS) {
      errorCounts.set(errorKey, { count: 1, lastSeen: now });
      return false;
    }
    
    // Suppress if exceeded rate limit
    if (errorData.count >= MAX_ERRORS_PER_MINUTE) {
      return true;
    }
    
    errorCounts.set(errorKey, { count: errorData.count + 1, lastSeen: now });
  } else {
    errorCounts.set(errorKey, { count: 1, lastSeen: now });
  }

  return false;
};

// Debounce with shorter wait time for better responsiveness
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const debouncedConsoleError = debounce(originalConsoleError, 500);
const debouncedConsoleWarn = debounce(originalConsoleWarn, 500);

console.error = (...args: any[]) => {
  const message = args.join(' ');
  
  if (shouldSuppressError(message)) {
    return; // Suppress filtered/rate-limited errors
  }
  
  // Use debounced version for other errors
  debouncedConsoleError(...args);
};

console.warn = (...args: any[]) => {
  const message = args.join(' ');
  
  if (shouldSuppressError(message)) {
    return; // Suppress filtered/rate-limited warnings
  }
  
  // Use debounced version for other warnings
  debouncedConsoleWarn(...args);
};

// Filter window-level errors
window.onerror = (message, source, lineno, colno, error) => {
  const errorMessage = typeof message === 'string' ? message : String(message);
  
  if (shouldSuppressError(errorMessage)) {
    return true; // Prevent default error handling
  }
  
  // Call original handler if it exists
  if (originalWindowError) {
    return originalWindowError(message, source, lineno, colno, error);
  }
  
  return false;
};

// Filter unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || String(event.reason);
  
  if (shouldSuppressError(message)) {
    event.preventDefault();
  }
});

export {}; // Make this a module