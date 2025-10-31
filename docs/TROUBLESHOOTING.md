# Troubleshooting Guide

Common issues and solutions for Fashion Analyzer deployment and usage.

## Table of Contents

- [Getting Help](#getting-help)
- [Common Issues](#common-issues)
- [Performance Problems](#performance-problems)
- [Browser Compatibility](#browser-compatibility)
- [Model Loading Issues](#model-loading-issues)
- [Image Processing Errors](#image-processing-errors)
- [UI/UX Issues](#uiux-issues)
- [Deployment Problems](#deployment-problems)
- [Mobile Issues](#mobile-issues)
- [Debugging Tools](#debugging-tools)
- [Error Codes](#error-codes)
- [FAQ](#faq)

## Getting Help

### Before Reporting an Issue

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub
3. **Verify browser compatibility**
4. **Test with different images**
5. **Check browser console for errors**

### Reporting Issues

When reporting an issue, include:

1. **Browser and version** (e.g., Chrome 91.0.4472.124)
2. **Operating system** (e.g., macOS Big Sur, Windows 10)
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots or error messages**
7. **Console errors** (F12 → Console tab)

### Issue Templates

#### Bug Report
```markdown
**Browser/Version**: Chrome 91.0.4472.124 / macOS Big Sur
**Issue**: Model loading fails
**Steps to Reproduce**:
1. Open application
2. Upload image
3. Click analyze button

**Expected**: Analysis starts
**Actual**: Error message "Failed to load model"

**Console Errors**:
```
Failed to load model: [error details]
```

**Screenshots**: [if applicable]
```

#### Feature Request
```markdown
**Feature**: Add support for GIF images
**Use Case**: Users want to analyze animated fashion content
**Proposed Implementation**: 
- Detect GIF format
- Extract first frame for analysis
- Show animation preview
**Alternative**: Allow video file upload
```

## Common Issues

### 1. Model Loading Failures

#### Symptoms
- "Failed to load TensorFlow.js model" error
- Analysis never starts
- Console shows CORS or network errors

#### Causes
- HTTPS requirement not met
- CDN loading issues
- Network connectivity problems
- Browser blocking third-party scripts

#### Solutions

**Check HTTPS**
```javascript
// Verify HTTPS requirement
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.error('HTTPS required for TensorFlow.js');
  showError('Please use HTTPS to access this application');
}
```

**Verify CDN Accessibility**
```javascript
// Test TensorFlow.js CDN
fetch('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js')
  .then(response => {
    if (!response.ok) throw new Error('CDN unavailable');
    console.log('TensorFlow.js CDN accessible');
  })
  .catch(error => {
    console.error('CDN issue:', error);
    // Try alternative CDN or local fallback
  });
```

**Check Browser Console**
```javascript
// Enable detailed logging
tf.env().set('IS_BROWSER', true);
tf.env().set('DEBUG', true);
```

### 2. Image Upload Problems

#### Symptoms
- "Invalid file type" error for images
- Upload button not responding
- Images not displaying in preview

#### Solutions

**Validate File Types**
```javascript
function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('INVALID_FILE_TYPE');
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('FILE_TOO_LARGE');
  }
  
  return true;
}
```

**Check File API Support**
```javascript
if (!window.File || !window.FileReader) {
  showError('File API not supported in this browser');
  return;
}
```

**Verify Image Format**
```javascript
function isValidImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => reject(new Error('INVALID_IMAGE'));
    img.src = URL.createObjectURL(file);
  });
}
```

### 3. Analysis Timeout

#### Symptoms
- Analysis takes too long
- "Analysis timeout" error
- Loading spinner never disappears

#### Solutions

**Add Timeout Handling**
```javascript
const ANALYSIS_TIMEOUT = 30000; // 30 seconds

async function analyzeWithTimeout(imageElement) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('ANALYSIS_TIMEOUT')), ANALYSIS_TIMEOUT);
  });
  
  try {
    return await Promise.race([
      analyzer.analyzeImage(imageElement),
      timeoutPromise
    ]);
  } catch (error) {
    if (error.message === 'ANALYSIS_TIMEOUT') {
      showError('Analysis timed out. Please try a smaller image.');
    }
    throw error;
  }
}
```

**Optimize Image Size**
```javascript
function resizeImageForProcessing(imageElement, maxSize = 512) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const { width, height } = imageElement;
  const ratio = Math.min(maxSize / width, maxSize / height);
  
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  
  return canvas;
}
```

### 4. PDF Generation Failures

#### Symptoms
- "PDF generation failed" error
- Download doesn't start
- PDF is blank or corrupted

#### Solutions

**Check jsPDF Availability**
```javascript
if (!window.jspdf) {
  showError('PDF generation library not loaded');
  return;
}

try {
  await analyzer.downloadPdf();
} catch (error) {
  console.error('PDF generation failed:', error);
  showError('Failed to generate PDF report');
}
```

**Verify Image Data**
```javascript
function validateImageData(imageDataUrl) {
  if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
    throw new Error('INVALID_IMAGE_DATA');
  }
  
  // Check if data URL is valid
  try {
    const base64 = imageDataUrl.split(',')[1];
    atob(base64);
    return true;
  } catch (error) {
    throw new Error('CORRUPTED_IMAGE_DATA');
  }
}
```

## Performance Problems

### Slow Loading

#### Causes
- Large image files
- Network latency
- CPU-intensive processing
- Memory constraints

#### Solutions

**Optimize Image Loading**
```javascript
function loadImageOptimized(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Downscale if too large
      const maxDimension = 1024;
      if (img.width > maxDimension || img.height > maxDimension) {
        const canvas = resizeImage(img, maxDimension);
        resolve(canvas);
      } else {
        resolve(img);
      }
    };
    
    img.onerror = () => reject(new Error('IMAGE_LOAD_FAILED'));
    img.src = URL.createObjectURL(file);
  });
}
```

**Monitor Performance**
```javascript
function measureAnalysisTime(func) {
  const start = performance.now();
  return func().then(result => {
    const end = performance.now();
    console.log(`Analysis took ${end - start} milliseconds`);
    return result;
  });
}
```

### High Memory Usage

#### Symptoms
- Browser becomes slow
- "Out of memory" errors
- Tab crashes or freezes

#### Solutions

**Memory Cleanup**
```javascript
function cleanupMemory() {
  // Dispose TensorFlow tensors
  if (tf && tf.engine) {
    tf.engine().startScope();
    tf.engine().endScope();
  }
  
  // Clean up canvas elements
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
  
  // Garbage collection hint
  if (window.gc) {
    window.gc();
  }
}
```

**Limit Concurrent Operations**
```javascript
class AnalysisQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  async addAnalysis(image) {
    if (this.processing) {
      this.queue.push(image);
      return;
    }
    
    this.processing = true;
    try {
      await this.processImage(image);
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        const nextImage = this.queue.shift();
        this.addAnalysis(nextImage);
      }
    }
  }
}
```

## Browser Compatibility

### Safari Issues

#### Common Problems
- Canvas processing errors
- Local storage restrictions
- Audio/Video API differences

#### Solutions

**Safari Canvas Fix**
```javascript
function setupCanvasContext() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Safari-specific canvas setup
  if (!context) {
    console.error('Canvas context not available');
    showError('Browser does not support canvas API');
    return null;
  }
  
  // Enable image smoothing for Safari
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  
  return context;
}
```

**Safari Local Storage**
```javascript
function checkLocalStorageSupport() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn('LocalStorage not available:', error);
    return false;
  }
}
```

### Firefox Issues

#### Common Problems
- WebGL compatibility
- Memory management
- Extension conflicts

#### Solutions

**Firefox WebGL Check**
```javascript
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (error) {
    console.warn('WebGL not supported:', error);
    return false;
  }
}
```

### Mobile Browser Issues

#### Common Problems
- Touch event handling
- Viewport scaling
- Performance limitations

#### Solutions

**Mobile Touch Handling**
```javascript
function setupMobileInteractions() {
  // Prevent zoom on double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Handle file input on mobile
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  });
}
```

**Mobile Viewport**
```html
<!-- Proper viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

## Model Loading Issues

### TensorFlow.js Backend Problems

#### Symptoms
- "Backend not initialized" errors
- Poor performance
- "WebGL not supported" warnings

#### Solutions

**Backend Selection**
```javascript
async function initializeTensorFlow() {
  try {
    // Try WebGL backend first (fastest)
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('WebGL backend initialized');
  } catch (error) {
    console.warn('WebGL failed, trying CPU backend:', error);
    try {
      // Fallback to CPU
      await tf.setBackend('cpu');
      await tf.ready();
      console.log('CPU backend initialized');
    } catch (cpuError) {
      console.error('All backends failed:', cpuError);
      throw new Error('BACKEND_INIT_FAILED');
    }
  }
}
```

**Model Loading with Retry**
```javascript
async function loadModelWithRetry(maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await analyzer.loadModel();
      console.log(`Model loaded successfully (attempt ${i + 1})`);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`Model loading attempt ${i + 1} failed:`, error);
      
      // Wait before retry
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
}
```

### MobileNet Model Issues

#### Symptoms
- Low confidence scores
- Inaccurate classifications
- Model timeout errors

#### Solutions

**Model Configuration**
```javascript
const modelConfig = {
  version: 2,
  alpha: 1.0,
  inputShape: [224, 224, 3],
  numClasses: 1000
};

async function loadCustomModel() {
  try {
    const model = await mobilenet.load(modelConfig);
    return model;
  } catch (error) {
    console.error('Custom model loading failed:', error);
    // Fallback to default model
    return await mobilenet.load();
  }
}
```

## Image Processing Errors

### Canvas Processing Issues

#### Symptoms
- "Canvas not available" errors
- Blank or corrupted color palettes
- Memory errors during processing

#### Solutions

**Canvas Fallback**
```javascript
function getCanvasContext() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('2D context not available');
    }
    
    return { canvas, ctx };
  } catch (error) {
    console.error('Canvas initialization failed:', error);
    throw new Error('CANVAS_NOT_AVAILABLE');
  }
}
```

**Safe Image Processing**
```javascript
function processImageSafely(imageElement) {
  try {
    const { canvas, ctx } = getCanvasContext();
    
    // Set canvas size
    canvas.width = Math.min(imageElement.width, 512);
    canvas.height = Math.min(imageElement.height, 512);
    
    // Draw with error handling
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    return canvas;
  } catch (error) {
    console.error('Image processing failed:', error);
    throw new Error('IMAGE_PROCESSING_FAILED');
  }
}
```

### Color Extraction Problems

#### Symptoms
- Inaccurate colors
- Monochromatic results
- Slow processing

#### Solutions

**Optimized Color Extraction**
```javascript
function extractColorsOptimized(imageElement) {
  const { canvas, ctx } = getCanvasContext();
  
  // Resize for performance
  const size = 100;
  canvas.width = size;
  canvas.height = size;
  
  ctx.drawImage(imageElement, 0, 0, size, size);
  
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  const colorCounts = new Map();
  
  // Sample every 4th pixel for speed
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Quantize colors
    const quantized = `${Math.floor(r/32)*32},${Math.floor(g/32)*32},${Math.floor(b/32)*32}`;
    
    colorCounts.set(quantized, (colorCounts.get(quantized) || 0) + 1);
  }
  
  // Get top colors
  return Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([color, count]) => {
      const [r, g, b] = color.split(',').map(Number);
      return {
        hex: rgbToHex(r, g, b),
        rgb: [r, g, b],
        count
      };
    });
}
```

## UI/UX Issues

### Loading State Problems

#### Symptoms
- Users don't know processing is happening
- Multiple analysis attempts
- UI appears frozen

#### Solutions

**Loading Indicators**
```javascript
function showLoadingState() {
  const spinner = document.getElementById('loading-spinner');
  const status = document.getElementById('analysis-status');
  
  if (spinner) spinner.style.display = 'block';
  if (status) {
    status.textContent = 'Analyzing image...';
    status.style.display = 'block';
  }
  
  // Update progress
  updateProgress(25, 'Loading AI model...');
  updateProgress(50, 'Processing image...');
  updateProgress(75, 'Extracting colors...');
  updateProgress(100, 'Generating recommendations...');
}

function hideLoadingState() {
  const spinner = document.getElementById('loading-spinner');
  const status = document.getElementById('analysis-status');
  
  if (spinner) spinner.style.display = 'none';
  if (status) status.style.display = 'none';
}
```

### Error Message Display

#### Solutions

**User-Friendly Error Handling**
```javascript
function showUserError(error) {
  const errorMap = {
    'INVALID_FILE_TYPE': 'Please select a valid image file (JPEG, PNG, WebP)',
    'FILE_TOO_LARGE': 'Image file is too large. Please select a file under 10MB',
    'MODEL_LOAD_FAILED': 'AI model failed to load. Please refresh the page and try again',
    'ANALYSIS_TIMEOUT': 'Analysis took too long. Please try with a smaller image',
    'CANVAS_NOT_AVAILABLE': 'Image processing not supported in this browser'
  };
  
  const message = errorMap[error] || 'An unexpected error occurred. Please try again.';
  
  showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}
```

## Deployment Problems

### CDN Loading Issues

#### Symptoms
- Slow initial load
- "Failed to load script" errors
- Models don't load

#### Solutions

**CDN Fallback Strategy**
```javascript
const CDN_SOURCES = [
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js',
  'https://unpkg.com/@tensorflow/tfjs@3.21.0/dist/tf.min.js',
  '/assets/js/tf.min.js' // Local fallback
];

async function loadScriptWithFallback(urls) {
  for (const url of urls) {
    try {
      await loadScript(url);
      console.log(`Script loaded from: ${url}`);
      return true;
    } catch (error) {
      console.warn(`Failed to load from ${url}:`, error);
    }
  }
  throw new Error('All CDN sources failed');
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

### HTTPS Configuration

#### Apache Configuration
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Mobile Issues

### Touch Interface Problems

#### Solutions

**Touch Event Handling**
```javascript
function setupTouchInterface() {
  // Prevent scroll on drag-and-drop
  document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.upload-area')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Handle file selection on mobile
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('click', (e) => {
    // Ensure file input is triggered
    e.target.click();
  });
}
```

### Performance on Mobile

#### Solutions

**Mobile Optimizations**
```javascript
function optimizeForMobile() {
  // Reduce processing quality on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    window.ANALYSIS_CONFIG = {
      imageSize: 256, // Reduced from 512
      colorSamplingRate: 8, // Increased from 4
      maxColors: 6 // Reduced from 8
    };
  }
}
```

## Debugging Tools

### Console Debugging

```javascript
// Enable debug mode
window.DEBUG_MODE = true;

// Debug functions
const DebugUtils = {
  logAnalysisTime: () => {
    console.log('Analysis times:', performance.getEntriesByType('measure'));
  },
  
  checkMemoryUsage: () => {
    if (performance.memory) {
      console.log('Memory usage:', {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
      });
    }
  },
  
  validateImageData: (imageElement) => {
    console.log('Image dimensions:', {
      width: imageElement.width,
      height: imageElement.height,
      src: imageElement.src.substring(0, 50) + '...'
    });
  }
};
```

### Performance Monitoring

```javascript
function startPerformanceMonitoring() {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'measure') {
        console.log(`${entry.name}: ${entry.duration}ms`);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure'] });
  
  return observer;
}
```

## Error Codes

### Application Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `INVALID_FILE_TYPE` | Unsupported image format | Use JPEG, PNG, or WebP |
| `FILE_TOO_LARGE` | File exceeds size limit | Compress image or resize |
| `MODEL_LOAD_FAILED` | TensorFlow.js model failed to load | Check network, try HTTPS |
| `ANALYSIS_TIMEOUT` | Analysis took too long | Use smaller image |
| `CANVAS_NOT_AVAILABLE` | Canvas API not supported | Update browser |
| `WEBGL_NOT_SUPPORTED` | WebGL not available | Use different browser |
| `MEMORY_INSUFFICIENT` | Not enough memory | Close other tabs |
| `NETWORK_ERROR` | Network connectivity issue | Check internet connection |
| `CDN_UNAVAILABLE` | External CDN down | Wait or check network |

### HTTP Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 404 | File not found | Check file paths |
| 500 | Server error | Check server configuration |
| 503 | Service unavailable | CDN or server maintenance |
| 0 | Network error | Check internet connection |

## FAQ

### General Questions

**Q: Why is HTTPS required?**
A: TensorFlow.js requires HTTPS for security reasons to prevent unauthorized model loading and ensure safe execution in browsers.

**Q: Can I use the app offline?**
A: The app requires internet connection to load TensorFlow.js and models. Future versions may support offline functionality.

**Q: What image formats are supported?**
A: JPEG, PNG, and WebP formats are supported. Animated GIFs are not supported (only first frame).

**Q: Is my image data uploaded to servers?**
A: No, all processing happens client-side in your browser. Images are never uploaded to external servers.

### Technical Questions

**Q: Why is the analysis slow?**
A: Analysis speed depends on image size, device performance, and browser. Use smaller images for faster processing.

**Q: How accurate is the clothing detection?**
A: The MobileNet model achieves ~70% accuracy on ImageNet dataset. Results may vary based on image quality and clothing visibility.

**Q: Can I customize the recommendation engine?**
A: Yes, the fashion database and recommendation algorithms can be modified in the `fashion-database.js` file.

### Browser Support

**Q: Does it work on Safari?**
A: Yes, Safari 12+ is supported with full functionality.

**Q: Can I use it on mobile?**
A: Yes, the app is optimized for mobile devices with touch interface support.

**Q: What about Internet Explorer?**
A: Internet Explorer is not supported. Please use a modern browser.

### Performance Questions

**Q: How much RAM does it use?**
A: The app typically uses 50-100MB for the TensorFlow.js model plus additional memory for image processing.

**Q: Can I run multiple analyses?**
A: Yes, but processing multiple large images simultaneously may impact performance.

**Q: Why does the first analysis take longer?**
A: The first analysis includes model loading time. Subsequent analyses are faster as the model is cached.

### Customization Questions

**Q: Can I add new clothing categories?**
A: Yes, modify the `clothingKeywords` array in `fashion-database.js` to include new categories.

**Q: How do I change the color palette size?**
A: Adjust the `MAX_COLORS` constant in the color extraction function.

**Q: Can I integrate with my own API?**
A: Yes, the app can be extended to use external APIs for additional features like shopping integration.

---

For more help:
- Check the [API documentation](API.md)
- Review the [deployment guide](DEPLOYMENT.md)
- Create an issue on GitHub
- Contact support team