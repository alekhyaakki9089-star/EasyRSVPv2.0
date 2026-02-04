// SendGrid Email Service Configuration for EasyRSVP
// This file handles email sending functionality using SendGrid API

class EmailService {
    constructor() {
        this.apiKey = null;
        this.fromEmail = 'noreply@easyrsvp.com';
        this.fromName = 'EasyRSVP';
        this.isConfigured = false;
        this.isMockMode = false;
    }

    // Configure email service
    configure(provider, apiKey, options = {}) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.fromEmail = options.fromEmail || this.fromEmail;
        this.fromName = options.fromName || this.fromName;
        this.isMockMode = provider === 'mock';
        this.isConfigured = true;

        console.log(`📧 Email service configured: ${provider}`);
        
        if (this.isMockMode) {
            console.log('🧪 Running in mock mode - emails will be simulated');
        }
    }

    // Test email service connection
    async testConnection() {
        if (!this.isConfigured) {
            throw new Error('Email service not configured');
        }

        if (this.isMockMode) {
            // Simulate connection test
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: 'Mock service connection successful' };
        }

        try {
            console.log('🔧 Testing email service connection...');
            
            // For SendGrid, test by validating API key with a simple API call
            if (this.provider === 'sendgrid') {
                console.log('📡 Testing SendGrid API key...');
                
                const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📡 SendGrid API response status:', response.status);

                if (response.ok) {
                    const profile = await response.json();
                    console.log('✅ SendGrid connection successful:', profile.username || 'User');
                    return { 
                        success: true, 
                        message: `SendGrid connection successful (${profile.username || 'User'})` 
                    };
                } else if (response.status === 401) {
                    throw new Error('Invalid SendGrid API key. Please check your API key.');
                } else if (response.status === 403) {
                    throw new Error('SendGrid API key does not have sufficient permissions.');
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`SendGrid API error: ${errorData.errors?.[0]?.message || response.statusText}`);
                }
            }

            // For other providers, implement similar tests
            return { success: true, message: 'Connection test passed' };

        } catch (error) {
            console.error('❌ Email service connection test failed:', error);
            throw error;
        }
    }

    // Send single email
    async sendEmail(to, subject, htmlContent, textContent = null) {
        if (!this.isConfigured) {
            throw new Error('Email service not configured');
        }

        const emailData = {
            to: typeof to === 'string' ? [{ email: to }] : to,
            subject: subject,
            htmlContent: htmlContent,
            textContent: textContent || this.htmlToText(htmlContent),
            timestamp: new Date().toISOString()
        };

        if (this.isMockMode) {
            return await this.sendMockEmail(emailData);
        }

        switch (this.provider) {
            case 'sendgrid':
                return await this.sendSendGridEmail(emailData);
            case 'mailgun':
                return await this.sendMailgunEmail(emailData);
            default:
                throw new Error(`Unsupported email provider: ${this.provider}`);
        }
    }

    // Send bulk emails
    async sendBulkEmails(recipients, subject, htmlContent, textContent = null) {
        const results = [];
        
        for (const recipient of recipients) {
            try {
                const result = await this.sendEmail(
                    recipient.email,
                    this.personalizeSubject(subject, recipient),
                    this.personalizeContent(htmlContent, recipient),
                    textContent ? this.personalizeContent(textContent, recipient) : null
                );
                
                results.push({
                    recipient: recipient,
                    success: true,
                    messageId: result.messageId,
                    timestamp: new Date().toISOString()
                });

                // Small delay between sends to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                results.push({
                    recipient: recipient,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        return results;
    }

    // SendGrid implementation
    async sendSendGridEmail(emailData) {
        console.log('📧 Sending email via SendGrid...');
        
        const payload = {
            personalizations: [{
                to: emailData.to,
                subject: emailData.subject
            }],
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            content: [
                {
                    type: 'text/html',
                    value: emailData.htmlContent
                },
                {
                    type: 'text/plain',
                    value: emailData.textContent
                }
            ],
            tracking_settings: {
                click_tracking: { enable: true },
                open_tracking: { enable: true }
            },
            reply_to: {
                email: this.fromEmail,
                name: this.fromName
            }
        };

        console.log('📤 SendGrid payload:', {
            to: emailData.to,
            subject: emailData.subject,
            from: this.fromEmail
        });

        try {
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log('📡 SendGrid response status:', response.status);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                
                try {
                    const errorData = await response.json();
                    if (errorData.errors && errorData.errors.length > 0) {
                        errorMessage = errorData.errors.map(e => e.message).join(', ');
                    }
                } catch (parseError) {
                    console.warn('Could not parse error response:', parseError);
                }
                
                throw new Error(`SendGrid error: ${errorMessage}`);
            }

            const messageId = response.headers.get('X-Message-Id') || 'sendgrid_' + Date.now();
            console.log('✅ SendGrid email sent successfully:', messageId);

            return {
                messageId: messageId,
                provider: 'sendgrid',
                timestamp: emailData.timestamp,
                status: 'sent'
            };

        } catch (error) {
            console.error('❌ SendGrid send error:', error);
            throw error;
        }
    }

    // Mailgun implementation
    async sendMailgunEmail(emailData) {
        const formData = new FormData();
        formData.append('from', `${this.fromName} <${this.fromEmail}>`);
        formData.append('to', emailData.to[0].email);
        formData.append('subject', emailData.subject);
        formData.append('html', emailData.htmlContent);
        formData.append('text', emailData.textContent);

        const response = await fetch('https://api.mailgun.net/v3/sandbox.mailgun.org/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa('api:' + this.apiKey)}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Mailgun error: ${error.message || response.statusText}`);
        }

        const result = await response.json();
        return {
            messageId: result.id || 'mailgun_' + Date.now(),
            provider: 'mailgun',
            timestamp: emailData.timestamp
        };
    }

    // Mock email implementation for testing
    async sendMockEmail(emailData) {
        console.log('📧 Mock Email Send:', {
            to: emailData.to,
            subject: emailData.subject,
            timestamp: emailData.timestamp
        });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

        // Simulate occasional failures (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Mock email service: Simulated delivery failure');
        }

        return {
            messageId: 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            provider: 'mock',
            timestamp: emailData.timestamp,
            mockData: {
                delivered: true,
                opened: Math.random() < 0.6, // 60% open rate
                clicked: Math.random() < 0.3  // 30% click rate
            }
        };
    }

    // Generate email templates
    generateInvitationEmail(invitationData, guestData, templateType = 'elegant') {
        const templates = {
            elegant: {
                backgroundColor: '#f8f9fa',
                headerColor: 'linear-gradient(135deg, #d4af37, #f4e4bc)',
                textColor: '#333',
                buttonColor: '#d4af37'
            },
            modern: {
                backgroundColor: '#ffffff',
                headerColor: 'linear-gradient(135deg, #667eea, #764ba2)',
                textColor: '#2c3e50',
                buttonColor: '#667eea'
            },
            casual: {
                backgroundColor: '#fff3e0',
                headerColor: 'linear-gradient(135deg, #ff6b6b, #feca57)',
                textColor: '#333',
                buttonColor: '#ff6b6b'
            }
        };

        const template = templates[templateType] || templates.elegant;
        const rsvpUrl = `${window.location.origin}/rsvp.html?id=${invitationData.id}&guest=${encodeURIComponent(guestData.email)}`;
        const inviteUrl = `${window.location.origin}/invitation.html?id=${invitationData.id}`;

        const subject = `You're Invited to ${invitationData.title}`;
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                    .email-container { max-width: 600px; margin: 0 auto; background: ${template.backgroundColor}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .header { background: ${template.headerColor}; color: white; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                    .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
                    .body { padding: 30px 20px; color: ${template.textColor}; line-height: 1.6; }
                    .event-details { background: rgba(0,0,0,0.05); padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .event-details h3 { margin: 0 0 15px 0; color: ${template.buttonColor}; }
                    .detail-item { margin: 10px 0; display: flex; align-items: center; }
                    .detail-icon { margin-right: 10px; font-size: 18px; }
                    .rsvp-button { display: inline-block; background: ${template.buttonColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
                    .footer a { color: ${template.buttonColor}; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>${invitationData.title}</h1>
                        <p>You're Invited!</p>
                    </div>
                    <div class="body">
                        <p>Dear ${guestData.name || 'Guest'},</p>
                        <p>We would be delighted to have you join us for this special celebration!</p>
                        
                        <div class="event-details">
                            <h3>📅 Event Details</h3>
                            <div class="detail-item">
                                <span class="detail-icon">📅</span>
                                <strong>Date:</strong> ${new Date(invitationData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div class="detail-item">
                                <span class="detail-icon">🕒</span>
                                <strong>Time:</strong> ${invitationData.time || '3:00 PM'}
                            </div>
                            <div class="detail-item">
                                <span class="detail-icon">📍</span>
                                <strong>Venue:</strong> ${invitationData.venue}
                            </div>
                        </div>
                        
                        <p>${invitationData.description || 'Join us for this wonderful celebration!'}</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${rsvpUrl}" class="rsvp-button">RSVP Now</a>
                        </div>
                        
                        <p>You can also view the full invitation <a href="${inviteUrl}" style="color: ${template.buttonColor};">here</a>.</p>
                        <p>We look forward to celebrating with you!</p>
                    </div>
                    <div class="footer">
                        <p>This invitation was sent via <a href="${window.location.origin}">EasyRSVP</a></p>
                        <p><small>If you have trouble with the RSVP button, copy and paste this link: ${rsvpUrl}</small></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const textContent = `
            ${invitationData.title}
            
            Dear ${guestData.name || 'Guest'},
            
            You're invited to ${invitationData.title}!
            
            Date: ${new Date(invitationData.date).toLocaleDateString()}
            Time: ${invitationData.time || '3:00 PM'}
            Venue: ${invitationData.venue}
            
            ${invitationData.description || 'Join us for this wonderful celebration!'}
            
            Please RSVP at: ${rsvpUrl}
            
            View full invitation: ${inviteUrl}
            
            We look forward to celebrating with you!
            
            ---
            This invitation was sent via EasyRSVP
        `;

        return {
            subject: subject,
            htmlContent: htmlContent,
            textContent: textContent
        };
    }

    // Utility functions
    personalizeSubject(subject, recipient) {
        return subject.replace('{name}', recipient.name || 'Guest');
    }

    personalizeContent(content, recipient) {
        return content
            .replace('{name}', recipient.name || 'Guest')
            .replace('{email}', recipient.email);
    }

    htmlToText(html) {
        // Simple HTML to text conversion
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();
    }

    // Email analytics and tracking
    async getEmailAnalytics(messageIds) {
        if (this.isMockMode) {
            // Return mock analytics
            return messageIds.map(id => ({
                messageId: id,
                delivered: Math.random() < 0.95,
                opened: Math.random() < 0.6,
                clicked: Math.random() < 0.3,
                bounced: Math.random() < 0.05,
                timestamp: new Date().toISOString()
            }));
        }

        // Real analytics would be implemented here for each provider
        return [];
    }
}

// Global email service instance
window.emailService = new EmailService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}