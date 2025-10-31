# Deployment Guide

This guide covers various deployment options for Fashion Analyzer, from local development to production deployments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Static Hosting Deployment](#static-hosting-deployment)
- [CDN Deployment](#cdn-deployment)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Web Server**: Any HTTP/HTTPS server (Apache, Nginx, etc.)
- **HTTPS Required**: TensorFlow.js requires HTTPS for security
- **Modern Browser Support**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Storage**: Minimum 10MB disk space (excluding CDN assets)

### Dependencies

All dependencies are loaded via CDN, no local installation required:

- TensorFlow.js 3.21.0
- MobileNet 2.1.0
- jsPDF 2.5.1
- Google AdSense (optional)

### Domain & SSL

- **Custom Domain**: Recommended for production
- **SSL Certificate**: Required for TensorFlow.js functionality
- **Certificate Authority**: Let's Encrypt, CloudFlare, or commercial CA

## Local Development

### Quick Start

1. **Download Project Files**
   ```bash
   git clone https://github.com/your-repo/fashion-analyzer.git
   cd fashion-analyzer
   ```

2. **Start Local Server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   
   # Using Live Server (VS Code extension)
   # Right-click on index.html -> "Open with Live Server"
   ```

3. **Access Application**
   - Open browser to `http://localhost:8000`
   - Ensure you're using HTTP/HTTPS, not file:// protocol

### Development Server Options

#### Python HTTP Server
```bash
# Basic server
python -m http.server 8000

# With custom directory
python -m http.server 8000 --directory /path/to/fashion-analyzer

# With bind address (for network access)
python -m http.server 8000 --bind 0.0.0.0
```

#### Node.js Serve
```bash
# Install globally
npm install -g serve

# Serve current directory
serve .

# With custom port
serve . -l 3000

# With authentication
serve . -s --single --username admin --password password
```

#### PHP Built-in Server
```bash
# Serve with PHP
php -S localhost:8000

# With document root
php -S localhost:8000 -t public/
```

### Live Development Tips

1. **Browser Sync**
   ```bash
   # Install browser-sync
   npm install -g browser-sync
   
   # Start with auto-reload
   browser-sync start --server --files "**/*.html,**/*.css,**/*.js"
   ```

2. **Hot Reloading**
   - Use VS Code Live Server extension
   - Configure auto-refresh in browser settings
   - Use watch mode for CSS/JS changes

## Static Hosting Deployment

### Traditional Web Hosting

1. **Upload Files**
   - Upload all files to web root directory (public_html, www, etc.)
   - Ensure index.html is in the root directory
   - Maintain directory structure

2. **File Permissions**
   ```bash
   # Set appropriate permissions
   chmod 644 index.html
   chmod 644 css/*.css
   chmod 644 js/*.js
   chmod 755 images/
   ```

3. **Test Deployment**
   - Verify HTTPS certificate
   - Test all functionality
   - Check console for errors

### GitHub Pages

1. **Repository Setup**
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit"
   
   # Connect to GitHub repository
   git remote add origin https://github.com/username/fashion-analyzer.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select source: "Deploy from a branch"
   - Choose branch: main
   - Folder: / (root)

3. **Custom Domain** (optional)
   - Add CNAME file with your domain
   - Configure DNS records
   - Enable HTTPS in repository settings

### Netlify

1. **Drag & Drop Deployment**
   - Visit netlify.com
   - Drag project folder to deploy area
   - Get instant URL

2. **Git Integration**
   ```bash
   # Connect repository
   # Build settings:
   # Build command: (leave empty for static sites)
   # Publish directory: .
   ```

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add custom configuration if needed

4. **Custom Domain**
   - Add domain in Site settings
   - Configure DNS as instructed
   - Enable HTTPS automatically

### Vercel

1. **CLI Deployment**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   
   # Follow prompts
   ```

2. **Git Integration**
   - Import project from Git
   - Configure build settings
   - Deploy automatically on push

3. **Configuration** (vercel.json)
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.html",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

## CDN Deployment

### CloudFlare

1. **Setup CloudFlare**
   - Add website to CloudFlare
   - Configure DNS settings
   - Choose plan (free available)

2. **CDN Configuration**
   - Enable auto minification (HTML, CSS, JS)
   - Set browser cache TTL
   - Configure compression

3. **Performance Rules**
   ```javascript
   // Page Rules for optimal performance
   *.yourdomain.com/*.js -> Cache Level: Cache Everything
   *.yourdomain.com/*.css -> Cache Level: Cache Everything
   *.yourdomain.com/*.html -> Cache Level: No Cache
   ```

### AWS CloudFront

1. **Create Distribution**
   - Go to AWS CloudFront console
   - Create new distribution
   - Set origin to S3 bucket or web server

2. **Cache Configuration**
   ```
   Origin: your-domain.com
   Viewer Protocol Policy: Redirect HTTP to HTTPS
   Allowed Methods: GET, HEAD, OPTIONS
   Cache Policy: CachingOptimized
   ```

3. **Custom Headers** (if needed)
   ```
   Header: Access-Control-Allow-Origin
   Value: *
   ```

## Cloud Platform Deployment

### AWS S3 + CloudFront

1. **Create S3 Bucket**
   ```bash
   # Create bucket
   aws s3 mb s3://fashion-analyzer-12345
   
   # Sync files
   aws s3 sync . s3://fashion-analyzer-12345
   
   # Set public read policy
   aws s3api put-bucket-policy --bucket fashion-analyzer-12345 --policy file://bucket-policy.json
   ```

2. **Bucket Policy** (bucket-policy.json)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::fashion-analyzer-12345/*"
       }
     ]
   }
   ```

3. **Configure CloudFront**
   - Create new distribution
   - Set S3 bucket as origin
   - Configure caching behavior
   - Enable compression

### Google Cloud Storage

1. **Create Bucket**
   ```bash
   # Create bucket
   gsutil mb gs://fashion-analyzer-12345
   
   # Make public
   gsutil iam ch allUsers:objectViewer gs://fashion-analyzer-12345
   
   # Upload files
   gsutil -m cp -r . gs://fashion-analyzer-12345
   ```

2. **Configure Load Balancer**
   - Create HTTP(S) load balancer
   - Add Cloud Storage bucket as backend
   - Configure SSL certificate

### Azure Static Web Apps

1. **Create Resource**
   ```bash
   # Create static web app
   az staticwebapp create \
     --name fashion-analyzer \
     --resource-group myResourceGroup \
     --source https://github.com/username/fashion-analyzer \
     --location "Central US" \
     --branch main \
     --app-location "/" \
     --output-location "/"
   ```

2. **Configuration** (staticwebapp.config.json)
   ```json
   {
     "navigationFallback": {
       "rewrite": "index.html"
     },
     "responseOverrides": {
       "401": {
         "rewrite": "/index.html",
         "statusCode": 200
       }
     }
   }
   ```

## Docker Deployment

### Dockerfile

```dockerfile
# Use nginx as base image
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (nginx.conf)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Handle SPA routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Docker Commands

```bash
# Build image
docker build -t fashion-analyzer .

# Run container
docker run -d -p 8080:80 --name fashion-app fashion-analyzer

# View logs
docker logs fashion-app

# Stop container
docker stop fashion-app

# Remove container
docker rm fashion-app
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  fashion-analyzer:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    
  # Optional: Add nginx proxy
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
    environment:
      - DEFAULT_HOST=localhost
```

## Environment Configuration

### Environment Variables

```bash
# Production environment
NODE_ENV=production
REACT_APP_VERSION=1.0.0
REACT_APP_API_URL=https://api.yourdomain.com

# Analytics
REACT_APP_ANALYTICS_ID=GA-XXXXXXXXX

# AdSense
REACT_APP_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
REACT_APP_ADSENSE_SLOT=XXXXXXXXX
```

### Configuration Files

#### config.js
```javascript
window.AppConfig = {
  environment: 'production',
  apiUrl: 'https://api.yourdomain.com',
  analyticsId: 'GA-XXXXXXXXX',
  adSense: {
    client: 'ca-pub-XXXXXXXXXXXXXXXX',
    slot: 'XXXXXXXXX'
  },
  features: {
    analytics: true,
    ads: true,
    premium: true
  }
};
```

#### .htaccess (Apache)
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options SAMEORIGIN
Header always set X-XSS-Protection "1; mode=block"
```

## Performance Optimization

### Asset Optimization

1. **Minification**
   ```bash
   # CSS minification
   npm install -g clean-css-cli
   cleancss -o css/styles.min.css css/styles.css
   
   # JavaScript minification
   npm install -g terser
   terser js/fashion-analyzer.js -o js/fashion-analyzer.min.js
   
   # HTML minification
   npm install -g html-minifier
   html-minifier --collapse-whitespace index.html -o index.min.html
   ```

2. **Image Optimization**
   ```bash
   # Install imagemin
   npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant
   
   # Optimize images
   imagemin imgs/*.jpg --out-dir=imgs/optimized --plugin=mozjpeg
   imagemin imgs/*.png --out-dir=imgs/optimized --plugin=pngquant
   ```

3. **Bundle Analysis**
   ```html
   <!-- Add to development build -->
   <script src="https://cdn.jsdelivr.net/npm/webpack-bundle-analyzer"></script>
   ```

### Caching Strategy

```javascript
// Service Worker for caching
const CACHE_NAME = 'fashion-analyzer-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/fashion-analyzer.js',
  '/js/fashion-database.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### CDN Optimization

```html
<!-- Preload critical resources -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js" as="script">
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0" as="script">

<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">
<link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
<link rel="dns-prefetch" href="//pagead2.googlesyndication.com">
```

## Monitoring & Analytics

### Error Monitoring

```javascript
// Error tracking
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // Send to monitoring service
  sendErrorReport({
    message: event.message,
    stack: event.error?.stack,
    timestamp: new Date().toISOString()
  });
});

// Promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### Performance Monitoring

```javascript
// Performance tracking
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      
      console.log('Performance metrics:', {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime
      });
    }, 0);
  });
}
```

### Analytics Integration

```javascript
// Google Analytics 4
if (window.gtag) {
  // Track page views
  gtag('config', 'GA_MEASUREMENT_ID');
  
  // Track custom events
  gtag('event', 'analyze_image', {
    event_category: 'engagement',
    event_label: 'fashion_analysis'
  });
}
```

## Troubleshooting

### Common Deployment Issues

#### HTTPS Requirement
```javascript
// Check if running on HTTPS
if (location.protocol !== 'https:') {
  console.warn('TensorFlow.js requires HTTPS for security reasons');
  // Redirect to HTTPS or show warning
  if (location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
}
```

#### CORS Issues
```apache
# Apache .htaccess
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

#### Model Loading Failures
```javascript
// Implement fallback for model loading
async function loadModelWithFallback() {
  try {
    await analyzer.loadModel();
  } catch (error) {
    console.error('Model loading failed:', error);
    
    // Try alternative CDN
    tf.setBackend('webgl');
    await tf.ready();
    await analyzer.loadModel();
  }
}
```

### Performance Issues

#### Memory Leaks
```javascript
// Clean up canvas after processing
function cleanupCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
}

// Dispose TensorFlow tensors
function disposeTensors(tensors) {
  tensors.forEach(tensor => {
    if (tensor && typeof tensor.dispose === 'function') {
      tensor.dispose();
    }
  });
}
```

#### Loading Performance
```javascript
// Lazy loading for non-critical features
function loadPremiumFeatures() {
  // Only load when needed
  import('./premium-features.js')
    .then(module => {
      module.initPremiumFeatures();
    })
    .catch(error => {
      console.error('Failed to load premium features:', error);
    });
}
```

### Testing Deployment

#### Automated Testing
```javascript
// Deployment smoke tests
const tests = {
  async testModelLoading() {
    try {
      await analyzer.loadModel();
      return true;
    } catch (error) {
      console.error('Model loading test failed:', error);
      return false;
    }
  },
  
  async testImageUpload() {
    // Test image upload functionality
    const testImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...';
    const result = await analyzer.analyzeImage(testImage);
    return result.detectedItems.length > 0;
  },
  
  async testUI() {
    // Test UI elements are present
    return !!document.getElementById('upload-section') &&
           !!document.getElementById('analysis-results');
  }
};

// Run tests
async function runDeploymentTests() {
  const results = await Promise.all([
    tests.testModelLoading(),
    tests.testImageUpload(),
    tests.testUI()
  ]);
  
  console.log('Deployment test results:', results);
}
```

### Security Checklist

- [ ] HTTPS enabled and working
- [ ] Security headers configured (X-Frame-Options, X-Content-Type-Options)
- [ ] Input validation implemented
- [ ] File upload restrictions in place
- [ ] No sensitive data in client-side code
- [ ] Third-party scripts loaded securely
- [ ] CSP headers configured (Content Security Policy)
- [ ] Regular security updates scheduled

### Maintenance Schedule

#### Daily
- Monitor error logs
- Check performance metrics
- Verify CDN cache status

#### Weekly
- Review analytics data
- Test all major features
- Update dependencies

#### Monthly
- Security audit
- Performance optimization review
- Backup configuration files
- Update documentation

---

For additional support, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) and [API.md](API.md).