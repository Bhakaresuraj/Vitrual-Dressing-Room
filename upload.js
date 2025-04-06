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

    // Elements
    const fileInput = document.getElementById('file-input');
    const dropArea = document.getElementById('drop-area');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const removeImageBtn = document.getElementById('remove-image');
    const uploadInstructions = document.querySelector('.upload-instructions');
    const continueBtn = document.getElementById('continue-btn');
    const cropBtn = document.getElementById('crop-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Check if continue button exists
    if (!continueBtn) {
        console.error("Continue button not found!");
    } else {
        console.log("Continue button found, initial state:", continueBtn.disabled);
    }
    
    // Make sure continue button is properly set up
    // It should be disabled by default
    continueBtn.disabled = true;
    
    // Function to enable continue button
    const enableContinueButton = () => {
        continueBtn.disabled = false;
        continueBtn.classList.add('active');
        console.log("Continue button enabled");
    };
    
    // Function to disable continue button
    const disableContinueButton = () => {
        continueBtn.disabled = true;
        continueBtn.classList.remove('active');
        console.log("Continue button disabled");
    };
    
    // Directly add a click event to test if button is clickable
    continueBtn.addEventListener('click', () => {
        console.log("Continue button clicked");
        
        // Save the image to localStorage and redirect to catalog
        if (previewImage.src && previewImage.src !== '') {
            try {
                if (localStorageAvailable) {
                    // Save the uploaded image to localStorage
                    localStorage.setItem('uploadedImage', previewImage.src);
                    console.log('Image saved to localStorage');
                    
                    // Redirect to catalog page
                    window.location.href = 'catalog.html?from=upload';
                    console.log('Redirecting to catalog page');
                } else {
                    alert('Your browser does not support local storage. Please try a different browser.');
                }
            } catch (error) {
                console.error('Error saving image:', error);
                alert('Error saving your image. Please try again.');
            }
        } else {
            alert('Please upload an image first.');
        }
    });
    
    // Cropper modal elements
    const cropperModal = document.getElementById('cropper-modal');
    const cropperImage = document.getElementById('cropper-image');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelCropBtn = document.getElementById('cancel-crop');
    const applyCropBtn = document.getElementById('apply-crop');
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    const flipHorizontalBtn = document.getElementById('flip-horizontal');
    const flipVerticalBtn = document.getElementById('flip-vertical');
    
    // Set up initial variables
    let originalImageData = null;
    let editedImageData = null;
    let cropper = null;
    
    // Function to validate and preview uploaded file
    const validateAndPreviewFile = (file) => {
        console.log("Validating file:", file.name, file.type, file.size);
        
        // Check if file is an image
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validImageTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPG, JPEG, or PNG).');
            return false;
        }
        
        // Check file size (max 10MB)
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeInBytes) {
            alert('File is too large. Maximum size is 10MB.');
            return false;
        }
        
        // Clear any previous image data
        editedImageData = null;
        
        // Create a FileReader to read and display the image
        const reader = new FileReader();
        reader.onerror = () => {
            console.error('Error reading file');
            alert('Error reading the image file. Please try again.');
            return false;
        };
        
        reader.onload = (event) => {
            previewImage.src = event.target.result;
            previewImage.onload = () => {
                // Show preview container, hide upload instructions
                uploadInstructions.style.display = 'none';
                previewContainer.style.display = 'block';
                
                // Enable the continue button
                enableContinueButton();
                console.log("Continue button should now be enabled");
            };
        };
        
        // Read the file as a data URL
        reader.readAsDataURL(file);
        return true;
    };
    
    // Set up file input event handlers
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndPreviewFile(file);
        }
    });
    
    // Drag and drop functionality
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('active');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('active');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            validateAndPreviewFile(file);
        }
    });
    
    // Handle remove image button
    removeImageBtn.addEventListener('click', () => {
        // Reset to initial state
        previewImage.src = '';
        previewContainer.style.display = 'none';
        uploadInstructions.style.display = 'flex';
        disableContinueButton();
        editedImageData = null;
        
        // Clear file input
        fileInput.value = '';
    });
    
    // Image cropper functionality
    cropBtn.addEventListener('click', () => {
        // Show the cropper modal
        cropperModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Set the image in the cropper
        cropperImage.src = previewImage.src;
        
        // Initialize cropper
        setTimeout(() => {
            cropper = new Cropper(cropperImage, {
                aspectRatio: NaN, // Free aspect ratio
                viewMode: 1,      // Restrict the crop box to not exceed the size of the canvas
                guides: true,
                center: true,
                background: false,
                autoCropArea: 0.8, // 80% of the image will be in the crop box
                responsive: true
            });
        }, 100);
    });
    
    // Close cropper modal
    const closeCropperModal = () => {
        cropperModal.style.display = 'none';
        document.body.style.overflow = '';
        
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    };
    
    closeModalBtn.addEventListener('click', closeCropperModal);
    cancelCropBtn.addEventListener('click', closeCropperModal);
    
    // Apply crop
    applyCropBtn.addEventListener('click', () => {
        if (cropper) {
            // Get the cropped canvas
            const canvas = cropper.getCroppedCanvas({
                maxWidth: 1200,
                maxHeight: 1200,
                fillColor: '#fff'
            });
            
            if (canvas) {
                // Convert to data URL
                editedImageData = canvas.toDataURL('image/jpeg');
                previewImage.src = editedImageData;
                
                // Close the modal
                closeCropperModal();
            }
        }
    });
    
    // Rotate image left (counterclockwise)
    rotateLeftBtn.addEventListener('click', () => {
        if (cropper) cropper.rotate(-90);
    });
    
    // Rotate image right (clockwise)
    rotateRightBtn.addEventListener('click', () => {
        if (cropper) cropper.rotate(90);
    });
    
    // Flip horizontally
    flipHorizontalBtn.addEventListener('click', () => {
        if (cropper) cropper.scaleX(-cropper.getData().scaleX || -1);
    });
    
    // Flip vertically
    flipVerticalBtn.addEventListener('click', () => {
        if (cropper) cropper.scaleY(-cropper.getData().scaleY || -1);
    });
    
    // Simple rotate button without opening the modal
    rotateBtn.addEventListener('click', () => {
        // Create a temporary canvas to rotate the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Switch width and height for rotation
            canvas.width = img.height;
            canvas.height = img.width;
            
            // Translate and rotate
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(Math.PI / 2); // 90 degrees
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            
            // Update the preview
            editedImageData = canvas.toDataURL('image/jpeg');
            previewImage.src = editedImageData;
        };
        
        img.src = previewImage.src;
    });
    
    // Reset to original image
    resetBtn.addEventListener('click', () => {
        if (originalImageData) {
            previewImage.src = originalImageData;
            editedImageData = null;
        }
    });
}); 