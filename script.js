// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
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
        alert('This would proceed to the next step where you can adjust the photo and then see virtual try-on results.');
        closeModal();
    });

    // Existing CTA button alerts
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        if (!button.id || button.id !== 'upload-photo-btn') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (button.classList.contains('secondary')) {
                    alert('Catalog browsing would open here in the full application');
                }
            });
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

    // Catalog Modal Functionality
    const catalogModal = document.getElementById('catalog-modal');
    const browseCatalogBtn = document.getElementById('browse-catalog-btn');
    const closeCatalogBtn = document.getElementById('close-catalog');
    const cancelSelectionBtn = document.getElementById('cancel-selection');
    const trySelectionBtn = document.getElementById('try-selection');
    const categoryBtns = document.querySelectorAll('.filter-btn');
    const sizeFilter = document.getElementById('size-filter');
    const colorFilter = document.getElementById('color-filter');
    const styleFilter = document.getElementById('style-filter');
    const resetFilterBtn = document.querySelector('.filter-reset-btn');
    const clothingItems = document.querySelectorAll('.clothing-item');
    const selectedItemsContainer = document.getElementById('selected-items');
    const clearSelectionBtn = document.querySelector('.clear-selection-btn');
    const noItemsMessage = document.querySelector('.no-items-message');
    
    // Selected items array
    let selectedItems = [];

    // Open catalog modal
    browseCatalogBtn.addEventListener('click', (e) => {
        e.preventDefault();
        catalogModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    });

    // Close catalog modal
    const closeCatalogModal = () => {
        catalogModal.style.display = 'none';
        document.body.style.overflow = '';
    };

    closeCatalogBtn.addEventListener('click', closeCatalogModal);
    cancelSelectionBtn.addEventListener('click', closeCatalogModal);
    catalogModal.addEventListener('click', (e) => {
        if (e.target === catalogModal) {
            closeCatalogModal();
        }
    });

    // Filter category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Filter items
            filterItems();
        });
    });

    // Handle filter changes
    [sizeFilter, colorFilter, styleFilter].forEach(filter => {
        filter.addEventListener('change', filterItems);
    });

    // Reset filters
    resetFilterBtn.addEventListener('click', () => {
        // Reset category buttons
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            }
        });
        
        // Reset select filters
        sizeFilter.value = 'all';
        colorFilter.value = 'all';
        styleFilter.value = 'all';
        
        // Show all items
        filterItems();
    });

    // Filter logic
    function filterItems() {
        const selectedCategory = document.querySelector('.filter-btn.active').dataset.category;
        const selectedSize = sizeFilter.value;
        const selectedColor = colorFilter.value;
        const selectedStyle = styleFilter.value;
        
        clothingItems.forEach(item => {
            const categoryMatch = selectedCategory === 'all' || item.dataset.category === selectedCategory;
            const sizeMatch = selectedSize === 'all' || item.dataset.size === selectedSize;
            const colorMatch = selectedColor === 'all' || item.dataset.color === selectedColor;
            const styleMatch = selectedStyle === 'all' || item.dataset.style === selectedStyle;
            
            if (categoryMatch && sizeMatch && colorMatch && styleMatch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Add items to selection
    document.querySelectorAll('.add-to-selection-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.clothing-item');
            const itemName = item.querySelector('h3').textContent;
            const itemImage = item.querySelector('img').src;
            const itemId = selectedItems.length + 1;
            
            // Check if item is already selected
            const isAlreadySelected = selectedItems.some(selItem => selItem.name === itemName);
            
            if (!isAlreadySelected) {
                // Add to selected items array
                selectedItems.push({
                    id: itemId,
                    name: itemName,
                    image: itemImage
                });
                
                // Update UI
                updateSelectedItemsUI();
                
                // Visual feedback
                btn.textContent = 'Added!';
                setTimeout(() => {
                    btn.textContent = 'Add to Selection';
                }, 1500);
            } else {
                // Visual feedback if already selected
                btn.textContent = 'Already Selected';
                setTimeout(() => {
                    btn.textContent = 'Add to Selection';
                }, 1500);
            }
        });
    });

    // Try on single item
    document.querySelectorAll('.try-on-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('This would open the virtual try-on experience with this single item.');
        });
    });

    // Clear all selected items
    clearSelectionBtn.addEventListener('click', () => {
        selectedItems = [];
        updateSelectedItemsUI();
    });

    // Try on selected items
    trySelectionBtn.addEventListener('click', () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one item to try on.');
        } else {
            alert(`This would open the virtual try-on experience with your ${selectedItems.length} selected item(s).`);
            closeCatalogModal();
        }
    });

    // Update selected items UI
    function updateSelectedItemsUI() {
        // Clear container
        selectedItemsContainer.innerHTML = '';
        
        if (selectedItems.length === 0) {
            // Show no items message
            selectedItemsContainer.innerHTML = '<p class="no-items-message">No items selected yet.</p>';
            trySelectionBtn.disabled = true;
        } else {
            // Enable try on button
            trySelectionBtn.disabled = false;
            
            // Add each selected item
            selectedItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'selected-item';
                itemElement.dataset.id = item.id;
                
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <button class="remove-selected" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                selectedItemsContainer.appendChild(itemElement);
            });
            
            // Add remove event listeners
            document.querySelectorAll('.remove-selected').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = parseInt(e.target.closest('.remove-selected').dataset.id);
                    removeSelectedItem(itemId);
                });
            });
        }
    }

    // Remove item from selection
    function removeSelectedItem(itemId) {
        selectedItems = selectedItems.filter(item => item.id !== itemId);
        updateSelectedItemsUI();
    }
}); 