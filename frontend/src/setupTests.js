import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';  // Mocks canvas methods used by Chart.js

// Polyfill TextDecoder and TextEncoder
if (typeof global.TextDecoder === 'undefined') {
  const { TextDecoder, TextEncoder } = require('util');
  global.TextDecoder = TextDecoder;
  global.TextEncoder = TextEncoder;
}
