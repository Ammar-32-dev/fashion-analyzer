// Fashion Analyzer Main Application
class FashionAnalyzer {
    constructor() {
        this.model = null;
        this.fashionDb = new FashionDatabase();
        this.currentAnalysis = null;
        this.init();
    }

    async init() {
        // Initialize TensorFlow.js model
        await this.loadModel();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load saved analyses
        this.loadSavedAnalyses();
        
        console.log('Fashion Analyzer initialized successfully');
    }

    async loadModel() {
        try {
            this.model = await mobilenet.load();
            console.log('MobileNet model loaded successfully');
        } catch (error) {
            console.error('Error loading model:', error);
            this.showError('Failed to load AI model. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.querySelector('.upload-btn');

        // Drag and drop events
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        uploadArea.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Action buttons
        document.getElementById('downloadPdfBtn').addEventListener('click', this.showPaymentModal.bind(this));
        document.getElementById('saveAnalysisBtn').addEventListener('click', this.saveAnalysis.bind(this));
        document.getElementById('newAnalysisBtn').addEventListener('click', this.startNewAnalysis.bind(this));
        
        // Payment modal
        document.getElementById('confirmPaymentBtn').addEventListener('click', this.downloadPdf.bind(this));
        document.getElementById('cancelPaymentBtn').addEventListener('click', this.hidePaymentModal.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImage(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }

    async processImage(file) {
        // Validate file
        if (!this.validateImageFile(file)) {
            return;
        }

        // Create preview
        this.showImagePreview(file);
        
        // Start analysis
        await this.analyzeImage(file);
    }

    validateImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            this.showError('Please select a valid image file (JPEG, PNG, WebP)');
            return false;
        }

        if (file.size > maxSize) {
            this.showError('Image file is too large. Please select a file smaller than 10MB.');
            return false;
        }

        return true;
    }

    showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('uploadedImage').src = e.target.result;
            document.getElementById('uploadSection').style.display = 'none';
            document.getElementById('analysisSection').style.display = 'block';
            document.getElementById('loadingOverlay').style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    async analyzeImage(file) {
        try {
            // Create image element for processing
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = async () => {
                try {
                    // Detect clothing items using MobileNet
                    const predictions = await this.model.classify(img);
                    
                    // Extract colors from image
                    const colors = await this.extractColors(img);
                    
                    // Process results
                    const detectedItems = this.processDetectedItems(predictions);
                    const colorPalette = this.generateColorPalette(colors);
                    
                    // Generate recommendations
                    const recommendations = this.fashionDb.getRecommendations(detectedItems, colors);
                    
                    // Display results
                    this.displayResults(detectedItems, colorPalette, recommendations);
                    
                    // Store current analysis
                    this.currentAnalysis = {
                        detectedItems,
                        colorPalette,
                        recommendations,
                        imageData: document.getElementById('uploadedImage').src,
                        timestamp: new Date().toISOString()
                    };
                    
                } catch (error) {
                    console.error('Error during analysis:', error);
                    this.showError('Error analyzing image. Please try again.');
                }
            };
            
            img.src = URL.createObjectURL(file);
            
        } catch (error) {
            console.error('Error loading image:', error);
            this.showError('Error loading image. Please try again.');
        }
    }

    async extractColors(imageElement) {
        // Create canvas to extract colors
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 200;
        canvas.height = 200;
        
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Extract dominant colors using simple clustering
        const colorCounts = {};
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Skip pixels that are too transparent or near-white/gray
            const alpha = data[i + 3];
            if (alpha < 128) continue;
            
            const brightness = (r + g + b) / 3;
            if (brightness > 240 || brightness < 15) continue;
            
            // Quantize colors to reduce complexity
            const quantizedR = Math.floor(r / 32) * 32;
            const quantizedG = Math.floor(g / 32) * 32;
            const quantizedB = Math.floor(b / 32) * 32;
            
            const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        
        // Sort colors by frequency
        const sortedColors = Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8) // Top 8 colors
            .map(([colorKey, count]) => {
                const [r, g, b] = colorKey.split(',').map(Number);
                return {
                    rgb: [r, g, b],
                    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
                    count: count
                };
            });
        
        return sortedColors;
    }

    processDetectedItems(predictions) {
        const clothingKeywords = [
            'jersey', 'uniform', 'robe', 'suit', 'costume', 'overcoat', 'waistcoat',
            'sweater', 'cardigan', 'trench coat', 'cloak', 'gown', 'tunic',
            'jean', 'trouser', 'pants', 'dress', 'skirt', 'shirt', 'blouse',
            'shoe', 'sneaker', 'boot', 'moccasin', 'running shoe', 'tennis shoe'
        ];

        return predictions
            .filter(prediction => {
                const className = prediction.className.toLowerCase();
                return clothingKeywords.some(keyword => className.includes(keyword));
            })
            .slice(0, 5) // Limit to top 5 clothing items
            .map(prediction => ({
                name: this.cleanItemName(prediction.className),
                confidence: Math.round(prediction.probability * 100),
                rawClass: prediction.className
            }));
    }

    cleanItemName(className) {
        // Clean up MobileNet class names for better readability
        const cleanups = {
            'running shoe, tennis shoe, sneaker, shoe': 'Sneakers',
            'running shoe': 'Athletic Shoes',
            'jersey, T-shirt, tee shirt': 'T-Shirt',
            'suit of clothes': 'Formal Suit',
            'trench coat': 'Coat',
            'cardigan': 'Cardigan',
            'sweater, jumper, pullover, wool sweater': 'Sweater',
            'jean, blue jean, denim': 'Jeans',
            'trouser, pants': 'Pants',
            'dress, gown': 'Dress',
            'shirt, blouse': 'Shirt',
            'boot': 'Boots'
        };

        for (const [pattern, replacement] of Object.entries(cleanups)) {
            if (className.includes(pattern)) {
                return replacement;
            }
        }

        // Fallback: capitalize and clean up
        return className.split(',')[0]
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    generateColorPalette(colors) {
        return colors.map(color => ({
            hex: color.hex,
            rgb: color.rgb,
            name: this.getColorName(color.hex)
        }));
    }

    getColorName(hex) {
        // Simple color name mapping
        const colorNames = {
            '#FF0000': 'Red',
            '#00FF00': 'Green',
            '#0000FF': 'Blue',
            '#FFFF00': 'Yellow',
            '#FF00FF': 'Magenta',
            '#00FFFF': 'Cyan',
            '#FFFFFF': 'White',
            '#000000': 'Black',
            '#808080': 'Grey',
            '#000080': 'Navy',
            '#FF6B6B': 'Coral',
            '#4ECDC4': 'Teal'
        };

        // Find closest color
        let closestName = 'Unknown';
        let minDistance = Infinity;

        for (const [colorHex, name] of Object.entries(colorNames)) {
            const distance = this.colorDistance(hex, colorHex);
            if (distance < minDistance) {
                minDistance = distance;
                closestName = name;
            }
        }

        return closestName;
    }

    colorDistance(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        );
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 128, g: 128, b: 128 };
    }

    displayResults(detectedItems, colorPalette, recommendations) {
        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';

        // Display detected items
        this.displayDetectedItems(detectedItems);

        // Display color palette
        this.displayColorPalette(colorPalette);

        // Display recommendations
        this.displayRecommendations(recommendations);

        // Add animation
        document.querySelector('.analysis-container').classList.add('fade-in');
    }

    displayDetectedItems(items) {
        const container = document.getElementById('detectedItems');
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = '<p class="no-items">No clothing items detected. Please try a clearer image.</p>';
            return;
        }

        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-confidence">${item.confidence}% confidence</div>
            `;
            container.appendChild(itemCard);
        });
    }

    displayColorPalette(colors) {
        const container = document.getElementById('colorPalette');
        container.innerHTML = '';

        colors.forEach(color => {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = color.hex;
            colorSwatch.innerHTML = `
                <div class="color-name">${color.name}</div>
                <div class="color-hex">${color.hex}</div>
            `;
            container.appendChild(colorSwatch);
        });
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendationsGrid');
        container.innerHTML = '';

        recommendations.forEach(rec => {
            const recCard = document.createElement('div');
            recCard.className = 'recommendation-card slide-up';
            
            const shoppingLinks = this.fashionDb.getShoppingLinks(rec);
            
            recCard.innerHTML = `
                <div class="rec-image">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    <p>${rec.name}</p>
                </div>
                <div class="rec-content">
                    <div class="rec-title">${rec.name}</div>
                    <div class="rec-description">${rec.reason}</div>
                    <div class="rec-price">$${(Math.random() * 100 + 20).toFixed(2)}</div>
                    <div class="shop-links">
                        <a href="${shoppingLinks.amazon}" target="_blank" class="shop-btn amazon">Amazon</a>
                        <a href="${shoppingLinks.flipkart}" target="_blank" class="shop-btn flipkart">Flipkart</a>
                        ${shoppingLinks.nike ? `<a href="${shoppingLinks.nike}" target="_blank" class="shop-btn nike">Nike</a>` : ''}
                    </div>
                </div>
            `;
            
            container.appendChild(recCard);
        });
    }

    showPaymentModal() {
        document.getElementById('paymentModal').style.display = 'flex';
    }

    hidePaymentModal() {
        document.getElementById('paymentModal').style.display = 'none';
    }

    async downloadPdf() {
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1000));

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            // Add title
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Fashion Analysis Report', 20, 30);

            // Add date
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);

            // Add image
            if (this.currentAnalysis) {
                pdf.addImage(this.currentAnalysis.imageData, 'JPEG', 20, 55, 80, 60);
            }

            // Add detected items
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Detected Items:', 20, 125);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            let yPos = 135;
            
            this.currentAnalysis.detectedItems.forEach(item => {
                pdf.text(`${item.name} (${item.confidence}%)`, 25, yPos);
                yPos += 8;
            });

            // Add color palette
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Color Palette:', 20, yPos + 10);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            yPos += 20;

            this.currentAnalysis.colorPalette.forEach(color => {
                // Add color square
                pdf.setFillColor(color.hex);
                pdf.rect(25, yPos - 5, 8, 8, 'F');
                pdf.text(`${color.name} (${color.hex})`, 40, yPos);
                yPos += 12;
            });

            // Add recommendations
            pdf.addPage();
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Recommendations', 20, 30);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            yPos = 45;

            this.currentAnalysis.recommendations.forEach((rec, index) => {
                if (yPos > 270) {
                    pdf.addPage();
                    yPos = 30;
                }

                pdf.text(`${index + 1}. ${rec.name}`, 20, yPos);
                pdf.setFont('helvetica', 'italic');
                pdf.text(rec.reason, 20, yPos + 8);
                pdf.setFont('helvetica', 'normal');
                yPos += 25;
            });

            // Add footer
            pdf.setFontSize(8);
            pdf.setTextColor(128, 128, 128);
            pdf.text('Generated by Fashion Analyzer - AI-Powered Style Analysis', 20, 285);

            // Download PDF
            pdf.save('fashion-analysis.pdf');

            this.hidePaymentModal();

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showError('Error generating PDF. Please try again.');
        }
    }

    saveAnalysis() {
        if (!this.currentAnalysis) {
            this.showError('No analysis to save');
            return;
        }

        try {
            const savedAnalyses = this.getSavedAnalyses();
            const analysisId = Date.now().toString();
            
            savedAnalyses[analysisId] = {
                ...this.currentAnalysis,
                id: analysisId
            };

            localStorage.setItem('fashionAnalyses', JSON.stringify(savedAnalyses));
            this.loadSavedAnalyses();
            
            // Show success message
            this.showSuccess('Analysis saved successfully!');
            
        } catch (error) {
            console.error('Error saving analysis:', error);
            this.showError('Error saving analysis. Please try again.');
        }
    }

    startNewAnalysis() {
        document.getElementById('uploadSection').style.display = 'block';
        document.getElementById('analysisSection').style.display = 'none';
        document.getElementById('uploadedImage').src = '';
        this.currentAnalysis = null;
        
        // Clear file input
        document.getElementById('fileInput').value = '';
    }

    loadSavedAnalyses() {
        const savedAnalyses = this.getSavedAnalyses();
        const container = document.getElementById('savedGrid');
        const section = document.getElementById('savedAnalyses');

        if (Object.keys(savedAnalyses).length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        container.innerHTML = '';

        Object.values(savedAnalyses).reverse().slice(0, 6).forEach(analysis => {
            const card = document.createElement('div');
            card.className = 'saved-card';
            card.innerHTML = `
                <div class="saved-thumbnail">
                    <img src="${analysis.imageData}" alt="Saved analysis" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="saved-info">
                    <div class="saved-date">${new Date(analysis.timestamp).toLocaleDateString()}</div>
                    <div class="saved-items">${analysis.detectedItems.length} items detected</div>
                </div>
            `;
            
            card.addEventListener('click', () => this.loadSavedAnalysis(analysis.id));
            container.appendChild(card);
        });
    }

    getSavedAnalyses() {
        try {
            const data = localStorage.getItem('fashionAnalyses');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading saved analyses:', error);
            return {};
        }
    }

    loadSavedAnalysis(id) {
        const savedAnalyses = this.getSavedAnalyses();
        const analysis = savedAnalyses[id];
        
        if (analysis) {
            this.currentAnalysis = analysis;
            document.getElementById('uploadedImage').src = analysis.imageData;
            document.getElementById('uploadSection').style.display = 'none';
            document.getElementById('analysisSection').style.display = 'block';
            document.getElementById('loadingOverlay').style.display = 'none';
            
            this.displayResults(analysis.detectedItems, analysis.colorPalette, analysis.recommendations);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        if (type === 'error') {
            notification.style.backgroundColor = '#ff4757';
        } else {
            notification.style.backgroundColor = '#2ed573';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize application when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.fashionAnalyzer = new FashionAnalyzer();
});

// Initialize AdSense
window.onload = function() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
        console.log('AdSense initialization failed:', error);
    }
};
