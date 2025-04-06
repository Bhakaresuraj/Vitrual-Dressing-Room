// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Test if localStorage is available and working
    const isLocalStorageAvailable = () => {
        const test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            console.error("localStorage is not available:", e);
            return false;
        }
    };
    
    const localStorageAvailable = isLocalStorageAvailable();
    console.log("localStorage available:", localStorageAvailable);

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if href is just "#"
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .step, .demo-gif');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Add animation class for visible elements on page load
    animateOnScroll();
    
    // Listen for scroll events to trigger animations
    window.addEventListener('scroll', animateOnScroll);

    // Photo Upload Modal Functionality
    const modal = document.getElementById('upload-modal');
    const uploadBtn = document.getElementById('upload-photo-btn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-upload');
    const continueBtn = document.getElementById('continue-upload');
    const fileInput = document.getElementById('file-input');
    const dropArea = document.getElementById('drop-area');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const removeImageBtn = document.getElementById('remove-image');
    const uploadInstructions = document.querySelector('.upload-instructions');

    // Open modal when clicking upload button
    uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    });

    // Close modal when clicking X, cancel button, or outside modal
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        resetUpload();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Reset upload area
    const resetUpload = () => {
        fileInput.value = '';
        previewContainer.style.display = 'none';
        uploadInstructions.style.display = 'flex';
        continueBtn.disabled = true;
    };

    // Handle file selection
    fileInput.addEventListener('change', handleFileSelect);

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            validateAndPreviewFile(file);
        }
    }

    // Validate and preview file
    function validateAndPreviewFile(file) {
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG, JPEG, or PNG)');
            resetUpload();
            return;
        }

        // Check file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert('File is too large. Maximum size is 10MB.');
            resetUpload();
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadInstructions.style.display = 'none';
            previewContainer.style.display = 'block';
            continueBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Remove image
    removeImageBtn.addEventListener('click', resetUpload);

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        validateAndPreviewFile(file);
    }

    // Continue button functionality
    continueBtn.addEventListener('click', () => {
        try {
            // Get the image data
            const imageData = previewImage.src;
            
            if (localStorageAvailable) {
                // Save uploaded image to localStorage
                console.log("Saving image to localStorage...");
                localStorage.setItem('uploadedImage', imageData);
                
                // Create a flag to indicate we're coming from upload flow
                localStorage.setItem('fromUpload', 'true');
                console.log("Image saved successfully");
            } else {
                // Fallback: Use a session cookie instead
                console.log("Using cookie fallback for upload indication");
                document.cookie = "fromUpload=true; path=/";
                // Note: We can't store the full image in a cookie due to size limitations
                // So we'll just indicate that the upload happened
            }
            
            // Redirect to catalog page with a parameter to indicate coming from upload
            console.log("Redirecting to catalog...");
            window.location.href = 'catalog.html?from=upload';
        } catch (error) {
            console.error("Error during the upload process:", error);
            alert("There was an error processing your image. Please try again.");
        }
    });

    // Add a simple loading animation when the page loads
    const body = document.querySelector('body');
    body.classList.add('loaded');

    // Add animation classes to style.css
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .step, .demo-gif {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}); 