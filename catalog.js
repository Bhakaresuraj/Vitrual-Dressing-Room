// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
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
}); 