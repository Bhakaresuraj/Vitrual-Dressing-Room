// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Debug localStorage
    console.log("Page loaded, checking localStorage...");
    const hasUploadedImage = localStorage.getItem('uploadedImage');
    console.log("Has uploaded image:", hasUploadedImage ? "Yes" : "No");
    
    // Elements
    const categoryBtns = document.querySelectorAll('.filter-btn');
    const sizeFilter = document.getElementById('size-filter');
    const colorFilter = document.getElementById('color-filter');
    const styleFilter = document.getElementById('style-filter');
    const resetFilterBtn = document.querySelector('.filter-reset-btn');
    const clothingItems = document.querySelectorAll('.clothing-item');
    const selectedItemsContainer = document.getElementById('selected-items');
    const clearSelectionBtn = document.querySelector('.clear-selection-btn');
    const trySelectionBtn = document.getElementById('try-selection');
    
    // Selected items array
    let selectedItems = [];

    // Check if user came from upload flow
    const checkIfFromUpload = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const fromUpload = searchParams.get('from') === 'upload';
        const fromUploadFlag = localStorage.getItem('fromUpload') === 'true';
        
        console.log("From upload URL param:", fromUpload);
        console.log("From upload localStorage flag:", fromUploadFlag);
        
        // Check either indicator
        if (fromUpload || fromUploadFlag) {
            console.log("User came from upload flow, showing welcome message");
            
            // Clear the flag
            if (fromUploadFlag) {
                localStorage.removeItem('fromUpload');
            }
            
            // Create a welcome message at the top of the catalog
            const catalogHeader = document.querySelector('.catalog-header');
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'welcome-message';
            welcomeMessage.innerHTML = `
                <div class="welcome-content">
                    <i class="fas fa-check-circle"></i>
                    <p>Your photo has been uploaded! Now select clothes to try on.</p>
                </div>
                <button class="close-welcome"><i class="fas fa-times"></i></button>
            `;
            catalogHeader.appendChild(welcomeMessage);
            
            // Add event listener to close button
            welcomeMessage.querySelector('.close-welcome').addEventListener('click', () => {
                welcomeMessage.style.display = 'none';
            });
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                welcomeMessage.style.opacity = '0';
                setTimeout(() => {
                    welcomeMessage.style.display = 'none';
                }, 500);
            }, 5000);
        } else {
            console.log("User did not come from upload flow");
        }
    };
    
    // Call the function
    checkIfFromUpload();

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
            
            // Get background color from placeholder
            const placeholder = item.querySelector('.placeholder-image');
            const backgroundColor = window.getComputedStyle(placeholder).backgroundColor;
            const itemId = selectedItems.length + 1;
            
            // Check if item is already selected
            const isAlreadySelected = selectedItems.some(selItem => selItem.name === itemName);
            
            if (!isAlreadySelected) {
                // Add to selected items array
                selectedItems.push({
                    id: itemId,
                    name: itemName,
                    backgroundColor: backgroundColor
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
            try {
                console.log("Try on button clicked, checking for uploaded image...");
                const uploadedImage = localStorage.getItem('uploadedImage');
                
                if (uploadedImage && uploadedImage.startsWith('data:image')) {
                    console.log("Valid image found in localStorage");
                    // Get item details
                    const item = btn.closest('.clothing-item');
                    const itemName = item.querySelector('h3').textContent;
                    
                    // Create a modal to show the virtual try-on
                    showTryOnModal(uploadedImage, itemName);
                } else {
                    console.log("No valid image found:", uploadedImage ? "Invalid format" : "No image");
                    alert('Please upload your photo first on the home page.');
                    // Redirect to home page after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            } catch (error) {
                console.error("Error in try-on process:", error);
                alert("There was an error processing your request. Please try again.");
            }
        });
    });

    // Clear all selected items
    clearSelectionBtn.addEventListener('click', () => {
        selectedItems = [];
        updateSelectedItemsUI();
    });

    // Try on selected items
    trySelectionBtn.addEventListener('click', () => {
        try {
            if (selectedItems.length === 0) {
                alert('Please select at least one item to try on.');
            } else {
                console.log("Try on selected button clicked, checking for uploaded image...");
                const uploadedImage = localStorage.getItem('uploadedImage');
                
                if (uploadedImage && uploadedImage.startsWith('data:image')) {
                    console.log("Valid image found in localStorage");
                    // Get names of selected items
                    const itemNames = selectedItems.map(item => item.name);
                    
                    // Create a modal to show the virtual try-on with multiple items
                    showTryOnModal(uploadedImage, itemNames.join(', '));
                } else {
                    console.log("No valid image found:", uploadedImage ? "Invalid format" : "No image");
                    alert('Please upload your photo first on the home page.');
                    // Redirect to home page after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            }
        } catch (error) {
            console.error("Error in try-on selection process:", error);
            alert("There was an error processing your request. Please try again.");
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
                
                // Create a colored rectangle instead of using an image
                itemElement.innerHTML = `
                    <div style="background-color: ${item.backgroundColor}; width: 100%; height: 100%;"></div>
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

    // Function to show try-on modal
    function showTryOnModal(userImage, itemText) {
        try {
            console.log("Creating try-on modal for:", itemText);
            
            // Create modal elements
            const tryOnModal = document.createElement('div');
            tryOnModal.className = 'try-on-modal';
            
            tryOnModal.innerHTML = `
                <div class="try-on-content">
                    <div class="try-on-header">
                        <h2>Virtual Try-On</h2>
                        <button class="close-try-on">&times;</button>
                    </div>
                    <div class="try-on-body">
                        <div class="try-on-image-container">
                            <img src="${userImage}" alt="You wearing ${itemText}" class="try-on-image" onerror="this.src='virtual_dressing.jpeg'; console.error('Error loading user image, fallback to default');">
                            <div class="try-on-overlay">Trying on: ${itemText}</div>
                        </div>
                        <div class="try-on-info">
                            <p>This is a simulation of how ${itemText} might look on you.</p>
                            <p>In a real application, AI would generate an accurate rendering.</p>
                        </div>
                    </div>
                    <div class="try-on-footer">
                        <button class="try-on-btn-secondary">Return to Catalog</button>
                        <button class="try-on-btn-primary">Add to Cart</button>
                    </div>
                </div>
            `;
            
            // Add to body
            document.body.appendChild(tryOnModal);
            console.log("Modal added to document");
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
            
            // Add close functionality
            const closeBtn = tryOnModal.querySelector('.close-try-on');
            const returnBtn = tryOnModal.querySelector('.try-on-btn-secondary');
            
            const closeTryOnModal = () => {
                document.body.removeChild(tryOnModal);
                document.body.style.overflow = '';
                console.log("Modal closed");
            };
            
            closeBtn.addEventListener('click', closeTryOnModal);
            returnBtn.addEventListener('click', closeTryOnModal);
            
            // Close when clicking outside modal content
            tryOnModal.addEventListener('click', (e) => {
                if (e.target === tryOnModal) {
                    closeTryOnModal();
                }
            });
            
            console.log("Try-on modal displayed successfully");
        } catch (error) {
            console.error("Error displaying try-on modal:", error);
            alert("There was an error displaying the virtual try-on. Please try again.");
        }
    }
}); 