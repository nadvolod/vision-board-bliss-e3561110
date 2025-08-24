// Filter out repetitive console errors that don't affect functionality
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const FILTERED_PATTERNS = [
  'Failed to execute \'postMessage\' on \'DOMWindow\': The target origin provided',
  'Unrecognized feature:',
  'An iframe which has both allow-scripts and allow-same-origin'
];

// Debounce function to prevent spam
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

const debouncedConsoleError = debounce(originalConsoleError, 1000);
const debouncedConsoleWarn = debounce(originalConsoleWarn, 1000);

console.error = (...args: any[]) => {
  const message = args.join(' ');
  
  // Filter out repetitive iframe/postMessage errors
  if (FILTERED_PATTERNS.some(pattern => message.includes(pattern))) {
    return; // Suppress these errors
  }
  
  // Use debounced version for other errors
  debouncedConsoleError(...args);
};

console.warn = (...args: any[]) => {
  const message = args.join(' ');
  
  // Filter out repetitive warnings
  if (FILTERED_PATTERNS.some(pattern => message.includes(pattern))) {
    return; // Suppress these warnings
  }
  
  // Use debounced version for other warnings
  debouncedConsoleWarn(...args);
};

export {}; // Make this a module