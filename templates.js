// Clean Category Menu filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const templateCards = document.querySelectorAll('.template-card');
    const languageSelect = document.getElementById('languageSelect');

    let currentCategory = 'all';
    let currentLanguage = 'all';

    // Category pill functionality
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            categoryPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            pill.classList.add('active');
            
            // Get selected category
            currentCategory = pill.getAttribute('data-category');
            
            // Filter templates
            filterTemplates();
            
            // Auto-scroll to templates section
            setTimeout(() => {
                const templatesSection = document.querySelector('.templates-gallery');
                if (templatesSection) {
                    templatesSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 100);
        });
    });

    // Language filter functionality
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        filterTemplates();
        
        // Auto-scroll to templates section after filtering
        setTimeout(() => {
            const templatesSection = document.querySelector('.templates-gallery');
            if (templatesSection) {
                templatesSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    });

    // Enhanced filtering function
    function filterTemplates() {
        let visibleCount = 0;
        
        templateCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLanguage = card.getAttribute('data-language');
            
            let categoryMatch = false;
            let languageMatch = false;
            
            // Category matching logic
            if (currentCategory === 'all') {
                categoryMatch = true;
            } else {
                // Simple exact match since we've standardized the categories
                categoryMatch = cardCategory === currentCategory;
            }
            
            // Language matching logic
            languageMatch = currentLanguage === 'all' || cardLanguage === currentLanguage;
            
            // Show/hide cards with smooth animation
            if (categoryMatch && languageMatch) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.animation = 'fadeOutDown 0.3s ease forwards';
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Update results count
        updateResultsCount(visibleCount);
    }

    // Enhanced results counter
    function updateResultsCount(visibleCount) {
        const totalCards = templateCards.length;
        
        // Create or update results counter
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            counter.style.cssText = `
                text-align: center;
                margin: 2rem 0;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.9);
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
        
        // Show appropriate message based on filtering
        if (currentLanguage === 'all' && currentCategory === 'all') {
            counter.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">🎨</span>
                    <span>Showing all ${totalCards} templates</span>
                </div>
            `;
        } else {
            const categoryText = currentCategory !== 'all' ? currentCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
            const languageText = currentLanguage !== 'all' ? ` in ${currentLanguage}` : '';
            
            if (visibleCount > 0) {
                counter.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">✨</span>
                        <span>Showing ${visibleCount} ${categoryText} templates${languageText}</span>
                    </div>
                `;
            } else {
                counter.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">😔</div>
                        <h3 style="color: var(--text-dark); margin-bottom: 1rem;">No templates found</h3>
                        <p style="color: var(--text-light); margin-bottom: 1.5rem;">We don't have ${categoryText} templates${languageText} yet, but we're working on it!</p>
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
                            🎨 Show All Templates
                        </button>
                    </div>
                `;
            }
        }
    }

    // Reset filters function
    window.resetFilters = function() {
        currentCategory = 'all';
        currentLanguage = 'all';
        languageSelect.value = 'all';
        
        // Remove active class from all pills and activate "All Templates"
        categoryPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.getAttribute('data-category') === 'all') {
                pill.classList.add('active');
            }
        });
        
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
        
        @keyframes fadeOutDown {
            from {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
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

    // Initialize with all templates visible
    updateResultsCount(templateCards.length);
});