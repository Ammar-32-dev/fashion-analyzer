// Fashion Database - Comprehensive Fashion Rules and Recommendations
class FashionDatabase {
    constructor() {
        this.colorCombinations = {
            // Complementary color pairs
            blue: {
                complementary: ['orange', 'yellow', 'white'],
                analogous: ['blue', 'teal', 'cyan'],
                triadic: ['red', 'yellow'],
                baseColors: ['#4169E1', '#1E90FF', '#87CEEB', '#4682B4']
            },
            coral: {
                complementary: ['teal', 'blue', 'navy'],
                analogous: ['pink', 'salmon', 'orange'],
                triadic: ['green', 'blue'],
                baseColors: ['#FF6B6B', '#FF8A80', '#FFAB91', '#F8BBD0']
            },
            teal: {
                complementary: ['coral', 'red', 'orange'],
                analogous: ['cyan', 'blue', 'turquoise'],
                triadic: ['orange', 'yellow'],
                baseColors: ['#4ECDC4', '#20B2AA', '#48D1CC', '#87CEEB']
            },
            black: {
                complementary: ['all colors work'],
                analogous: ['grey', 'white', 'brown'],
                triadic: ['all colors work'],
                baseColors: ['#000000', '#1C1C1C', '#2F2F2F', '#4A4A4A']
            },
            white: {
                complementary: ['all colors work'],
                analogous: ['grey', 'beige', 'cream'],
                triadic: ['all colors work'],
                baseColors: ['#FFFFFF', '#F8F8FF', '#F5F5F5', '#FAFAFA']
            },
            grey: {
                complementary: ['red', 'pink', 'coral'],
                analogous: ['black', 'white', 'blue-grey'],
                triadic: ['red', 'yellow'],
                baseColors: ['#808080', '#A9A9A9', '#696969', '#778899']
            },
            navy: {
                complementary: ['orange', 'yellow', 'coral'],
                analogous: ['blue', 'dark-blue', 'indigo'],
                triadic: ['red', 'yellow'],
                baseColors: ['#000080', '#191970', '#001f3f', '#2F4F4F']
            },
            red: {
                complementary: ['green', 'teal'],
                analogous: ['orange', 'pink'],
                triadic: ['blue', 'yellow'],
                baseColors: ['#DC143C', '#B22222', '#CD5C5C', '#F08080']
            }
        };

        this.styleCategories = {
            casual: {
                name: 'Casual',
                description: 'Relaxed and comfortable everyday wear',
                pieces: ['jeans', 't-shirts', 'casual sneakers', 'hoodies', 'cardigans'],
                colors: ['blue', 'grey', 'white', 'black', 'coral', 'teal'],
                seasonality: ['spring', 'summer', 'fall', 'winter']
            },
            formal: {
                name: 'Formal',
                description: 'Professional and dressy attire',
                pieces: ['dress shirts', 'blazers', 'dress shoes', 'ties', 'dress pants'],
                colors: ['black', 'navy', 'grey', 'white'],
                seasonality: ['spring', 'summer', 'fall', 'winter']
            },
            business: {
                name: 'Business Casual',
                description: 'Smart-casual professional look',
                pieces: ['polo shirts', 'chinos', 'blazers', 'loafers', 'sweaters'],
                colors: ['navy', 'grey', 'white', 'blue', 'teal'],
                seasonality: ['spring', 'summer', 'fall', 'winter']
            },
            sporty: {
                name: 'Sporty',
                description: 'Athletic and active wear',
                pieces: ['athletic shoes', 'track pants', 'sports jerseys', 'hoodies', 'shorts'],
                colors: ['black', 'white', 'grey', 'blue', 'red'],
                seasonality: ['spring', 'summer', 'fall', 'winter']
            },
            party: {
                name: 'Party/Evening',
                description: 'Stylish and eye-catching outfits',
                pieces: ['dress shirts', 'dress pants', 'dress shoes', 'accessories', 'blazers'],
                colors: ['black', 'navy', 'coral', 'red', 'white'],
                seasonality: ['spring', 'summer', 'fall', 'winter']
            }
        };

        this.seasonalRecommendations = {
            spring: {
                colors: ['coral', 'teal', 'light blue', 'pink', 'green'],
                fabrics: ['cotton', 'linen', 'lightweight wool'],
                pieces: ['light jackets', 'cardigans', 'spring dresses', 'pants'],
                temperature: 'mild'
            },
            summer: {
                colors: ['white', 'light blue', 'teal', 'coral', 'yellow'],
                fabrics: ['linen', 'cotton', 'breathable synthetics'],
                pieces: ['t-shirts', 'shorts', 'summer dresses', 'sandals'],
                temperature: 'hot'
            },
            fall: {
                colors: ['navy', 'grey', 'brown', 'orange', 'burgundy'],
                fabrics: ['wool', 'denim', 'thicker cotton'],
                pieces: ['sweaters', 'cardigans', 'jeans', 'boots'],
                temperature: 'cool'
            },
            winter: {
                colors: ['black', 'grey', 'navy', 'white', 'burgundy'],
                fabrics: ['wool', 'cashmere', 'heavy cotton'],
                pieces: ['coats', 'sweaters', 'warm pants', 'boots'],
                temperature: 'cold'
            }
        };

        this.itemCategories = {
            tops: {
                name: 'Tops',
                subcategories: {
                    tshirts: {
                        name: 'T-Shirts',
                        keywords: ['t-shirt', 'tshirt', 'tee', 'shirt'],
                        colors: ['white', 'black', 'grey', 'blue', 'navy'],
                        brands: ['H&M', 'Uniqlo', 'Zara', 'Nike']
                    },
                    shirts: {
                        name: 'Dress Shirts',
                        keywords: ['shirt', 'dress shirt', 'blouse'],
                        colors: ['white', 'blue', 'light blue', 'pink'],
                        brands: ['H&M', 'Uniqlo', 'Zara', 'Mango']
                    },
                    sweaters: {
                        name: 'Sweaters',
                        keywords: ['sweater', 'jumper', 'pullover'],
                        colors: ['grey', 'navy', 'black', 'coral', 'teal'],
                        brands: ['H&M', 'Uniqlo', 'Zara', 'Mango']
                    },
                    jackets: {
                        name: 'Jackets',
                        keywords: ['jacket', 'blazer', 'coat', 'cardigan'],
                        colors: ['black', 'navy', 'grey', 'brown'],
                        brands: ['H&M', 'Zara', 'Mango', 'Uniqlo']
                    }
                }
            },
            bottoms: {
                name: 'Bottoms',
                subcategories: {
                    jeans: {
                        name: 'Jeans',
                        keywords: ['jeans', 'denim', 'pants'],
                        colors: ['blue', 'black', 'grey', 'white'],
                        brands: ['Levi\'s', 'H&M', 'Zara', 'Uniqlo']
                    },
                    pants: {
                        name: 'Dress Pants',
                        keywords: ['pants', 'trousers', 'slacks'],
                        colors: ['black', 'grey', 'navy', 'brown'],
                        brands: ['H&M', 'Zara', 'Mango', 'Uniqlo']
                    },
                    shorts: {
                        name: 'Shorts',
                        keywords: ['shorts', 'short pants'],
                        colors: ['khaki', 'black', 'blue', 'white'],
                        brands: ['H&M', 'Uniqlo', 'Zara', 'Mango']
                    }
                }
            },
            shoes: {
                name: 'Shoes',
                subcategories: {
                    sneakers: {
                        name: 'Sneakers',
                        keywords: ['sneakers', 'shoes', 'trainers', 'shoes'],
                        colors: ['white', 'black', 'grey', 'blue'],
                        brands: ['Nike', 'Adidas', 'Puma', 'Converse']
                    },
                    dress: {
                        name: 'Dress Shoes',
                        keywords: ['dress shoes', 'formal shoes', 'loafers'],
                        colors: ['black', 'brown', 'tan'],
                        brands: ['H&M', 'Zara', 'Mango', 'Clarks']
                    },
                    boots: {
                        name: 'Boots',
                        keywords: ['boots', 'boot'],
                        colors: ['black', 'brown', 'tan'],
                        brands: ['H&M', 'Zara', 'Mango', 'Dr. Martens']
                    }
                }
            },
            accessories: {
                name: 'Accessories',
                subcategories: {
                    bags: {
                        name: 'Bags',
                        keywords: ['bag', 'backpack', 'purse'],
                        colors: ['black', 'brown', 'grey', 'navy'],
                        brands: ['H&M', 'Zara', 'Mango', 'Uniqlo']
                    },
                    jewelry: {
                        name: 'Jewelry',
                        keywords: ['jewelry', 'jewellery', 'accessories'],
                        colors: ['silver', 'gold', 'black'],
                        brands: ['H&M', 'Mango', 'Zara', 'Accessories Plus']
                    }
                }
            }
        };

        this.recommendationRules = {
            // Color matching rules
            colorMatching: {
                'coral': {
                    suggests: ['teal', 'navy', 'white', 'grey'],
                    avoids: ['red', 'orange', 'bright yellow']
                },
                'teal': {
                    suggests: ['coral', 'orange', 'white', 'grey'],
                    avoids: ['green', 'olive', 'bright yellow']
                },
                'black': {
                    suggests: ['any color', 'especially white, grey, coral'],
                    avoids: ['dark brown', 'very dark colors']
                },
                'white': {
                    suggests: ['any color', 'especially coral, teal, navy'],
                    avoids: ['none - very versatile']
                },
                'navy': {
                    suggests: ['white', 'coral', 'orange', 'grey'],
                    avoids: ['dark blue', 'black', 'green']
                }
            },

            // Style matching rules
            styleMatching: {
                casual: {
                    tops: ['t-shirts', 'casual shirts', 'hoodies', 'cardigans'],
                    bottoms: ['jeans', 'casual pants', 'shorts'],
                    shoes: ['sneakers', 'casual shoes'],
                    accessories: ['backpacks', 'casual watches']
                },
                formal: {
                    tops: ['dress shirts', 'blazers', 'dress sweaters'],
                    bottoms: ['dress pants', 'chinos'],
                    shoes: ['dress shoes', 'loafers'],
                    accessories: ['ties', 'leather watches', 'dress belts']
                },
                business: {
                    tops: ['polo shirts', 'casual dress shirts', 'cardigans'],
                    bottoms: ['chinos', 'dress pants'],
                    shoes: ['loafers', 'casual dress shoes'],
                    accessories: ['leather belts', 'professional watches']
                }
            },

            // Seasonal rules
            seasonal: {
                spring: {
                    suggests: ['lighter fabrics', 'pastel colors', 'light layers'],
                    avoids: ['heavy winter coats', 'very dark colors in large amounts']
                },
                summer: {
                    suggests: ['breathable fabrics', 'light colors', 'short sleeves'],
                    avoids: ['heavy fabrics', 'very dark colors', 'long sleeves']
                },
                fall: {
                    suggests: ['layering', 'earth tones', 'warmer fabrics'],
                    avoids: ['very light colors', 'summer fabrics']
                },
                winter: {
                    suggests: ['warm layers', 'darker colors', 'heavy fabrics'],
                    avoids: ['light fabrics', 'very light colors']
                }
            }
        };

        this.shoppingLinks = {
            amazon: {
                baseUrl: 'https://www.amazon.com/s?k=',
                affiliateId: 'affiliate-amazon',
                search: (query, color = '') => {
                    const searchTerm = `${query} ${color}`.replace(/\s+/g, '+');
                    return `${this.amazon.baseUrl}${searchTerm}`;
                }
            },
            flipkart: {
                baseUrl: 'https://www.flipkart.com/search?q=',
                affiliateId: 'affiliate-flipkart',
                search: (query, color = '') => {
                    const searchTerm = `${query} ${color}`.replace(/\s+/g, '+');
                    return `${this.flipkart.baseUrl}${searchTerm}`;
                }
            },
            nike: {
                baseUrl: 'https://www.nike.com/w?q=',
                affiliateId: 'affiliate-nike',
                search: (query) => {
                    const searchTerm = query.replace(/\s+/g, '+');
                    return `${this.nike.baseUrl}${searchTerm}`;
                }
            },
            hm: {
                baseUrl: 'https://www.hm.com/us/search-results.html?q=',
                affiliateId: 'affiliate-hm',
                search: (query) => {
                    const searchTerm = query.replace(/\s+/g, '+');
                    return `${this.hm.baseUrl}${searchTerm}`;
                }
            },
            zara: {
                baseUrl: 'https://www.zara.com/us/en/search?term=',
                affiliateId: 'affiliate-zara',
                search: (query) => {
                    const searchTerm = query.replace(/\s+/g, '+');
                    return `${this.zara.baseUrl}${searchTerm}`;
                }
            }
        };
    }

    // Get recommendations based on detected items and colors
    getRecommendations(detectedItems, detectedColors) {
        const recommendations = [];
        const itemTypes = this.categorizeDetectedItems(detectedItems);
        const dominantColors = this.getDominantColors(detectedColors);

        // Determine style context
        const styleContext = this.determineStyleContext(detectedItems);

        // Generate complementary pieces
        for (const itemType of Object.keys(itemTypes)) {
            const complementaryPieces = this.findComplementaryPieces(itemType, itemTypes, dominantColors, styleContext);
            recommendations.push(...complementaryPieces);
        }

        // Color-based recommendations
        const colorBasedRecs = this.generateColorBasedRecommendations(dominantColors, itemTypes);
        recommendations.push(...colorBasedRecs);

        // Style-based recommendations
        const styleBasedRecs = this.generateStyleBasedRecommendations(styleContext, itemTypes, dominantColors);
        recommendations.push(...styleBasedRecs);

        // Return top 5 recommendations
        return recommendations.slice(0, 5);
    }

    categorizeDetectedItems(items) {
        const categorized = {};
        
        for (const item of items) {
            const name = item.name.toLowerCase();
            const category = this.classifyItem(name);
            
            if (!categorized[category]) {
                categorized[category] = [];
            }
            categorized[category].push(item);
        }
        
        return categorized;
    }

    classifyItem(itemName) {
        const classifications = {
            top: ['shirt', 'blouse', 'top', 'sweater', 'hoodie', 'jacket', 'blazer', 'coat'],
            bottom: ['pants', 'jeans', 'trousers', 'shorts', 'skirt', 'dress'],
            shoes: ['shoes', 'sneakers', 'boots', 'heels', 'flats', 'sandals'],
            accessories: ['bag', 'purse', 'watch', 'jewelry', 'belt', 'hat', 'scarf']
        };

        for (const [category, keywords] of Object.entries(classifications)) {
            if (keywords.some(keyword => itemName.includes(keyword))) {
                return category;
            }
        }

        return 'unknown';
    }

    getDominantColors(colorData) {
        // Extract dominant colors from detected colors
        const colors = Object.keys(colorData);
        return colors.slice(0, 3); // Top 3 colors
    }

    determineStyleContext(detectedItems) {
        const itemNames = detectedItems.map(item => item.name.toLowerCase());
        
        // Simple style classification based on detected items
        if (itemNames.some(name => name.includes('suit') || name.includes('dress shirt'))) {
            return 'formal';
        } else if (itemNames.some(name => name.includes('sneakers') || name.includes('hoodie'))) {
            return 'casual';
        } else if (itemNames.some(name => name.includes('blazer') || name.includes('chinos'))) {
            return 'business';
        }
        
        return 'casual'; // Default
    }

    findComplementaryPieces(itemType, allItems, colors, styleContext) {
        const recommendations = [];
        const rules = this.recommendationRules.styleMatching[styleContext] || this.recommendationRules.styleMatching.casual;
        
        const complementaryTypes = {
            top: rules.tops || [],
            bottom: rules.bottoms || [],
            shoes: rules.shoes || [],
            accessories: rules.accessories || []
        };

        // If we have tops, suggest bottoms
        if (itemType === 'top' && !allItems.bottom) {
            const suggestions = this.getItemSuggestions('bottom', complementaryTypes.bottom, colors, styleContext);
            recommendations.push(...suggestions);
        }

        // If we have bottoms, suggest tops
        if (itemType === 'bottom' && !allItems.top) {
            const suggestions = this.getItemSuggestions('top', complementaryTypes.top, colors, styleContext);
            recommendations.push(...suggestions);
        }

        return recommendations;
    }

    getItemSuggestions(category, suggestions, colors, styleContext) {
        const items = [];
        const topColor = colors[0] || 'neutral';
        
        for (const suggestion of suggestions.slice(0, 2)) {
            items.push({
                category: category,
                name: suggestion,
                color: this.getSuggestedColor(suggestion, topColor),
                style: styleContext,
                reason: `Complements your ${topColor} ${suggestion.includes('jeans') ? 'jeans' : 'outfit'}`
            });
        }
        
        return items;
    }

    getSuggestedColor(itemName, baseColor) {
        const colorRules = this.colorCombinations[baseColor] || this.colorCombinations.black;
        const suggestedColors = colorRules.analogous || ['neutral', 'white'];
        
        return suggestedColors[Math.floor(Math.random() * suggestedColors.length)];
    }

    generateColorBasedRecommendations(colors, itemTypes) {
        const recommendations = [];
        
        for (const color of colors) {
            const rules = this.colorMatching[color];
            if (rules && rules.suggests) {
                const suggestedItems = this.getColorMatchingSuggestions(rules.suggests, itemTypes, color);
                recommendations.push(...suggestedItems);
            }
        }
        
        return recommendations;
    }

    getColorMatchingSuggestions(suggestedColors, itemTypes, baseColor) {
        const recommendations = [];
        const color = suggestedColors[0]; // Take first suggested color
        
        // Suggest accessory pieces in complementary colors
        if (!itemTypes.accessories) {
            recommendations.push({
                category: 'accessories',
                name: 'accessory piece',
                color: color,
                style: 'casual',
                reason: `Complements your ${baseColor} color scheme`
            });
        }
        
        return recommendations;
    }

    generateStyleBasedRecommendations(styleContext, itemTypes, colors) {
        const recommendations = [];
        const rules = this.recommendationRules.styleMatching[styleContext];
        
        if (rules) {
            // Suggest shoes if not detected
            if (!itemTypes.shoes && rules.shoes) {
                const shoe = rules.shoes[0];
                recommendations.push({
                    category: 'shoes',
                    name: shoe,
                    color: 'neutral',
                    style: styleContext,
                    reason: `Perfect for a ${styleContext} look`
                });
            }
        }
        
        return recommendations;
    }

    // Get shopping links for recommendations
    getShoppingLinks(item) {
        const itemName = item.name.toLowerCase();
        const colorPart = item.color ? ` ${item.color}` : '';
        const searchQuery = `${itemName}${colorPart}`;
        
        return {
            amazon: this.shoppingLinks.amazon.search(searchQuery),
            flipkart: this.shoppingLinks.flipkart.search(searchQuery),
            nike: itemName.includes('shoes') ? this.shoppingLinks.nike.search(searchQuery) : null,
            hm: this.shoppingLinks.hm.search(searchQuery),
            zara: this.shoppingLinks.zara.search(searchQuery)
        };
    }

    // Get color hex values
    getColorHex(colorName) {
        const colorData = this.colorCombinations[colorName];
        if (colorData && colorData.baseColors) {
            return colorData.baseColors[0];
        }
        return '#808080'; // Default grey
    }

    // Get style tips
    getStyleTips(detectedItems, detectedColors) {
        const tips = [];
        const colors = this.getDominantColors(detectedColors);
        
        // Color combination tips
        if (colors.length >= 2) {
            const colorRule = this.colorCombinations[colors[0]];
            if (colorRule && colorRule.suggests) {
                tips.push(`Great! ${colors[0]} pairs well with ${colorRule.suggests.slice(0, 2).join(' and ')}.`);
            }
        }
        
        // Style tips
        const itemTypes = this.categorizeDetectedItems(detectedItems);
        if (itemTypes.top && itemTypes.bottom) {
            tips.push('Your top and bottom combination works well together.');
        }
        
        return tips;
    }
}

// Export for use in main application
window.FashionDatabase = FashionDatabase;
