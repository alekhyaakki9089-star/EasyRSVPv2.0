// Template filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card');
    const languageSelect = document.getElementById('languageSelect');

    let currentCategory = 'all';
    let currentLanguage = 'all';

    // Category filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            currentCategory = button.getAttribute('data-category');
            filterTemplates();
        });
    });

    // Language filter functionality
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        filterTemplates();
    });

    function filterTemplates() {
        templateCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLanguage = card.getAttribute('data-language');
            
            const categoryMatch = currentCategory === 'all' || cardCategory === currentCategory;
            const languageMatch = currentLanguage === 'all' || cardLanguage === currentLanguage;
            
            if (categoryMatch && languageMatch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Update results count
        updateResultsCount();
    }

    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.template-card:not(.hidden)');
        const totalCards = templateCards.length;
        
        // Create or update results counter
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            document.querySelector('.templates-gallery .container').insertBefore(counter, document.querySelector('.templates-grid'));
        }
        
        counter.textContent = `Showing ${visibleCards.length} of ${totalCards} templates`;
        
        console.log(`Showing ${visibleCards.length} of ${totalCards} templates`);
    }

    // Use template button functionality
    const useTemplateButtons = document.querySelectorAll('.use-template-btn');
    
    useTemplateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get template info
            const templateCard = button.closest('.template-card');
            const templateName = templateCard.querySelector('.template-info h4').textContent;
            const templatePreview = templateCard.querySelector('.template-preview');
            const templateId = templatePreview.getAttribute('data-template') || 'default';
            
            // Redirect to template editor with template data
            const templateData = {
                name: templateName,
                id: templateId,
                category: templateCard.getAttribute('data-category'),
                language: templateCard.getAttribute('data-language')
            };
            
            // Store template selection in localStorage for editor
            localStorage.setItem('selectedTemplate', JSON.stringify(templateData));
            
            // Redirect to template editor
            window.location.href = 'template-editor.html';
        });
    });

    // Add smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation for template cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initially hide cards for animation
    templateCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});