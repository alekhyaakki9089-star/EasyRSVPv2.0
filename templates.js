// Top Filter Bar with Hamburger Menu - templates shown only when both category and language are selected
document.addEventListener('DOMContentLoaded', function() {
    console.log('Templates.js loaded - initializing top filter bar system');
    console.log('Current URL:', window.location.href);
    
    // Get DOM elements
    const categoryMenuBtn = document.getElementById('categoryMenuBtn');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryMenuText = document.getElementById('categoryMenuText');
    const categoryItems = document.querySelectorAll('.category-item');
    const languageSelect = document.getElementById('languageSelect');
    const filterStatus = document.getElementById('filterStatus');
    const templateCards = document.querySelectorAll('.template-card');
    const emptyState = document.getElementById('emptyState');
    const templatesGrid = document.getElementById('templatesGrid');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    const templateCardsContainer = document.querySelector('.template-cards-container');

    console.log('Found elements:', {
        categoryMenuBtn: categoryMenuBtn ? 'found' : 'not found',
        categoryDropdown: categoryDropdown ? 'found' : 'not found',
        categoryItems: categoryItems.length,
        templateCards: templateCards.length,
        languageSelect: languageSelect ? 'found' : 'not found'
    });

    let currentCategory = '';
    let currentLanguage = '';
    let isMenuOpen = false;

    // CRITICAL: Hide ALL templates on initial load
    console.log('Hiding all templates on initial load...');
    templateCards.forEach(card => {
        card.style.display = 'none';
        card.style.visibility = 'hidden';
        card.classList.add('template-hidden');
    });
    
    // Hide the template cards container initially
    if (templateCardsContainer) {
        templateCardsContainer.style.display = 'none';
    }
    
    // Ensure templates grid is hidden initially
    if (templatesGrid) {
        templatesGrid.style.display = 'none';
    }
    
    console.log('All templates hidden successfully');

    // Add metadata overlays to all template cards
    function addMetadataOverlays() {
        templateCards.forEach(card => {
            // Skip if overlay already exists
            if (card.querySelector('.template-metadata')) return;
            
            const category = card.getAttribute('data-category');
            const language = card.getAttribute('data-language');
            const eventName = card.getAttribute('data-event') || card.querySelector('.template-info h4')?.textContent || 'Event Template';
            
            const overlay = document.createElement('div');
            overlay.className = 'template-metadata';
            overlay.innerHTML = `
                <div class="metadata-item">
                    <span class="metadata-label">Category:</span>
                    <span class="metadata-value">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Event:</span>
                    <span class="metadata-value">${eventName}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Language:</span>
                    <span class="metadata-value">${language.charAt(0).toUpperCase() + language.slice(1)}</span>
                </div>
            `;
            
            card.appendChild(overlay);
        });
    }

    // Initialize metadata overlays
    addMetadataOverlays();

    // Update filter status display
    function updateFilterStatus() {
        if (!filterStatus) return;
        
        if (!currentCategory && !currentLanguage) {
            filterStatus.textContent = 'Choose category and language to view templates';
            filterStatus.classList.remove('active');
        } else if (currentCategory && !currentLanguage) {
            filterStatus.textContent = `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} selected - now choose a language`;
            filterStatus.classList.add('active');
        } else if (!currentCategory && currentLanguage) {
            filterStatus.textContent = `${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)} selected - now choose a category`;
            filterStatus.classList.add('active');
        } else {
            filterStatus.textContent = `Showing ${currentCategory} templates in ${currentLanguage}`;
            filterStatus.classList.add('active');
        }
    }

    // Toggle hamburger menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (categoryMenuBtn) {
            categoryMenuBtn.classList.toggle('active', isMenuOpen);
        }
        
        if (categoryDropdown) {
            categoryDropdown.classList.toggle('open', isMenuOpen);
        }
        
        console.log('Menu toggled:', isMenuOpen ? 'open' : 'closed');
    }

    // Close menu
    function closeMenu() {
        isMenuOpen = false;
        
        if (categoryMenuBtn) {
            categoryMenuBtn.classList.remove('active');
        }
        
        if (categoryDropdown) {
            categoryDropdown.classList.remove('open');
        }
        
        console.log('Menu closed');
    }

    // Update category menu button text
    function updateCategoryMenuText(categoryName) {
        if (categoryMenuText) {
            if (categoryName) {
                const categoryMap = {
                    'festivals': 'Festivals',
                    'wedding': 'Weddings',
                    'parties': 'Birthdays & Parties',
                    'business': 'Business Events',
                    'baby': 'Baby & Kids',
                    'valentines': "Valentine's Day"
                };
                categoryMenuText.textContent = categoryMap[categoryName] || categoryName;
            } else {
                categoryMenuText.textContent = 'Select Category';
            }
        }
    }

    // Enable/disable language selector based on category selection
    function updateLanguageSelector() {
        if (languageSelect) {
            if (currentCategory) {
                languageSelect.disabled = false;
                languageSelect.style.opacity = '1';
            } else {
                languageSelect.disabled = true;
                languageSelect.style.opacity = '0.6';
                languageSelect.value = '';
                currentLanguage = '';
                languageSelect.classList.remove('selected');
            }
        }
    }

    // Strict filtering function - ONLY show templates when BOTH filters are selected
    function filterTemplates() {
        console.log('filterTemplates called with:', { currentCategory, currentLanguage });
        
        // Update filter status
        updateFilterStatus();
        
        // ALWAYS hide all templates first
        templateCards.forEach(card => {
            card.style.display = 'none';
            card.style.visibility = 'hidden';
            card.classList.add('template-hidden');
            card.classList.remove('template-visible');
        });

        // Hide template container
        if (templateCardsContainer) {
            templateCardsContainer.style.display = 'none';
        }

        // Check if BOTH filters are selected (strict AND logic)
        if (!currentCategory || !currentLanguage) {
            console.log('Both filters not selected, showing empty state');
            showEmptyState();
            return;
        }

        console.log('Both filters selected, filtering templates...');

        // Show templates that match BOTH category AND language
        let visibleCount = 0;
        templateCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLanguage = card.getAttribute('data-language');
            
            // Handle category mapping for filtering
            let matchCategory = cardCategory === currentCategory;
            
            // Special handling for festivals category
            if (currentCategory === 'festivals') {
                matchCategory = cardCategory === 'parties'; // Most festival templates are in parties category
            }
            
            // Debug logging for template matching
            if (currentCategory === 'festivals' || currentCategory === 'parties') {
                console.log(`Checking template: ${card.querySelector('.template-info h4')?.textContent}, cardCategory: ${cardCategory}, currentCategory: ${currentCategory}, matchCategory: ${matchCategory}, cardLanguage: ${cardLanguage}, currentLanguage: ${currentLanguage}`);
            }
            
            if (matchCategory && cardLanguage === currentLanguage) {
                card.style.display = 'block';
                card.style.visibility = 'visible';
                card.classList.remove('template-hidden');
                card.classList.add('template-visible');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
                visibleCount++;
                console.log('Template matched and shown:', card.querySelector('.template-info h4')?.textContent);
            }
        });

        console.log('Total visible templates:', visibleCount);
        
        if (visibleCount > 0) {
            showTemplatesGrid(visibleCount);
        } else {
            showNoResultsState();
        }
    }

    // Show empty state when filters are incomplete
    function showEmptyState() {
        if (emptyState) emptyState.style.display = 'flex';
        if (templatesGrid) templatesGrid.style.display = 'none';
        if (templateCardsContainer) templateCardsContainer.style.display = 'none';
        
        // Update empty state content based on current selections
        const emptyStateContent = emptyState.querySelector('.empty-state-content');
        if (emptyStateContent) {
            let message = '';
            let icon = '🎨';
            
            if (currentCategory && !currentLanguage) {
                message = `Great! You've selected <strong>${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</strong>. Now please select a language to see templates.`;
                icon = '🌐';
            } else if (currentLanguage && !currentCategory) {
                message = `Perfect! You've selected <strong>${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}</strong>. Now please select a category to see templates.`;
                icon = '📂';
            } else {
                message = 'Discover beautiful invitation templates in multiple languages. Get started by selecting a category and language above.';
                icon = '🎨';
            }
            
            emptyStateContent.innerHTML = `
                <div class="empty-state-icon">${icon}</div>
                <h3>${currentCategory || currentLanguage ? 'Almost there!' : 'Welcome to our Template Gallery!'}</h3>
                <p>${message}</p>
                <div class="filter-hints">
                    <div class="hint-item ${currentCategory ? 'completed' : ''}">
                        <span class="hint-number">${currentCategory ? '✓' : '1'}</span>
                        <span class="hint-text">Choose a category</span>
                    </div>
                    <div class="hint-item ${currentLanguage ? 'completed' : ''}">
                        <span class="hint-number">${currentLanguage ? '✓' : '2'}</span>
                        <span class="hint-text">Select a language</span>
                    </div>
                    <div class="hint-item">
                        <span class="hint-number">3</span>
                        <span class="hint-text">Browse templates</span>
                    </div>
                </div>
            `;
        }
    }

    // Show templates grid when results found
    function showTemplatesGrid(count) {
        if (emptyState) emptyState.style.display = 'none';
        if (templatesGrid) templatesGrid.style.display = 'block';
        if (templateCardsContainer) templateCardsContainer.style.display = 'grid';
        
        const categoryText = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        const languageText = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
        
        if (resultsTitle) resultsTitle.textContent = `${categoryText} Templates`;
        if (resultsCount) resultsCount.textContent = `${count} template${count > 1 ? 's' : ''} in ${languageText}`;
    }

    // Show no results state when no templates match
    function showNoResultsState() {
        if (emptyState) emptyState.style.display = 'flex';
        if (templatesGrid) templatesGrid.style.display = 'none';
        if (templateCardsContainer) templateCardsContainer.style.display = 'none';
        
        const emptyStateContent = emptyState.querySelector('.empty-state-content');
        if (emptyStateContent) {
            emptyStateContent.innerHTML = `
                <div class="empty-state-icon">😔</div>
                <h3>No templates found</h3>
                <p>We don't have ${currentCategory} templates in ${currentLanguage} yet, but we're working on it!</p>
                <button onclick="resetFilters()" style="
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-top: 1rem;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    🎨 Try Different Filters
                </button>
            `;
        }
    }

    // Event Listeners

    // Category menu button click
    if (categoryMenuBtn) {
        categoryMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Category selection
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const selectedCategory = item.getAttribute('data-category');
            console.log('Category selected:', selectedCategory);
            
            // Update current category
            currentCategory = selectedCategory;
            
            // Update visual states
            categoryItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            
            // Update menu button text
            updateCategoryMenuText(selectedCategory);
            
            // Enable language selector
            updateLanguageSelector();
            
            // Close menu
            closeMenu();
            
            // Filter templates
            filterTemplates();
        });
    });

    // Language selection
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            console.log('Language changed:', currentLanguage);
            
            // Add visual feedback for language selection
            if (currentLanguage) {
                languageSelect.classList.add('selected');
            } else {
                languageSelect.classList.remove('selected');
            }
            
            filterTemplates();
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && categoryDropdown && !categoryDropdown.contains(e.target) && !categoryMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    // Reset filters function
    window.resetFilters = function() {
        currentCategory = '';
        currentLanguage = '';
        
        if (languageSelect) {
            languageSelect.value = '';
            languageSelect.classList.remove('selected');
        }
        
        // Reset category selection
        categoryItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        // Reset menu button text
        updateCategoryMenuText('');
        
        // Update language selector
        updateLanguageSelector();
        
        // Close menu
        closeMenu();
        
        filterTemplates();
    };

    // Use template button functionality
    const useTemplateButtons = document.querySelectorAll('.use-template-btn');
    
    useTemplateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show loading state
            const originalText = button.textContent;
            button.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Loading...';
            button.disabled = true;
            
            // Get template info
            const templateCard = button.closest('.template-card');
            const templateName = templateCard.querySelector('.template-info h4').textContent;
            const templatePreview = templateCard.querySelector('.template-preview');
            const templateId = templatePreview.className.split(' ')[1] || 'default';
            
            // Redirect to template editor with template data
            const templateData = {
                name: templateName,
                id: templateId,
                category: templateCard.getAttribute('data-category'),
                language: templateCard.getAttribute('data-language'),
                timestamp: Date.now()
            };
            
            try {
                // Store template selection in localStorage for editor
                localStorage.setItem('selectedTemplate', JSON.stringify(templateData));
                
                // Add success animation
                button.innerHTML = '✅ Selected!';
                button.style.background = '#28a745';
                
                // Redirect to template editor
                setTimeout(() => {
                    window.location.href = 'template-editor.html';
                }, 800);
                
            } catch (error) {
                console.error('Error storing template data:', error);
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '#dc3545';
                setTimeout(() => {
                    button.style.background = '';
                }, 2000);
                alert('Error loading template. Please try again.');
            }
        });
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .template-hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        .template-visible {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .hint-item.completed {
            color: #28a745;
        }
        
        .hint-item.completed .hint-number {
            background: #28a745;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Initialize with empty state - NO templates should be visible
    console.log('Initializing with empty state - no templates visible');
    showEmptyState();
    updateFilterStatus();
    updateLanguageSelector();
    
    console.log('Top filter bar system initialized successfully - templates are hidden until both filters are selected');
});