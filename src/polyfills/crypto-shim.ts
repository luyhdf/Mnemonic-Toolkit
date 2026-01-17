// Crypto polyfill for browser environment
// This ensures that crypto.randomBytes works in the browser

if (typeof window !== 'undefined' && !window.crypto) {
  throw new Error('Browser does not support Web Crypto API')
}

// Create a crypto object that mimics Node.js crypto module
const cryptoShim = {
  randomBytes: (size: number): Buffer => {
    const bytes = new Uint8Array(size)
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(bytes)
    }
    return Buffer.from(bytes)
  }
}

export default cryptoShim
