// Simple script to create basic image files for the catalog
const fs = require('fs');
const { createCanvas } = require('canvas');

// Ensure images directory exists
if (!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
}

// Function to create a simple colored rectangle image
function createImage(filename, color, text) {
    // Create a 300x400 canvas
    const canvas = createCanvas(300, 400);
    const ctx = canvas.getContext('2d');
    
    // Fill with background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 400);
    
    // Add text
    ctx.fillStyle = isLightColor(color) ? '#000000' : '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 150, 200);
    
    // Save as JPG
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(`./images/${filename}`, buffer);
    
    console.log(`Created ${filename}`);
}

// Helper to determine if color is light or dark
function isLightColor(color) {
    // For hex colors
    if (color.startsWith('#')) {
        const hex = color.substring(1);
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128;
    }
    return false; // Default to dark for other formats
}

// Create the sample images
createImage('black-suit.jpg', '#111111', 'Black Suit');
createImage('blue-jeans.jpg', '#3b5998', 'Blue Jeans');
createImage('red-dress.jpg', '#e62b1e', 'Red Dress');
createImage('green-shirt.jpg', '#28a745', 'Green Shirt');
createImage('white-shirt.jpg', '#f8f9fa', 'White Shirt');
createImage('blue-blazer.jpg', '#007bff', 'Blue Blazer');
createImage('hero-image.jpg', '#6a11cb', 'Hero Image');
createImage('demo-animation.gif', '#ff9a9e', 'Demo Animation');

console.log('All images created successfully!'); 