// RSVP Page JavaScript

class RSVPPage {
    constructor() {
        this.invitationId = this.getInvitationIdFromUrl();
        this.invitationData = null;
        this.init();
    }
    
    init() {
        this.loadInvitationData();
        this.bindEvents();
    }
    
    getInvitationIdFromUrl() {
        // Extract invitation ID from URL
        // Format: /rsvp.html?id=inv_123456 or /rsvp/inv_123456
        const urlParams = new URLSearchParams(window.location.search);
        const idFromParam = urlParams.get('id');
        
        if (idFromParam) {
            return idFromParam;
        }
        
        // Try to get from path
        const pathParts = window.location.pathname.split('/');
        const rsvpIndex = pathParts.indexOf('rsvp');
        if (rsvpIndex !== -1 && pathParts[rsvpIndex + 1]) {
            return pathParts[rsvpIndex + 1];
        }
        
        // Default for demo
        return 'demo_invitation';
    }
    
    loadInvitationData() {
        // Try to load from localStorage first
        const storedData = localStorage.getItem(`invitation_${this.invitationId}`);
        
        if (storedData) {
            this.invitationData = JSON.parse(storedData);
        } else {
            // Demo data if no invitation found
            this.invitationData = {
                id: this.invitationId,
                title: 'Sarah & John\'s Wedding',
                subtitle: 'Request the pleasure of your company',
                date: '2026-06-15',
                time: '15:00',
                venue: 'Garden Manor',
                description: 'Join us for a beautiful celebration of love in our garden venue.',
                primaryColor: '#d4af37',
                language: 'english',
                enableRSVP: true,
                askDietaryRestrictions: true,
                askPlusOne: true,
                rsvpDeadline: '2026-06-01'
            };
        }
        
        this.renderInvitation();
    }
    
    renderInvitation() {
        // Update invitation preview
        document.getElementById('eventTitle').textContent = this.invitationData.title;
        document.getElementById('eventSubtitle').textContent = this.invitationData.subtitle;
        
        // Format date
        const eventDate = new Date(this.invitationData.date + 'T' + this.invitationData.time);
        document.getElementById('eventDate').textContent = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('eventTime').textContent = eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        document.getElementById('eventVenue').textContent = this.invitationData.venue;
        document.getElementById('eventDescription').textContent = this.invitationData.description;
        
        // Apply theme colors
        const preview = document.getElementById('invitationPreview');
        if (this.invitationData.primaryColor) {
            const color = this.invitationData.primaryColor;
            const rgb = this.hexToRgb(color);
            const lightColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
            preview.style.background = `linear-gradient(135deg, ${color}, ${lightColor})`;
        }
        
        // Show/hide optional sections
        if (!this.invitationData.askPlusOne) {
            document.getElementById('plusOneSection').style.display = 'none';
        }
        
        if (!this.invitationData.askDietaryRestrictions) {
            document.getElementById('dietarySection').style.display = 'none';
        }
        
        // Check RSVP deadline
        if (this.invitationData.rsvpDeadline) {
            const deadline = new Date(this.invitationData.rsvpDeadline);
            const now = new Date();
            
            if (now > deadline) {
                this.showRSVPClosed();
                return;
            }
        }
    }
    
    bindEvents() {
        // Attendance selection
        document.querySelectorAll('.attendance-option').forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove selected class from all options
                document.querySelectorAll('.attendance-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Set hidden input value
                const value = option.getAttribute('data-value');
                document.getElementById('attendance').value = value;
                
                // Show/hide plus one section
                const plusOneSection = document.getElementById('plusOneSection');
                const dietarySection = document.getElementById('dietarySection');
                
                if (value === 'yes') {
                    if (this.invitationData.askPlusOne) {
                        plusOneSection.classList.add('show');
                    }
                    if (this.invitationData.askDietaryRestrictions) {
                        dietarySection.classList.add('show');
                    }
                } else {
                    plusOneSection.classList.remove('show');
                    dietarySection.classList.remove('show');
                }
            });
        });
        
        // Form submission
        document.getElementById('rsvpForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRSVP();
        });
    }
    
    submitRSVP() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            const formData = {
                invitationId: this.invitationId,
                guestName: document.getElementById('guestName').value.trim(),
                guestEmail: document.getElementById('guestEmail').value.trim(),
                attendance: document.getElementById('attendance').value,
                plusOneName: document.getElementById('plusOneName').value.trim(),
                dietaryRestrictions: document.getElementById('dietaryRestrictions').value,
                guestMessage: document.getElementById('guestMessage').value.trim(),
                submittedAt: new Date().toISOString()
            };
            
            // Validate required fields
            if (!formData.guestName) {
                throw new Error('Please enter your name.');
            }
            
            if (!formData.guestEmail) {
                throw new Error('Please enter your email address.');
            }
            
            if (!formData.attendance) {
                throw new Error('Please select whether you will be attending.');
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.guestEmail)) {
                throw new Error('Please enter a valid email address.');
            }
            
            // Save RSVP response
            this.saveRSVPResponse(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Send confirmation (in production, this would be a real email)
            this.sendConfirmation(formData);
            
        } catch (error) {
            // Show error message
            this.showErrorMessage(error.message);
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    showErrorMessage(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #fee2e2;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #fecaca;
            font-weight: 500;
        `;
        
        // Insert before the form
        const form = document.getElementById('rsvpForm');
        form.parentNode.insertBefore(errorDiv, form);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    saveRSVPResponse(formData) {
        // Get existing responses
        const responses = JSON.parse(localStorage.getItem(`rsvp_responses_${this.invitationId}`) || '[]');
        
        // Check if guest already responded
        const existingIndex = responses.findIndex(r => r.guestEmail === formData.guestEmail);
        
        if (existingIndex !== -1) {
            // Update existing response
            responses[existingIndex] = formData;
        } else {
            // Add new response
            responses.push(formData);
        }
        
        // Save back to localStorage
        localStorage.setItem(`rsvp_responses_${this.invitationId}`, JSON.stringify(responses));
        
        // Update invitation data with response count
        if (this.invitationData) {
            this.invitationData.responses = this.invitationData.responses || {};
            this.invitationData.responses[formData.guestEmail] = formData;
            this.invitationData.responseCount = responses.length;
            this.invitationData.attendingCount = responses.filter(r => r.attendance === 'yes').length;
            this.invitationData.notAttendingCount = responses.filter(r => r.attendance === 'no').length;
            
            localStorage.setItem(`invitation_${this.invitationId}`, JSON.stringify(this.invitationData));
        }
    }
    
    showSuccessMessage() {
        document.getElementById('rsvpFormContainer').style.display = 'none';
        document.getElementById('successMessage').classList.add('show');
        
        // Add confetti effect
        this.createConfetti();
    }
    
    showRSVPClosed() {
        const formContainer = document.getElementById('rsvpFormContainer');
        formContainer.innerHTML = `
            <div class="rsvp-header">
                <h2>RSVP Closed</h2>
                <p>The RSVP deadline for this event has passed.</p>
                <p>Please contact the host directly if you need to make changes.</p>
            </div>
        `;
    }
    
    sendConfirmation(formData) {
        // In production, this would send a real email
        console.log('RSVP Confirmation:', formData);
        
        // Simulate email sending
        setTimeout(() => {
            console.log(`Confirmation email sent to ${formData.guestEmail}`);
        }, 1000);
    }
    
    createConfetti() {
        // Simple confetti animation
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10000;
                    animation: confetti-fall 3s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 212, g: 175, b: 55 };
    }
}

// Initialize RSVP page
document.addEventListener('DOMContentLoaded', () => {
    new RSVPPage();
});

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);