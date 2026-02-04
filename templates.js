// AND-based filtering functionality - templates shown only when both category and language are selected
document.addEventListener('DOMContentLoaded', function() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const templateCards = document.querySelectorAll('.template-card');
    const languageSelect = document.getElementById('languageSelect');

    let currentCategory = '';
    let currentLanguage = '';

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
                    <span class="metadata-value">${category.replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Event:</span>
                    <span class="metadata-value">${eventName}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Language:</span>
                    <span class="metadata-value">${language.replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
            `;
            
            card.appendChild(overlay);
        });
    }

    // Update category pill text to show selection
    function updateCategoryPillText(pill, category) {
        const icon = pill.querySelector('.pill-icon').textContent;
        const originalText = pill.textContent.replace(icon, '').trim();
        
        if (category) {
            pill.innerHTML = `<span class="pill-icon">${icon}</span>${originalText}`;
        } else {
            pill.innerHTML = `<span class="pill-icon">🎨</span>Select Category`;
        }
    }

    // Show helper message when filters are not complete
    function showHelperMessage() {
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            counter.style.cssText = `
                text-align: center;
                margin: 3rem 0;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                color: var(--primary-color);
                font-weight: 600;
                font-size: 1.2rem;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                border: 2px dashed rgba(99, 102, 241, 0.3);
            `;
            const templatesContainer = document.querySelector('.templates-gallery .container');
            if (templatesContainer) {
                templatesContainer.insertBefore(counter, document.querySelector('.templates-grid'));
            }
        }
        
        const categorySelected = currentCategory ? '✅' : '❌';
        const languageSelected = currentLanguage ? '✅' : '❌';
        
        counter.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                <h3 style="color: var(--text-dark); margin-bottom: 1rem;">Select a category and language to view templates</h3>
                <div style="display: flex; justify-content: center; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: rgba(99, 102, 241, 0.1); border-radius: 25px;">
                        <span style="font-size: 1.5rem;">${categorySelected}</span>
                        <span>Category: ${currentCategory || 'Not selected'}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: rgba(99, 102, 241, 0.1); border-radius: 25px;">
                        <span style="font-size: 1.5rem;">${languageSelected}</span>
                        <span>Language: ${currentLanguage || 'Not selected'}</span>
                    </div>
                </div>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Choose both filters above to discover our beautiful template collection</p>
            </div>
        `;
    }

    // Enhanced results counter
    function updateResultsCount(visibleCount) {
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            counter.style.cssText = `
                text-align: center;
                margin: 2rem 0;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 16px;
                color: var(--primary-color);
                font-weight: 600;
                font-size: 1.1rem;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            `;
            const templatesContainer = document.querySelector('.templates-gallery .container');
            if (templatesContainer) {
                templatesContainer.insertBefore(counter, document.querySelector('.templates-grid'));
            }
        }
        
        if (visibleCount > 0) {
            const categoryText = currentCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const languageText = currentLanguage.replace(/\b\w/g, l => l.toUpperCase());
            
            counter.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">✨</span>
                    <span>Found ${visibleCount} ${categoryText} template${visibleCount > 1 ? 's' : ''} in ${languageText}</span>
                </div>
            `;
        } else if (currentCategory && currentLanguage) {
            const categoryText = currentCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const languageText = currentLanguage.replace(/\b\w/g, l => l.toUpperCase());
            
            counter.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">😔</div>
                    <h3 style="color: var(--text-dark); margin-bottom: 1rem;">No templates found</h3>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">We don't have ${categoryText} templates in ${languageText} yet, but we're working on it!</p>
                    <button onclick="resetFilters()" style="
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        🎨 Try Different Filters
                    </button>
                </div>
            `;
        }
    }

    // AND-based filtering function - both category and language must be selected
    function filterTemplates() {
        console.log('Filtering with:', { currentCategory, currentLanguage });
        let visibleCount = 0;
        
        // Hide all templates initially
        templateCards.forEach(card => {
            card.style.display = 'none';
            card.classList.add('hidden');
        });

        // Check if both filters are selected
        if (!currentCategory || !currentLanguage) {
            showHelperMessage();
            return;
        }

        // Show templates that match BOTH category AND language
        templateCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLanguage = card.getAttribute('data-language');
            
            if (cardCategory === currentCategory && cardLanguage === currentLanguage) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
                visibleCount++;
            }
        });

        // Update results count
        updateResultsCount(visibleCount);
    }

    // Initialize metadata overlays
    addMetadataOverlays();

    // Category pill functionality
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            console.log('Category clicked:', pill.getAttribute('data-category'));
            // Remove active class from all pills
            categoryPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            pill.classList.add('active');
            
            // Get selected category
            currentCategory = pill.getAttribute('data-category');
            
            // Update pill text to show selection
            updateCategoryPillText(pill, currentCategory);
            
            // Filter templates
            filterTemplates();
        });
    });

    // Language filter functionality
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        console.log('Language changed:', currentLanguage);
        filterTemplates();
    });

    // AND-based filtering function - both category and language must be selected
    function filterTemplates() {
        let visibleCount = 0;
        
        // Hide all templates initially
        templateCards.forEach(card => {
            card.style.display = 'none';
            card.classList.add('hidden');
        });

    // Reset filters function
    window.resetFilters = function() {
        currentCategory = '';
        currentLanguage = '';
        languageSelect.value = '';
        
        // Remove active class from all pills and reset first pill
        categoryPills.forEach(pill => {
            pill.classList.remove('active');
        });
        
        // Reset first pill text
        const firstPill = categoryPills[0];
        if (firstPill) {
            firstPill.innerHTML = `<span class="pill-icon">🎨</span>Select Category`;
        }
        
        filterTemplates();
    };

    // Use template button functionality (enhanced)
    const useTemplateButtons = document.querySelectorAll('.use-template-btn');
    
    useTemplateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show loading state with animation
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
                button.style.background = 'var(--success-color)';
                
                // Add a small delay for better UX
                setTimeout(() => {
                    // Redirect to template editor
                    window.location.href = 'template-editor.html';
                }, 800);
                
            } catch (error) {
                console.error('Error storing template data:', error);
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = 'var(--error-color)';
                setTimeout(() => {
                    button.style.background = 'var(--primary-color)';
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
        
        .template-card.hidden {
            pointer-events: none;
        }
        
        .category-pill {
            position: relative;
            overflow: hidden;
        }
        
        .category-pill::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
        }
        
        .category-pill:hover::before {
            left: 100%;
        }
    `;
    document.head.appendChild(style);

    // Initialize with helper message
    showHelperMessage();
});