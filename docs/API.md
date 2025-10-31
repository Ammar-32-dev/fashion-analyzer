# API Documentation

## Overview

Fashion Analyzer provides a client-side JavaScript API for AI-powered fashion analysis. This document describes the core classes, methods, and data structures available for developers.

## Table of Contents

- [FashionAnalyzer Class](#fashionanalyzer-class)
- [FashionDatabase Class](#fashiondatabase-class)
- [Data Models](#data-models)
- [Configuration](#configuration)
- [Events](#events)
- [Examples](#examples)

## FashionAnalyzer Class

The main application class that handles image analysis, AI processing, and user interface interactions.

### Constructor

```javascript
const analyzer = new FashionAnalyzer();
```

### Methods

#### `init()`

Initializes the application and loads the TensorFlow.js model.

**Parameters**: None

**Returns**: `Promise<void>`

**Example**:
```javascript
await analyzer.init();
console.log('Application initialized');
```

#### `loadModel()`

Loads the TensorFlow.js MobileNet model for clothing detection.

**Parameters**: None

**Returns**: `Promise<void>`

**Example**:
```javascript
try {
  await analyzer.loadModel();
  console.log('Model loaded successfully');
} catch (error) {
  console.error('Model loading failed:', error);
}
```

#### `processImage(file)`

Processes an uploaded image file and displays analysis interface.

**Parameters**:
- `file` (File): Image file object

**Returns**: `void`

**Example**:
```javascript
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    analyzer.processImage(file);
  }
});
```

#### `analyzeImage(imageElement)`

Performs AI analysis on an image element.

**Parameters**:
- `imageElement` (HTMLImageElement): Image element to analyze

**Returns**: `Promise<AnalysisResult>`

**Example**:
```javascript
const imageElement = document.getElementById('preview-image');
const results = await analyzer.analyzeImage(imageElement);
console.log('Detected items:', results.detectedItems);
```

#### `extractColors(imageElement)`

Extracts dominant colors from an image using canvas processing.

**Parameters**:
- `imageElement` (HTMLImageElement): Image element to analyze

**Returns**: `Promise<ColorPalette>`

**Example**:
```javascript
const colorPalette = await analyzer.extractColors(imageElement);
colorPalette.forEach(color => {
  console.log(`Color: ${color.name} - ${color.hex}`);
});
```

#### `displayResults(results)`

Updates the UI with analysis results.

**Parameters**:
- `results` (AnalysisResult): Analysis results object

**Returns**: `void`

**Example**:
```javascript
const results = await analyzer.analyzeImage(imageElement);
analyzer.displayResults(results);
```

#### `downloadPdf()`

Generates and downloads a PDF report of the current analysis.

**Parameters**: None

**Returns**: `Promise<void>`

**Example**:
```javascript
const downloadBtn = document.getElementById('download-pdf');
downloadBtn.addEventListener('click', async () => {
  try {
    await analyzer.downloadPdf();
    console.log('PDF downloaded successfully');
  } catch (error) {
    console.error('PDF download failed:', error);
  }
});
```

#### `saveAnalysis(analysisData)`

Saves analysis data to local storage.

**Parameters**:
- `analysisData` (AnalysisResult): Analysis data to save

**Returns**: `void`

**Example**:
```javascript
const analysisData = {
  detectedItems: [...],
  colorPalette: [...],
  recommendations: [...],
  imageData: imageDataUrl
};

analyzer.saveAnalysis(analysisData);
```

#### `loadSavedAnalyses()`

Retrieves all saved analyses from local storage.

**Parameters**: None

**Returns**: `Object` - Object containing all saved analyses

**Example**:
```javascript
const savedAnalyses = analyzer.loadSavedAnalyses();
Object.keys(savedAnalyses).forEach(key => {
  console.log('Saved analysis:', savedAnalyses[key]);
});
```

#### `clearSavedAnalyses()`

Clears all saved analyses from local storage.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
analyzer.clearSavedAnalyses();
console.log('All saved analyses cleared');
```

### Properties

#### `currentModel`

The loaded TensorFlow.js MobileNet model.

**Type**: `Object | null`

**Example**:
```javascript
if (analyzer.currentModel) {
  console.log('Model is ready for inference');
}
```

#### `currentAnalysis`

The results of the current analysis.

**Type**: `AnalysisResult | null`

**Example**:
```javascript
if (analyzer.currentAnalysis) {
  console.log('Current analysis:', analyzer.currentAnalysis);
}
```

#### `isAnalyzing`

Indicates whether an analysis is currently in progress.

**Type**: `boolean`

**Example**:
```javascript
if (analyzer.isAnalyzing) {
  console.log('Analysis in progress...');
  showSpinner();
}
```

## FashionDatabase Class

Provides fashion knowledge base, color rules, and recommendation algorithms.

### Constructor

```javascript
const fashionDB = new FashionDatabase();
```

### Methods

#### `getRecommendations(detectedItems, detectedColors)`

Generates fashion recommendations based on detected items and colors.

**Parameters**:
- `detectedItems` (Array): Array of detected clothing items
- `detectedColors` (Array): Array of detected colors

**Returns**: `Array<Recommendation>`

**Example**:
```javascript
const recommendations = fashionDB.getRecommendations(
  detectedItems, 
  detectedColors
);

recommendations.forEach(rec => {
  console.log(`Recommended: ${rec.name} - ${rec.reason}`);
});
```

#### `categorizeDetectedItems(detectedItems)`

Categorizes detected items into clothing categories.

**Parameters**:
- `detectedItems` (Array): Array of raw model predictions

**Returns**: `Object` - Object with categorized items

**Example**:
```javascript
const categories = fashionDB.categorizeDetectedItems(detectedItems);
console.log('Tops:', categories.tops);
console.log('Bottoms:', categories.bottoms);
console.log('Shoes:', categories.shoes);
```

#### `getComplementaryColors(color)`

Returns colors that complement the given color.

**Parameters**:
- `color` (string): Hex color code

**Returns**: `Array<string>` - Array of complementary color hex codes

**Example**:
```javascript
const complements = fashionDB.getComplementaryColors('#FF6B6B');
console.log('Complementary colors:', complements);
```

#### `determineStyleContext(detectedItems)`

Determines the style context based on detected clothing items.

**Parameters**:
- `detectedItems` (Array): Array of detected clothing items

**Returns**: `string` - Style context ('casual', 'formal', 'business', 'sporty', 'party')

**Example**:
```javascript
const styleContext = fashionDB.determineStyleContext(detectedItems);
console.log('Style context:', styleContext);
```

#### `getSeasonalRecommendations(season, styleContext)`

Returns season-appropriate clothing recommendations.

**Parameters**:
- `season` (string): Season ('spring', 'summer', 'fall', 'winter')
- `styleContext` (string): Current style context

**Returns**: `Array<Recommendation>` - Array of seasonal recommendations

**Example**:
```javascript
const seasonalRecs = fashionDB.getSeasonalRecommendations('fall', 'casual');
console.log('Fall recommendations:', seasonalRecs);
```

### Properties

#### `clothingKeywords`

Array of keywords used to identify clothing items in model predictions.

**Type**: `Array<string>`

**Example**:
```javascript
const keywords = fashionDB.clothingKeywords;
console.log('Clothing detection keywords:', keywords);
```

#### `colorCombinations`

Predefined color combination rules.

**Type**: `Object`

**Example**:
```javascript
const combinations = fashionDB.colorCombinations;
console.log('Available color combinations:', Object.keys(combinations));
```

#### `seasonalStyles`

Season-specific style and clothing recommendations.

**Type**: `Object`

**Example**:
```javascript
const styles = fashionDB.seasonalStyles;
console.log('Winter styles:', styles.winter);
```

## Data Models

### AnalysisResult

Complete analysis results including detected items, colors, and recommendations.

```typescript
interface AnalysisResult {
  detectedItems: DetectedItem[];
  colorPalette: ColorInfo[];
  recommendations: Recommendation[];
  imageData: string; // Base64 encoded image
  timestamp: string;
  styleContext: string;
  confidence: number; // Overall confidence score (0-100)
}
```

**Properties**:
- `detectedItems`: Array of detected clothing items
- `colorPalette`: Array of extracted colors
- `recommendations`: Array of fashion recommendations
- `imageData`: Base64 encoded image data URL
- `timestamp`: ISO timestamp of analysis
- `styleContext`: Determined style context
- `confidence`: Overall confidence score

### DetectedItem

Individual clothing item detection result.

```typescript
interface DetectedItem {
  name: string;
  confidence: number; // Confidence score (0-100)
  rawClass: string; // Original model prediction
  category: string; // Clothing category
  description: string; // Item description
}
```

**Example**:
```javascript
{
  name: "T-Shirt",
  confidence: 85,
  rawClass: "jersey, T-shirt, tee shirt",
  category: "top",
  description: "Casual short-sleeved shirt"
}
```

### ColorInfo

Color information including hex code, RGB values, and color name.

```typescript
interface ColorInfo {
  hex: string;
  rgb: number[]; // [red, green, blue]
  name: string;
  frequency: number; // Color frequency in image
}
```

**Example**:
```javascript
{
  hex: "#FF6B6B",
  rgb: [255, 107, 107],
  name: "Coral",
  frequency: 245
}
```

### Recommendation

Fashion recommendation with reason and shopping links.

```typescript
interface Recommendation {
  name: string;
  reason: string;
  category: string; // Clothing category
  color: string; // Recommended color
  season: string; // Suitable season
  style: string; // Matching style
  shoppingLinks: ShoppingLink[];
  confidence: number; // Recommendation confidence
}
```

**Example**:
```javascript
{
  name: "Blue Jeans",
  reason: "Complements your coral t-shirt",
  category: "bottom",
  color: "navy",
  season: "all",
  style: "casual",
  shoppingLinks: [
    {
      platform: "Amazon",
      url: "https://amazon.com/search?q=navy+blue+jeans"
    }
  ],
  confidence: 88
}
```

### ShoppingLink

Shopping platform link with search query.

```typescript
interface ShoppingLink {
  platform: string; // Platform name
  url: string; // Search URL with query parameter
  query: string; // Search query
}
```

**Example**:
```javascript
{
  platform: "Nike",
  url: "https://nike.com/w?q=coral+sneakers",
  query: "coral sneakers"
}
```

### ColorPalette

Collection of dominant colors from an image.

```typescript
type ColorPalette = ColorInfo[];
```

## Configuration

### Global Configuration

```javascript
const CONFIG = {
  // Model settings
  MODEL: {
    VERSION: '2.1.0',
    INPUT_SIZE: 224,
    ALPHA: 1.0
  },
  
  // Image processing
  IMAGE: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    PROCESSING_SIZE: 200,
    COLOR_SAMPLING_RATE: 4
  },
  
  // Analysis settings
  ANALYSIS: {
    CONFIDENCE_THRESHOLD: 0.5,
    MAX_COLORS: 8,
    MAX_RECOMMENDATIONS: 5
  },
  
  // UI settings
  UI: {
    ANIMATION_DURATION: 300,
    LOADING_TIMEOUT: 30000,
    NOTIFICATION_DURATION: 5000
  }
};
```

### Environment Configuration

```javascript
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TESTING: 'testing'
};
```

## Events

### Custom Events

The FashionAnalyzer class dispatches custom events for application state changes.

#### 'analysis:start'

Fired when image analysis begins.

```javascript
document.addEventListener('analysis:start', (event) => {
  console.log('Analysis started');
  showLoadingSpinner();
});
```

#### 'analysis:complete'

Fired when image analysis completes successfully.

```javascript
document.addEventListener('analysis:complete', (event) => {
  const results = event.detail.results;
  console.log('Analysis complete:', results);
  hideLoadingSpinner();
});
```

#### 'analysis:error'

Fired when analysis encounters an error.

```javascript
document.addEventListener('analysis:error', (event) => {
  const error = event.detail.error;
  console.error('Analysis error:', error);
  showErrorMessage(error.message);
});
```

#### 'pdf:download'

Fired when PDF download starts.

```javascript
document.addEventListener('pdf:download', (event) => {
  console.log('PDF download started');
});
```

## Examples

### Basic Image Analysis

```javascript
// Initialize analyzer
const analyzer = new FashionAnalyzer();
await analyzer.init();

// Process image upload
document.getElementById('file-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    analyzer.processImage(file);
  }
});

// Listen for results
document.addEventListener('analysis:complete', (event) => {
  const results = event.detail.results;
  console.log('Detected items:', results.detectedItems);
  console.log('Color palette:', results.colorPalette);
  console.log('Recommendations:', results.recommendations);
});
```

### Custom Color Analysis

```javascript
// Extract colors from an image
const imageElement = document.getElementById('uploaded-image');
const colorPalette = await analyzer.extractColors(imageElement);

// Display color palette
colorPalette.forEach((color, index) => {
  const colorDiv = document.createElement('div');
  colorDiv.className = 'color-swatch';
  colorDiv.style.backgroundColor = color.hex;
  colorDiv.innerHTML = `
    <span>${color.name}</span>
    <span>${color.hex}</span>
    <span>Frequency: ${color.frequency}</span>
  `;
  document.getElementById('color-palette').appendChild(colorDiv);
});
```

### Custom Recommendation Engine

```javascript
const fashionDB = new FashionDatabase();

// Get detected items and colors from analysis
const detectedItems = analyzer.currentAnalysis.detectedItems;
const detectedColors = analyzer.currentAnalysis.colorPalette;

// Generate custom recommendations
const styleContext = fashionDB.determineStyleContext(detectedItems);
const recommendations = fashionDB.getRecommendations(detectedItems, detectedColors);

// Filter recommendations by style
const filteredRecs = recommendations.filter(rec => 
  rec.style === styleContext
);

// Display recommendations
filteredRecs.forEach(rec => {
  const recDiv = document.createElement('div');
  recDiv.className = 'recommendation-card';
  recDiv.innerHTML = `
    <h3>${rec.name}</h3>
    <p>${rec.reason}</p>
    <div class="shopping-links">
      ${rec.shoppingLinks.map(link => 
        `<a href="${link.url}" target="_blank">${link.platform}</a>`
      ).join('')}
    </div>
  `;
  document.getElementById('recommendations').appendChild(recDiv);
});
```

### Batch Processing

```javascript
// Process multiple images
async function processBatch(files) {
  const results = [];
  
  for (const file of files) {
    try {
      const imageElement = await loadImageFromFile(file);
      const analysisResult = await analyzer.analyzeImage(imageElement);
      results.push(analysisResult);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
    }
  }
  
  return results;
}

// Usage
const files = document.getElementById('batch-input').files;
const batchResults = await processBatch(files);
console.log('Batch results:', batchResults);
```

### Custom Event Handling

```javascript
class CustomFashionAnalyzer extends FashionAnalyzer {
  constructor() {
    super();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    document.addEventListener('analysis:start', this.handleAnalysisStart.bind(this));
    document.addEventListener('analysis:complete', this.handleAnalysisComplete.bind(this));
    document.addEventListener('analysis:error', this.handleAnalysisError.bind(this));
  }
  
  handleAnalysisStart(event) {
    // Custom analysis start logic
    this.updateProgress(0);
    this.logEvent('analysis_started');
  }
  
  handleAnalysisComplete(event) {
    // Custom analysis complete logic
    this.updateProgress(100);
    this.logEvent('analysis_completed', event.detail.results);
  }
  
  handleAnalysisError(event) {
    // Custom error handling logic
    this.reportError(event.detail.error);
    this.logEvent('analysis_error', event.detail.error);
  }
  
  updateProgress(percentage) {
    // Update progress bar
    document.getElementById('progress-bar').style.width = `${percentage}%`;
  }
  
  logEvent(eventName, data) {
    // Custom analytics/logging
    console.log(`Event: ${eventName}`, data);
  }
}

// Usage
const customAnalyzer = new CustomFashionAnalyzer();
await customAnalyzer.init();
```

## Error Handling

### Common Errors

#### Model Loading Error
```javascript
try {
  await analyzer.loadModel();
} catch (error) {
  if (error.message.includes('Failed to load model')) {
    console.error('Failed to load TensorFlow.js model');
    showRetryButton();
  }
}
```

#### Image Processing Error
```javascript
try {
  await analyzer.analyzeImage(imageElement);
} catch (error) {
  switch (error.code) {
    case 'INVALID_FILE_TYPE':
      showError('Please upload a valid image file');
      break;
    case 'FILE_TOO_LARGE':
      showError('File size exceeds 10MB limit');
      break;
    case 'PROCESSING_FAILED':
      showError('Image processing failed. Please try another image.');
      break;
    default:
      showError('An unexpected error occurred');
  }
}
```

### Error Types

```javascript
const ERROR_TYPES = {
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  MODEL_NOT_LOADED: 'MODEL_NOT_LOADED',
  NETWORK_ERROR: 'NETWORK_ERROR'
};
```

## Performance Tips

### Image Optimization
- Resize large images before processing
- Use appropriate image formats (WebP for best compression)
- Limit image dimensions to 1024x1024 for optimal performance

### Memory Management
- Clean up canvas elements after use
- Avoid storing large image data in memory
- Use appropriate garbage collection practices

### Model Caching
- The model is loaded once and cached automatically
- Multiple analyses can use the same loaded model
- Monitor memory usage for long-running sessions

---

For more information, see the [main README](../README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).