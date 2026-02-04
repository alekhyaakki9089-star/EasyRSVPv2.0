// Left Sidebar Layout - templates shown only when both category and language are selected
document.addEventListener('DOMContentLoaded', function() {
    console.log('Templates.js loaded - initializing left sidebar system');
    
    // Get DOM elements
    const categoryItems = document.querySelectorAll('.category-item');
    const subcategoryItems = document.querySelectorAll('.subcategory-item');
    const languageSelect = document.getElementById('languageSelect');
    const templateCards = document.querySelectorAll('.template-card');
    const emptyState = document.getElementById('emptyState');
    const templatesGrid = document.getElementById('templatesGrid');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    const templateCardsContainer = document.querySelector('.template-cards-container');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    const showCategoriesBtn = document.getElementById('showCategoriesBtn');
    const categoriesHeader = document.getElementById('categoriesHeader');
    const sidebarToggleArrow = document.getElementById('sidebarToggleArrow');
    const resetBtn = document.getElementById('resetBtn');
    const templatesSidebar = document.querySelector('.templates-sidebar');
    const templatesWrapper = document.querySelector('.templates-wrapper');
    
    // Get all subcategory containers
    const subcategoryContainers = {
        'festivals': document.getElementById('festivals-subcategories'),
        'wedding': document.getElementById('wedding-subcategories'),
        'parties': document.getElementById('parties-subcategories'),
        'business': document.getElementById('business-subcategories'),
        'baby': document.getElementById('baby-subcategories')
    };

    console.log('Found elements:', {
        categoryItems: categoryItems.length,
        subcategoryItems: subcategoryItems.length,
        templateCards: templateCards.length,
        languageSelect: languageSelect ? 'found' : 'not found',
        subcategoryContainers: Object.keys(subcategoryContainers).length,
        showCategoriesBtn: showCategoriesBtn ? 'found' : 'not found',
        categoriesHeader: categoriesHeader ? 'found' : 'not found',
        resetBtn: resetBtn ? 'found' : 'not found',
        templatesSidebar: templatesSidebar ? 'found' : 'not found'
    });

    // Debug: Log subcategory containers
    Object.entries(subcategoryContainers).forEach(([key, container]) => {
        console.log(`Subcategory container ${key}:`, container ? 'found' : 'not found');
    });

    let sidebarVisible = false;

    let currentCategory = '';
    let currentSubcategory = '';
    let currentLanguage = '';

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

    // Strict filtering function - ONLY show templates when BOTH filters are selected
    function filterTemplates() {
        console.log('filterTemplates called with:', { currentCategory, currentSubcategory, currentLanguage });
        
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

        // Check if BOTH category and language are selected
        if (!currentCategory || !currentLanguage) {
            console.log('Both filters not selected, showing empty state');
            showEmptyState();
            return;
        }

        console.log('Both filters selected, filtering templates...');

        // Show templates that match category AND language
        let visibleCount = 0;
        templateCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLanguage = card.getAttribute('data-language');
            
            let matchCategory = cardCategory === currentCategory;
            
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
                <h3>No templates found for ${currentCategory} in ${currentLanguage}</h3>
            `;
        }
    }

    // Toggle subcategory visibility
    function toggleSubcategories(categoryItem, subcategoryContainer) {
        const isExpanded = categoryItem.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            categoryItem.classList.remove('expanded');
            subcategoryContainer.classList.remove('expanded');
            categoryItem.setAttribute('aria-expanded', 'false');
            console.log('Collapsed subcategories');
        } else {
            // Expand
            categoryItem.classList.add('expanded');
            subcategoryContainer.classList.add('expanded');
            categoryItem.setAttribute('aria-expanded', 'true');
            console.log('Expanded subcategories');
        }
    }

    // Category selection functionality
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const selectedCategory = item.getAttribute('data-category');
            const isExpandable = item.classList.contains('expandable');
            
            console.log('Category clicked:', selectedCategory, 'expandable:', isExpandable);
            
            if (isExpandable) {
                // Handle expand/collapse for expandable categories
                e.preventDefault();
                const subcategoryContainer = subcategoryContainers[selectedCategory];
                if (subcategoryContainer) {
                    toggleSubcategories(item, subcategoryContainer);
                }
                
                // Don't set as active category, just toggle expansion
                return;
            }
            
            // Regular category selection (for non-expandable categories)
            // Remove active class from all category items
            categoryItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Update current category
            currentCategory = selectedCategory;
            
            // Collapse all subcategories when another category is selected
            Object.entries(subcategoryContainers).forEach(([key, container]) => {
                if (container && key !== selectedCategory) {
                    const categoryItem = document.querySelector(`[data-category="${key}"].expandable`);
                    if (categoryItem) {
                        categoryItem.classList.remove('expanded');
                        categoryItem.setAttribute('aria-expanded', 'false');
                    }
                    container.classList.remove('expanded');
                }
            });
            
            // Clear subcategory selection
            subcategoryItems.forEach(sub => sub.classList.remove('active'));
            currentSubcategory = '';
            
            // Filter templates
            filterTemplates();
        });
    });

    // Keyboard support for expand/collapse
    categoryItems.forEach(item => {
        item.addEventListener('keydown', (e) => {
            const isExpandable = item.classList.contains('expandable');
            const selectedCategory = item.getAttribute('data-category');
            
            if (isExpandable) {
                const subcategoryContainer = subcategoryContainers[selectedCategory];
                if (subcategoryContainer) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSubcategories(item, subcategoryContainer);
                    } else if (e.key === 'ArrowRight' || e.key === '+') {
                        e.preventDefault();
                        item.classList.add('expanded');
                        item.setAttribute('aria-expanded', 'true');
                        subcategoryContainer.classList.add('expanded');
                    } else if (e.key === 'ArrowLeft' || e.key === '-') {
                        e.preventDefault();
                        item.classList.remove('expanded');
                        item.setAttribute('aria-expanded', 'false');
                        subcategoryContainer.classList.remove('expanded');
                    }
                }
            }
        });
    });
    subcategoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const selectedSubcategory = item.getAttribute('data-subcategory');
            const selectedCategory = item.getAttribute('data-category');
            console.log('Subcategory clicked:', selectedSubcategory);
            
            // Remove active class from all subcategory items
            subcategoryItems.forEach(i => i.classList.remove('active'));
            
            // Remove active class from all category items
            categoryItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked subcategory item
            item.classList.add('active');
            
            // Mark parent category as active but keep it expanded
            const parentCategory = item.getAttribute('data-category');
            const parentCategoryItem = document.querySelector(`[data-category="${parentCategory}"].expandable`);
            if (parentCategoryItem) {
                parentCategoryItem.classList.add('active', 'expanded');
                parentCategoryItem.setAttribute('aria-expanded', 'true');
            }
            
            // Ensure subcategories remain visible
            const subcategoryContainer = subcategoryContainers[parentCategory];
            if (subcategoryContainer) {
                subcategoryContainer.classList.add('expanded');
            }
            
            // Update current selections
            currentSubcategory = selectedSubcategory;
            currentCategory = selectedCategory; // Use the category from subcategory
            
            // Filter templates
            filterTemplates();
        });
    });

    // Get elements
    // Show categories button click
    if (showCategoriesBtn && templatesSidebar && templatesWrapper) {
        showCategoriesBtn.addEventListener('click', () => {
            // Show sidebar
            templatesSidebar.classList.add('visible');
            templatesWrapper.classList.remove('sidebar-hidden');
            showCategoriesBtn.style.display = 'none';
            sidebarVisible = true;
            console.log('Sidebar shown');
        });
    }

    // Categories header click to hide sidebar
    if (categoriesHeader && templatesSidebar && templatesWrapper && showCategoriesBtn) {
        categoriesHeader.addEventListener('click', () => {
            // Hide sidebar
            templatesSidebar.classList.remove('visible');
            templatesWrapper.classList.add('sidebar-hidden');
            showCategoriesBtn.style.display = 'block';
            sidebarVisible = false;
            console.log('Sidebar hidden via header click');
        });
    }

    // Reset button functionality
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            console.log('Reset button clicked');
            
            // Add loading state
            const originalText = resetBtn.querySelector('.reset-text').textContent;
            resetBtn.querySelector('.reset-text').textContent = 'Resetting...';
            resetBtn.disabled = true;
            resetBtn.style.opacity = '0.7';
            
            // Clear all selections
            currentCategory = '';
            currentSubcategory = '';
            currentLanguage = '';
            
            // Reset language dropdown
            if (languageSelect) {
                languageSelect.value = '';
                languageSelect.classList.remove('selected');
            }
            
            // Reset all category items
            categoryItems.forEach(item => {
                item.classList.remove('active', 'expanded');
                item.setAttribute('aria-expanded', 'false');
            });
            
            // Reset all subcategory items
            subcategoryItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Collapse all subcategory containers and reset arrows
            Object.entries(subcategoryContainers).forEach(([key, container]) => {
                if (container) {
                    container.classList.remove('expanded');
                    // Reset the parent category arrow
                    const parentCategory = document.querySelector(`[data-category="${key}"].expandable`);
                    if (parentCategory) {
                        parentCategory.classList.remove('expanded');
                        parentCategory.setAttribute('aria-expanded', 'false');
                        const arrow = parentCategory.querySelector('.expand-arrow');
                        if (arrow) {
                            arrow.textContent = '▼';
                        }
                    }
                }
            });
            
            // Hide all templates and show empty state
            templateCards.forEach(card => {
                card.style.display = 'none';
                card.style.visibility = 'hidden';
                card.classList.add('template-hidden');
                card.classList.remove('template-visible');
            });
            
            // Show empty state
            showEmptyState();
            
            // Reset button state after a short delay
            setTimeout(() => {
                resetBtn.querySelector('.reset-text').textContent = originalText;
                resetBtn.disabled = false;
                resetBtn.style.opacity = '1';
                console.log('All selections reset');
            }, 500);
        });
    }

    // Initialize with sidebar VISIBLE on page load (revert to original behavior)
    if (templatesWrapper && templatesSidebar && showCategoriesBtn) {
        templatesWrapper.classList.remove('sidebar-hidden');
        templatesSidebar.classList.add('visible');
        showCategoriesBtn.style.display = 'none';
        sidebarVisible = true;
        console.log('Sidebar initialized as visible on page load');
    }

    // Collapse all categories functionality
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
            console.log('Collapse all clicked');
            
            // Collapse all expandable categories
            categoryItems.forEach(item => {
                if (item.classList.contains('expandable')) {
                    item.classList.remove('expanded', 'active');
                    item.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Hide all subcategory containers
            Object.values(subcategoryContainers).forEach(container => {
                if (container) {
                    container.classList.remove('expanded');
                }
            });
            
            // Clear selections
            subcategoryItems.forEach(sub => sub.classList.remove('active'));
            currentCategory = '';
            currentSubcategory = '';
            
            // Show empty state
            showEmptyState();
        });
    }

    // Language selection functionality
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
    `;
    document.head.appendChild(style);

    // Initialize with empty state - NO templates should be visible
    console.log('Initializing with empty state - no templates visible');
    showEmptyState();
    
    console.log('Left sidebar system initialized successfully - templates are hidden until both filters are selected');
});