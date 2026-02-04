// Template Editor JavaScript

class TemplateEditor {
    constructor() {
        this.currentTemplate = {
            title: 'Sarah & John\'s Wedding',
            subtitle: 'Request the pleasure of your company',
            date: '2026-06-15',
            time: '15:00',
            venue: 'Garden Manor',
            description: 'Join us for a beautiful celebration of love in our garden venue.',
            theme: 'elegant',
            primaryColor: '#d4af37',
            fontFamily: 'Inter',
            language: 'english',
            background: 'gradient'
        };
        
        this.history = [];
        this.historyIndex = -1;
        this.zoom = 100;
        
        this.init();
    }
    
    init() {
        this.loadSelectedTemplate();
        this.bindEvents();
        this.updatePreview();
        this.saveState();
    }
    
    loadSelectedTemplate() {
        const selectedTemplate = localStorage.getItem('selectedTemplate');
        if (selectedTemplate) {
            try {
                const templateData = JSON.parse(selectedTemplate);
                
                // Update template based on selection
                if (templateData.language && templateData.language !== 'english') {
                    this.currentTemplate.language = templateData.language;
                    this.updateTemplateForLanguage(templateData.language);
                }
                
                if (templateData.category) {
                    this.updateTemplateForCategory(templateData.category);
                }
                
                // Update template name if provided
                if (templateData.name) {
                    this.currentTemplate.title = templateData.name;
                }
                
                // Clear the selection after loading
                localStorage.removeItem('selectedTemplate');
                
                // Show notification
                this.showNotification(`Template "${templateData.name || 'Selected'}" loaded successfully!`);
                
            } catch (error) {
                console.error('Error loading selected template:', error);
                this.showNotification('Error loading template. Using default template.');
            }
        }
    }
    
    updateTemplateForLanguage(language) {
        const translations = {
            telugu: {
                title: 'సారా & జాన్ వివాహం',
                subtitle: 'మీ సన్నిధిని కోరుతున్నాము',
                venue: 'గార్డెన్ మేనర్',
                description: 'మా తోట వేదికలో ప్రేమ యొక్క అందమైన వేడుకలో మాతో చేరండి.'
            },
            hindi: {
                title: 'सारा और जॉन का विवाह',
                subtitle: 'आपकी उपस्थिति का सम्मान करते हैं',
                venue: 'गार्डन मेनर',
                description: 'हमारे बगीचे के स्थान पर प्रेम के एक सुंदर उत्सव में हमारे साथ शामिल हों।'
            },
            gujarati: {
                title: 'સારા અને જોનનાં લગ્ન',
                subtitle: 'તમારી હાજરીનું સન્માન કરીએ છીએ',
                venue: 'ગાર્ડન મેનર',
                description: 'અમારા બગીચાના સ્થળે પ્રેમની સુંદર ઉજવણીમાં અમારી સાથે જોડાઓ।'
            },
            tamil: {
                title: 'சாரா & ஜான் திருமணம்',
                subtitle: 'உங்கள் வருகையை கேட்டுக்கொள்கிறோம்',
                venue: 'கார்டன் மேனர்',
                description: 'எங்கள் தோட்ட இடத்தில் அன்பின் அழகான கொண்டாட்டத்தில் எங்களுடன் சேருங்கள்.'
            }
        };
        
        if (translations[language]) {
            Object.assign(this.currentTemplate, translations[language]);
        }
    }
    
    updateTemplateForCategory(category) {
        const categoryTemplates = {
            party: {
                title: 'Birthday Celebration',
                subtitle: 'Join us for an amazing party',
                venue: 'Party Central',
                description: 'Come celebrate with music, food, and great company!',
                primaryColor: '#ff6b6b'
            },
            corporate: {
                title: 'Annual Conference 2026',
                subtitle: 'Innovation & Growth Summit',
                venue: 'Convention Center',
                description: 'Join industry leaders for networking and insights.',
                primaryColor: '#2c3e50'
            },
            baby: {
                title: 'Baby Shower',
                subtitle: 'Celebrating our little miracle',
                venue: 'Garden Cafe',
                description: 'Join us as we welcome our bundle of joy!',
                primaryColor: '#feca57'
            }
        };
        
        if (categoryTemplates[category]) {
            Object.assign(this.currentTemplate, categoryTemplates[category]);
        }
    }
    
    bindEvents() {
        // Form inputs
        document.getElementById('eventTitle').addEventListener('input', (e) => {
            this.updateField('title', e.target.value);
        });
        
        document.getElementById('eventSubtitle').addEventListener('input', (e) => {
            this.updateField('subtitle', e.target.value);
        });
        
        document.getElementById('eventDate').addEventListener('change', (e) => {
            this.updateField('date', e.target.value);
        });
        
        document.getElementById('eventTime').addEventListener('change', (e) => {
            this.updateField('time', e.target.value);
        });
        
        document.getElementById('eventVenue').addEventListener('input', (e) => {
            this.updateField('venue', e.target.value);
        });
        
        document.getElementById('eventDescription').addEventListener('input', (e) => {
            this.updateField('description', e.target.value);
        });
        
        document.getElementById('templateTheme').addEventListener('change', (e) => {
            this.updateField('theme', e.target.value);
        });
        
        document.getElementById('primaryColor').addEventListener('change', (e) => {
            this.updateField('primaryColor', e.target.value);
        });
        
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.updateField('fontFamily', e.target.value);
        });
        
        document.getElementById('templateLanguage').addEventListener('change', (e) => {
            this.updateField('language', e.target.value);
        });
        
        // Color presets
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                document.getElementById('primaryColor').value = color;
                this.updateField('primaryColor', color);
            });
        });
        
        // Background options
        document.querySelectorAll('.bg-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.bg-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
                this.updateField('background', e.target.dataset.bg);
                
                if (e.target.dataset.bg === 'upload') {
                    document.getElementById('backgroundUpload').click();
                }
            });
        });
        
        // Background upload
        document.getElementById('backgroundUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.updateBackgroundImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Toolbar buttons
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.showPreview();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveTemplate();
        });
        
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendInvites();
        });
        
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.changeZoom(10);
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            this.changeZoom(-10);
        });
        
        // Undo/Redo
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });
        
        document.getElementById('redoBtn').addEventListener('click', () => {
            this.redo();
        });
        
        // Tool buttons
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchTool(e.target.dataset.tool);
            });
        });
        
        // Elements
        document.querySelectorAll('.element-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.addElement(e.currentTarget.dataset.element);
            });
        });
        
        // Stock images
        document.querySelectorAll('.stock-image').forEach(img => {
            img.addEventListener('click', (e) => {
                this.addStockImage(e.currentTarget.dataset.image);
            });
        });
        
        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.textContent.trim());
            });
        });
        
        // Modal controls
        document.getElementById('closePreview').addEventListener('click', () => {
            this.hidePreview();
        });
        
        document.getElementById('closePreview2').addEventListener('click', () => {
            this.hidePreview();
        });
        
        document.getElementById('sendInvites').addEventListener('click', () => {
            this.sendInvites();
        });
        
        // Preview tabs
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.switchPreviewMode(e.target.dataset.tab);
            });
        });
        
        // Editable content
        document.querySelectorAll('.editable').forEach(element => {
            element.addEventListener('input', (e) => {
                this.handleDirectEdit(e.target);
            });
        });
    }
    
    updateField(field, value) {
        this.currentTemplate[field] = value;
        this.updatePreview();
        this.saveState();
    }
    
    updatePreview() {
        const card = document.getElementById('invitationCard');
        const content = card.querySelector('.card-content');
        
        // Update text content
        content.querySelector('.event-title').textContent = this.currentTemplate.title;
        content.querySelector('.event-subtitle').textContent = this.currentTemplate.subtitle;
        content.querySelector('.event-venue').textContent = this.currentTemplate.venue;
        content.querySelector('.event-description').textContent = this.currentTemplate.description;
        
        // Format date and time
        const date = new Date(this.currentTemplate.date + 'T' + this.currentTemplate.time);
        content.querySelector('.event-date').textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        content.querySelector('.event-time').textContent = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        // Update styling
        this.updateTheme();
        this.updateColors();
        this.updateFont();
        this.updateLanguage();
    }
    
    updateTheme() {
        const card = document.getElementById('invitationCard');
        const themes = {
            elegant: 'linear-gradient(135deg, #d4af37, #f4e4bc)',
            modern: 'linear-gradient(135deg, #2c3e50, #34495e)',
            vintage: 'linear-gradient(135deg, #8b4513, #daa520)',
            floral: 'linear-gradient(135deg, #ff6b6b, #feca57)',
            rustic: 'linear-gradient(135deg, #8b4513, #cd853f)'
        };
        
        card.style.background = themes[this.currentTemplate.theme] || themes.elegant;
    }
    
    updateColors() {
        const card = document.getElementById('invitationCard');
        const color = this.currentTemplate.primaryColor;
        
        // Create gradient with primary color
        const rgb = this.hexToRgb(color);
        const lightColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        
        card.style.background = `linear-gradient(135deg, ${color}, ${lightColor})`;
    }
    
    updateFont() {
        const card = document.getElementById('invitationCard');
        card.style.fontFamily = this.currentTemplate.fontFamily;
        
        // Load Google Font if needed
        if (!document.querySelector(`link[href*="${this.currentTemplate.fontFamily}"]`)) {
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${this.currentTemplate.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }
    
    updateLanguage() {
        const language = this.currentTemplate.language;
        const translations = {
            english: {
                rsvp: 'RSVP'
            },
            telugu: {
                rsvp: 'హాజరు'
            },
            hindi: {
                rsvp: 'उपस्थिति'
            },
            gujarati: {
                rsvp: 'હાજરી'
            },
            tamil: {
                rsvp: 'வருகை'
            }
        };
        
        const rsvpBtn = document.querySelector('.rsvp-button');
        rsvpBtn.textContent = translations[language]?.rsvp || 'RSVP';
    }
    
    updateBackgroundImage(imageUrl) {
        const card = document.getElementById('invitationCard');
        card.style.backgroundImage = `url(${imageUrl})`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
    }
    
    changeZoom(delta) {
        this.zoom = Math.max(50, Math.min(200, this.zoom + delta));
        document.getElementById('zoomLevel').textContent = this.zoom + '%';
        
        const preview = document.querySelector('.template-preview');
        preview.style.transform = `scale(${this.zoom / 100})`;
    }
    
    switchTool(tool) {
        const canvas = document.getElementById('templateCanvas');
        canvas.className = `template-canvas tool-${tool}`;
        
        if (tool === 'mobile') {
            document.querySelector('.invitation-card').style.width = '300px';
            document.querySelector('.invitation-card').style.height = '500px';
        } else {
            document.querySelector('.invitation-card').style.width = '400px';
            document.querySelector('.invitation-card').style.height = '600px';
        }
    }
    
    addElement(elementType) {
        const elements = {
            text: () => this.addTextElement(),
            image: () => this.addImageElement(),
            shape: () => this.addShapeElement(),
            icon: () => this.addIconElement(),
            border: () => this.addBorderElement(),
            pattern: () => this.addPatternElement()
        };
        
        if (elements[elementType]) {
            elements[elementType]();
            this.saveState();
        }
    }
    
    addTextElement() {
        const card = document.querySelector('.card-content');
        const textElement = document.createElement('div');
        textElement.className = 'custom-text editable';
        textElement.contentEditable = true;
        textElement.textContent = 'New Text';
        textElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            cursor: move;
            padding: 8px;
            border: 2px dashed rgba(255,255,255,0.5);
        `;
        
        card.appendChild(textElement);
        this.makeDraggable(textElement);
    }
    
    addImageElement() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const card = document.querySelector('.card-content');
                    const imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                    imgElement.className = 'custom-image';
                    imgElement.style.cssText = `
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        width: 60px;
                        height: 60px;
                        object-fit: cover;
                        border-radius: 50%;
                        cursor: move;
                        border: 2px solid rgba(255,255,255,0.5);
                    `;
                    
                    card.appendChild(imgElement);
                    this.makeDraggable(imgElement);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
    
    addShapeElement() {
        const card = document.querySelector('.card-content');
        const shape = document.createElement('div');
        shape.className = 'custom-shape';
        shape.style.cssText = `
            position: absolute;
            top: 30px;
            left: 30px;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            cursor: move;
            border: 2px solid rgba(255,255,255,0.5);
        `;
        
        card.appendChild(shape);
        this.makeDraggable(shape);
    }
    
    addIconElement() {
        const icons = ['⭐', '💖', '🌸', '🎉', '💍', '🥂'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        const card = document.querySelector('.card-content');
        const iconElement = document.createElement('div');
        iconElement.className = 'custom-icon';
        iconElement.textContent = randomIcon;
        iconElement.style.cssText = `
            position: absolute;
            top: 40px;
            right: 40px;
            font-size: 2rem;
            cursor: move;
            opacity: 0.7;
        `;
        
        card.appendChild(iconElement);
        this.makeDraggable(iconElement);
    }
    
    addBorderElement() {
        const card = document.getElementById('invitationCard');
        card.style.border = '4px solid rgba(255,255,255,0.3)';
        card.style.borderRadius = '12px';
    }
    
    addPatternElement() {
        const card = document.getElementById('invitationCard');
        const pattern = `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `;
        card.style.backgroundImage = pattern;
    }
    
    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left) || 0;
            startTop = parseInt(element.style.top) || 0;
            element.style.zIndex = 1000;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            element.style.left = (startLeft + deltaX) + 'px';
            element.style.top = (startTop + deltaY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.zIndex = 'auto';
                this.saveState();
            }
        });
    }
    
    handleQuickAction(action) {
        const actions = {
            '📋 Copy Template': () => this.copyTemplate(),
            '📤 Export PDF': () => this.exportPDF(),
            '🔗 Get Share Link': () => this.getShareLink(),
            '📊 View Analytics': () => this.viewAnalytics()
        };
        
        const actionKey = Object.keys(actions).find(key => action.includes(key.split(' ')[1]));
        if (actionKey && actions[actionKey]) {
            actions[actionKey]();
        }
    }
    
    copyTemplate() {
        const templateData = JSON.stringify(this.currentTemplate);
        navigator.clipboard.writeText(templateData).then(() => {
            this.showNotification('Template copied to clipboard!');
        });
    }
    
    exportPDF() {
        this.showNotification('PDF export feature coming soon!');
        // In production, this would generate a PDF
    }
    
    getShareLink() {
        const shareUrl = `${window.location.origin}/invitation/${Date.now()}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showNotification('Share link copied to clipboard!');
        });
    }
    
    viewAnalytics() {
        this.showNotification('Analytics dashboard coming soon!');
        // In production, this would show analytics
    }
    
    showPreview() {
        const modal = document.getElementById('previewModal');
        modal.classList.add('show');
        
        const previewContent = document.getElementById('previewContent');
        const cardClone = document.getElementById('invitationCard').cloneNode(true);
        previewContent.innerHTML = '';
        previewContent.appendChild(cardClone);
    }
    
    hidePreview() {
        const modal = document.getElementById('previewModal');
        modal.classList.remove('show');
    }
    
    switchPreviewMode(mode) {
        const previewContent = document.getElementById('previewContent');
        const card = previewContent.querySelector('.invitation-card');
        
        if (card) {
            switch (mode) {
                case 'desktop':
                    card.style.width = '400px';
                    card.style.height = '600px';
                    break;
                case 'mobile':
                    card.style.width = '300px';
                    card.style.height = '500px';
                    break;
                case 'email':
                    card.style.width = '350px';
                    card.style.height = '550px';
                    break;
            }
        }
    }
    
    async saveTemplate() {
        const invitationData = await this.saveInvitation();
        if (invitationData) {
            this.showNotification(`Invitation saved! ID: ${invitationData.id}`);
            
            // Update the send button to show share options
            document.getElementById('sendBtn').textContent = '🔗 Share Invitation';
            document.getElementById('sendBtn').onclick = () => this.showShareOptions(invitationData);
        }
    }
    
    showShareOptions(invitationData) {
        const shareUrl = `${window.location.origin}/invitation.html?id=${invitationData.id}`;
        const rsvpUrl = `${window.location.origin}/rsvp.html?id=${invitationData.id}`;
        const message = `🎉 You're invited to ${invitationData.title}!\n\nView invitation: ${shareUrl}\nRSVP here: ${rsvpUrl}`;
        
        // Create share modal
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📤 Share Your Invitation</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Email Invitations Section -->
                    <div class="share-option">
                        <h4>📧 Send Email Invitations</h4>
                        <p>Send personalized email invitations directly to your guests</p>
                        <div class="email-section">
                            <div class="email-status" id="emailStatus">
                                <p>Checking email service...</p>
                            </div>
                            <div class="email-form" id="emailForm" style="display: none;">
                                <div class="form-group">
                                    <label>Guest Emails (one per line):</label>
                                    <textarea id="guestEmails" placeholder="john@example.com&#10;jane@example.com&#10;guest@example.com" rows="4" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ddd;"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>
                                        <input type="checkbox" id="sendToHost" checked> 
                                        Send copy to myself
                                    </label>
                                </div>
                                <button class="btn primary" onclick="sendEmailInvitations('${invitationData.id}')">📧 Send Email Invitations</button>
                                <div id="emailResults"></div>
                            </div>
                            <div class="email-setup" id="emailSetup" style="display: none;">
                                <p>⚠️ Email service not configured</p>
                                <a href="email-setup.html" target="_blank" class="btn secondary">⚙️ Setup Email Service</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="divider" style="margin: 20px 0; border-top: 1px solid #eee;"></div>
                    
                    <div class="share-option">
                        <h4>👀 Preview Invitation</h4>
                        <p>See how your invitation looks to guests</p>
                        <a href="${shareUrl}" target="_blank" class="btn primary">View Invitation</a>
                    </div>
                    <div class="share-option">
                        <h4>🔗 Invitation Link</h4>
                        <p>Share this link so guests can view the invitation</p>
                        <div class="share-link-container">
                            <input type="text" value="${shareUrl}" readonly class="share-link-input">
                            <button class="btn secondary" onclick="navigator.clipboard.writeText('${shareUrl}').then(() => alert('Invitation link copied!'))">Copy</button>
                        </div>
                    </div>
                    <div class="share-option">
                        <h4>📝 RSVP Link</h4>
                        <p>Direct link for guests to RSVP</p>
                        <div class="share-link-container">
                            <input type="text" value="${rsvpUrl}" readonly class="share-link-input">
                            <button class="btn secondary" onclick="navigator.clipboard.writeText('${rsvpUrl}').then(() => alert('RSVP link copied!'))">Copy</button>
                        </div>
                    </div>
                    <div class="share-option">
                        <h4>📱 Social Media</h4>
                        <p>Share on your favorite social platforms</p>
                        <div class="social-buttons">
                            <button class="btn social whatsapp" onclick="window.open('https://wa.me/?text=${encodeURIComponent(message)}')">WhatsApp</button>
                            <button class="btn social facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}')">Facebook</button>
                            <button class="btn social twitter" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}')">Twitter</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Check email service status
        setTimeout(() => {
            this.checkEmailServiceStatus();
        }, 100);
    }
    
    async sendInvites() {
        // First save the invitation
        const invitationData = await this.saveInvitation();
        if (invitationData) {
            this.showShareOptions(invitationData);
        }
    }
    
    handleDirectEdit(element) {
        const field = element.className.includes('event-title') ? 'title' :
                     element.className.includes('event-subtitle') ? 'subtitle' :
                     element.className.includes('event-venue') ? 'venue' :
                     element.className.includes('event-description') ? 'description' : null;
        
        if (field) {
            this.currentTemplate[field] = element.textContent;
            this.saveState();
        }
    }
    
    saveState() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.parse(JSON.stringify(this.currentTemplate)));
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentTemplate = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.updateFormFields();
            this.updatePreview();
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentTemplate = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.updateFormFields();
            this.updatePreview();
        }
    }
    
    updateFormFields() {
        document.getElementById('eventTitle').value = this.currentTemplate.title;
        document.getElementById('eventSubtitle').value = this.currentTemplate.subtitle;
        document.getElementById('eventDate').value = this.currentTemplate.date;
        document.getElementById('eventTime').value = this.currentTemplate.time;
        document.getElementById('eventVenue').value = this.currentTemplate.venue;
        document.getElementById('eventDescription').value = this.currentTemplate.description;
        document.getElementById('templateTheme').value = this.currentTemplate.theme;
        document.getElementById('primaryColor').value = this.currentTemplate.primaryColor;
        document.getElementById('fontFamily').value = this.currentTemplate.fontFamily;
        document.getElementById('templateLanguage').value = this.currentTemplate.language;
    }
    
    // Generate unique invitation ID
    generateInvitationId() {
        return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Save invitation data
    async saveInvitation() {
        // Update currentTemplate with current form values before saving
        this.currentTemplate.title = document.getElementById('eventTitle').value || this.currentTemplate.title;
        this.currentTemplate.subtitle = document.getElementById('eventSubtitle').value || this.currentTemplate.subtitle;
        this.currentTemplate.date = document.getElementById('eventDate').value || this.currentTemplate.date;
        this.currentTemplate.time = document.getElementById('eventTime').value || this.currentTemplate.time;
        this.currentTemplate.venue = document.getElementById('eventVenue').value || this.currentTemplate.venue;
        this.currentTemplate.description = document.getElementById('eventDescription').value || this.currentTemplate.description;
        this.currentTemplate.theme = document.getElementById('templateTheme').value || this.currentTemplate.theme;
        this.currentTemplate.primaryColor = document.getElementById('primaryColor').value || this.currentTemplate.primaryColor;
        this.currentTemplate.fontFamily = document.getElementById('fontFamily').value || this.currentTemplate.fontFamily;
        this.currentTemplate.language = document.getElementById('templateLanguage')?.value || this.currentTemplate.language;
        
        // Validate required fields
        if (!this.currentTemplate.title || this.currentTemplate.title.trim() === '') {
            this.showNotification('Please enter an event title before saving.', 'error');
            return null;
        }
        
        if (!this.currentTemplate.date) {
            this.showNotification('Please select an event date before saving.', 'error');
            return null;
        }
        
        if (!this.currentTemplate.venue || this.currentTemplate.venue.trim() === '') {
            this.showNotification('Please enter a venue before saving.', 'error');
            return null;
        }
        
        const invitationId = this.generateInvitationId();
        const invitationData = {
            id: invitationId,
            ...this.currentTemplate,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            status: 'draft',
            shareUrl: `${window.location.origin}/rsvp.html?id=${invitationId}`,
            invitationUrl: `${window.location.origin}/invitation.html?id=${invitationId}`
        };
        
        try {
            // Wait for Supabase database to be ready
            let attempts = 0;
            while (!window.easyrsvpDB && attempts < 50) {
                console.log('⏳ Waiting for database to initialize...');
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.easyrsvpDB) {
                console.error('❌ Database not available after waiting');
                this.showNotification('Database not available. Please refresh the page.', 'error');
                return null;
            }

            console.log('💾 Saving invitation to Supabase...', invitationData);
            
            // Save to Supabase database
            const { data, error } = await window.easyrsvpDB.saveInvitation(invitationData);
            
            if (error) {
                console.error('❌ Supabase error:', error);
                this.showNotification('Error saving invitation: ' + error.message, 'error');
                return null;
            }
            
            console.log('✅ Invitation saved successfully:', data);
            this.showNotification('Invitation saved to database successfully!', 'success');
            return data;
            
        } catch (error) {
            console.error('❌ Save invitation error:', error);
            
            // Fallback to localStorage if Supabase fails
            console.log('⚠️ Falling back to localStorage...');
            localStorage.setItem(`invitation_${invitationId}`, JSON.stringify(invitationData));
            
            const userInvitations = JSON.parse(localStorage.getItem('user_invitations') || '[]');
            userInvitations.push({
                id: invitationId,
                title: this.currentTemplate.title,
                date: this.currentTemplate.date,
                status: 'draft',
                created: invitationData.created
            });
            localStorage.setItem('user_invitations', JSON.stringify(userInvitations));
            
            this.showNotification('Saved locally (database unavailable)', 'success');
            return invitationData;
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const bgColor = type === 'error' ? '#ef4444' : '#10b981';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, type === 'error' ? 5000 : 3000);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Email service methods
    checkEmailServiceStatus() {
        const emailStatus = document.getElementById('emailStatus');
        const emailForm = document.getElementById('emailForm');
        const emailSetup = document.getElementById('emailSetup');
        
        if (!window.emailService) {
            emailStatus.innerHTML = '<p style="color: #ef4444;">❌ Email service not available</p>';
            emailSetup.style.display = 'block';
            return;
        }
        
        const status = window.emailService.getStatus();
        
        if (status.ready) {
            emailStatus.innerHTML = '<p style="color: #10b981;">✅ Email service ready</p>';
            emailForm.style.display = 'block';
        } else {
            emailStatus.innerHTML = '<p style="color: #f59e0b;">⚠️ Email service not configured</p>';
            emailSetup.style.display = 'block';
        }
    }

    async sendEmailInvitations(invitationId) {
        const guestEmailsText = document.getElementById('guestEmails').value.trim();
        const sendToHost = document.getElementById('sendToHost').checked;
        const resultsDiv = document.getElementById('emailResults');
        
        if (!guestEmailsText) {
            alert('Please enter at least one guest email address');
            return;
        }
        
        // Parse email addresses
        const emailLines = guestEmailsText.split('\n').map(line => line.trim()).filter(line => line);
        const recipients = [];
        
        for (const line of emailLines) {
            // Support formats: "email@domain.com" or "Name <email@domain.com>"
            const emailMatch = line.match(/([^<]+<)?([^<>\s]+@[^<>\s]+)/);
            if (emailMatch) {
                const email = emailMatch[2];
                const name = emailMatch[1] ? emailMatch[1].replace('<', '').trim() : '';
                recipients.push({ email, name });
            }
        }
        
        if (recipients.length === 0) {
            alert('No valid email addresses found. Please check the format.');
            return;
        }
        
        resultsDiv.innerHTML = '<p style="color: #f59e0b;">📧 Sending invitations...</p>';
        
        try {
            // Get invitation data
            const { data: invitationData, error } = await window.easyrsvpDB.getInvitation(invitationId);
            
            if (error || !invitationData) {
                throw new Error('Could not load invitation data');
            }
            
            // Send to guests
            const results = await window.emailService.sendBulkInvitations(invitationData, recipients);
            
            // Send to host if requested
            if (sendToHost) {
                const user = await window.easyrsvpDB.getCurrentUser();
                if (user && user.email) {
                    try {
                        await window.emailService.sendInvitationEmail(invitationData, user.email, 'Host Copy');
                        results.sent.push({ email: user.email, name: 'Host Copy' });
                    } catch (error) {
                        console.error('Failed to send host copy:', error);
                        results.failed.push({ email: user.email, name: 'Host Copy', error: error.message });
                    }
                }
            }
            
            // Show results
            let resultHTML = `<div style="margin-top: 15px;">`;
            resultHTML += `<p style="color: #10b981;">✅ ${results.sent.length} invitations sent successfully</p>`;
            
            if (results.failed.length > 0) {
                resultHTML += `<p style="color: #ef4444;">❌ ${results.failed.length} invitations failed</p>`;
                resultHTML += `<details><summary>View failed emails</summary><ul>`;
                results.failed.forEach(failed => {
                    resultHTML += `<li>${failed.email}: ${failed.error}</li>`;
                });
                resultHTML += `</ul></details>`;
            }
            
            resultHTML += `</div>`;
            resultsDiv.innerHTML = resultHTML;
            
            // Show success notification
            this.showNotification(`📧 Sent ${results.sent.length} email invitations!`, 'success');
            
        } catch (error) {
            console.error('Email send error:', error);
            resultsDiv.innerHTML = `<p style="color: #ef4444;">❌ Failed to send invitations: ${error.message}</p>`;
            this.showNotification('Failed to send email invitations', 'error');
        }
    }
}

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.templateEditor = new TemplateEditor();
});

// Global functions for email functionality
async function sendEmailInvitations(invitationId) {
    if (window.templateEditor) {
        await window.templateEditor.sendEmailInvitations(invitationId);
    }
}

function checkEmailServiceStatus() {
    if (window.templateEditor) {
        window.templateEditor.checkEmailServiceStatus();
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);