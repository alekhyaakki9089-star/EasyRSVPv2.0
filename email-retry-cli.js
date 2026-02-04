// Email Retry CLI - Command Line Interface for Email Retries
// This can be used in Node.js environment or browser console

class EmailRetryCLI {
    constructor() {
        this.emailQueue = [];
        this.emailService = null;
        this.isProcessing = false;
        this.stats = {
            total: 0,
            sent: 0,
            pending: 0,
            failed: 0
        };
    }

    // Initialize the CLI
    async init() {
        console.log('📧 Email Retry CLI v1.0');
        console.log('Available commands:');
        console.log('  help()           - Show all commands');
        console.log('  status()         - Show queue status');
        console.log('  load()           - Load emails from database');
        console.log('  retry()          - Retry all pending emails');
        console.log('  retryFailed()    - Retry all failed emails');
        console.log('  retryAll()       - Retry all non-sent emails');
        console.log('  clear()          - Clear email queue');
        console.log('  test()           - Add test emails');
        console.log('');
        
        // Auto-load if database available
        if (typeof window !== 'undefined' && window.easyrsvpDB) {
            console.log('🗄️ Database detected, loading emails...');
            await this.load();
        }
        
        return this;
    }

    // Show help
    help() {
        console.log(`
📧 Email Retry CLI Commands:

QUEUE MANAGEMENT:
  status()                    - Show current queue statistics
  load()                      - Load emails from Supabase database
  clear()                     - Clear all emails from queue
  list(filter)                - List emails (filter: 'all', 'pending', 'failed', 'sent')
  
RETRY OPERATIONS:
  retry()                     - Retry all pending emails
  retryFailed()               - Retry all failed emails  
  retryAll()                  - Retry all non-sent emails
  retryEmail(email)           - Retry specific email by email address
  retryBatch(emails, delay)   - Retry array of emails with delay
  
EMAIL SERVICE:
  configure(provider, apiKey) - Configure email service
  testConnection()            - Test email service connection
  
UTILITIES:
  test()                      - Add test emails to queue
  simulate()                  - Simulate some failures
  export()                    - Export queue data as JSON
  import(data)                - Import queue data from JSON
  
EXAMPLES:
  await cli.retry()           - Retry all pending
  cli.list('failed')          - Show failed emails
  cli.retryEmail('john@example.com') - Retry specific email
        `);
    }

    // Show queue status
    status() {
        this.updateStats();
        console.log('📊 Email Queue Status:');
        console.log(`  Total: ${this.stats.total}`);
        console.log(`  Sent: ${this.stats.sent} ✅`);
        console.log(`  Pending: ${this.stats.pending} ⏳`);
        console.log(`  Failed: ${this.stats.failed} ❌`);
        console.log('');
        
        if (this.stats.pending > 0) {
            console.log(`💡 Run retry() to retry ${this.stats.pending} pending emails`);
        }
        if (this.stats.failed > 0) {
            console.log(`💡 Run retryFailed() to retry ${this.stats.failed} failed emails`);
        }
        
        return this.stats;
    }

    // Update statistics
    updateStats() {
        this.stats.total = this.emailQueue.length;
        this.stats.sent = this.emailQueue.filter(e => e.status === 'sent').length;
        this.stats.pending = this.emailQueue.filter(e => e.status === 'pending').length;
        this.stats.failed = this.emailQueue.filter(e => e.status === 'failed').length;
    }

    // Load emails from database
    async load() {
        console.log('🗄️ Loading emails from database...');
        
        try {
            // Wait for database if in browser
            if (typeof window !== 'undefined') {
                let attempts = 0;
                while (!window.easyrsvpDB && attempts < 20) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }

                if (!window.easyrsvpDB) {
                    console.log('❌ Database not available');
                    return this.test(); // Fallback to test data
                }

                // Get invitations
                const { data: invitations, error } = await window.easyrsvpDB.getUserInvitations();
                
                if (error) {
                    throw new Error(error.message);
                }

                let loadedCount = 0;
                
                for (const invitation of invitations) {
                    // Get RSVPs to see who responded
                    const { data: rsvps } = await window.easyrsvpDB.getRSVPs(invitation.id);
                    const rsvpEmails = rsvps ? rsvps.map(r => r.guest_email) : [];
                    
                    // Sample guests (in real app, get from guests table)
                    const sampleGuests = [
                        { name: 'John Doe', email: 'john@example.com' },
                        { name: 'Jane Smith', email: 'jane@example.com' },
                        { name: 'Bob Johnson', email: 'bob@example.com' },
                        { name: 'Alice Brown', email: 'alice@example.com' },
                        { name: 'Charlie Wilson', email: 'charlie@example.com' }
                    ];
                    
                    sampleGuests.forEach(guest => {
                        const hasRSVP = rsvpEmails.includes(guest.email);
                        const emailItem = {
                            id: `email_${invitation.id}_${guest.email}`,
                            invitationId: invitation.id,
                            guestName: guest.name,
                            guestEmail: guest.email,
                            subject: `You're Invited to ${invitation.title}`,
                            content: this.generateEmailContent(invitation, guest),
                            status: hasRSVP ? 'sent' : Math.random() < 0.7 ? 'pending' : 'failed',
                            attempts: hasRSVP ? 1 : Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0,
                            lastAttempt: hasRSVP ? new Date().toISOString() : null,
                            errorMessage: null,
                            createdAt: invitation.created_at || new Date().toISOString()
                        };
                        
                        // Add random error messages for failed emails
                        if (emailItem.status === 'failed') {
                            const errors = [
                                'SMTP connection timeout',
                                'Invalid email address',
                                'Recipient mailbox full',
                                'Temporary delivery failure',
                                'Rate limit exceeded'
                            ];
                            emailItem.errorMessage = errors[Math.floor(Math.random() * errors.length)];
                        }
                        
                        if (!this.emailQueue.find(e => e.id === emailItem.id)) {
                            this.emailQueue.push(emailItem);
                            loadedCount++;
                        }
                    });
                }

                console.log(`✅ Loaded ${loadedCount} emails from ${invitations.length} invitations`);
            } else {
                console.log('⚠️ Not in browser environment, using test data');
                return this.test();
            }
            
        } catch (error) {
            console.log(`❌ Failed to load from database: ${error.message}`);
            console.log('📝 Using test data instead...');
            return this.test();
        }
        
        this.status();
        return this;
    }

    // Generate email content
    generateEmailContent(invitation, guest) {
        const rsvpUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://easyrsvp.com'}/rsvp.html?id=${invitation.id}&guest=${encodeURIComponent(guest.email)}`;
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #d4af37, #f4e4bc); color: white; padding: 20px; text-align: center;">
                    <h2>${invitation.title}</h2>
                    <p>You're Invited!</p>
                </div>
                <div style="padding: 20px;">
                    <p>Dear ${guest.name},</p>
                    <p>We would be delighted to have you join us for <strong>${invitation.title}</strong>.</p>
                    <p><strong>📅 Date:</strong> ${new Date(invitation.date).toLocaleDateString()}</p>
                    <p><strong>📍 Venue:</strong> ${invitation.venue}</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${rsvpUrl}" style="background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">RSVP Now</a>
                    </div>
                </div>
            </div>
        `;
    }

    // List emails with optional filter
    list(filter = 'all') {
        let emails = this.emailQueue;
        
        if (filter !== 'all') {
            emails = this.emailQueue.filter(e => e.status === filter);
        }
        
        console.log(`📋 Email List (${filter}): ${emails.length} emails`);
        console.log('');
        
        emails.forEach((email, index) => {
            const statusIcon = email.status === 'sent' ? '✅' : email.status === 'failed' ? '❌' : '⏳';
            console.log(`${index + 1}. ${statusIcon} ${email.guestName} (${email.guestEmail})`);
            console.log(`   Status: ${email.status.toUpperCase()}, Attempts: ${email.attempts}`);
            if (email.errorMessage) {
                console.log(`   Error: ${email.errorMessage}`);
            }
            console.log('');
        });
        
        return emails;
    }

    // Configure email service
    configure(provider = 'mock', apiKey = 'test-key') {
        console.log(`🔧 Configuring ${provider} email service...`);
        
        // Mock email service for CLI
        this.emailService = {
            provider: provider,
            apiKey: apiKey,
            configured: true,
            
            async sendEmail(to, subject, content) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
                
                // Simulate failures (15% chance)
                if (Math.random() < 0.15) {
                    const errors = [
                        'SMTP connection timeout',
                        'Invalid email address',
                        'Recipient mailbox full',
                        'Rate limit exceeded'
                    ];
                    throw new Error(errors[Math.floor(Math.random() * errors.length)]);
                }
                
                return {
                    messageId: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    status: 'sent',
                    timestamp: new Date().toISOString()
                };
            }
        };
        
        console.log(`✅ ${provider} email service configured`);
        return this;
    }

    // Test email connection
    async testConnection() {
        if (!this.emailService) {
            console.log('❌ Email service not configured. Run configure() first.');
            return false;
        }
        
        console.log('📡 Testing email connection...');
        
        try {
            // Simulate connection test
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (Math.random() < 0.9) {
                console.log('✅ Email connection successful');
                return true;
            } else {
                throw new Error('Connection timeout');
            }
        } catch (error) {
            console.log(`❌ Connection failed: ${error.message}`);
            return false;
        }
    }

    // Retry all pending emails
    async retry() {
        const pendingEmails = this.emailQueue.filter(e => e.status === 'pending');
        return await this.retryBatch(pendingEmails, 'pending');
    }

    // Retry all failed emails
    async retryFailed() {
        const failedEmails = this.emailQueue.filter(e => e.status === 'failed');
        return await this.retryBatch(failedEmails, 'failed');
    }

    // Retry all non-sent emails
    async retryAll() {
        const nonSentEmails = this.emailQueue.filter(e => e.status !== 'sent');
        return await this.retryBatch(nonSentEmails, 'all non-sent');
    }

    // Retry specific email by email address
    async retryEmail(emailAddress) {
        const email = this.emailQueue.find(e => e.guestEmail === emailAddress);
        
        if (!email) {
            console.log(`❌ Email not found: ${emailAddress}`);
            return false;
        }
        
        return await this.retryBatch([email], 'specific');
    }

    // Retry batch of emails
    async retryBatch(emails, type, delay = 500) {
        if (!this.emailService) {
            console.log('❌ Email service not configured. Run configure() first.');
            return false;
        }
        
        if (this.isProcessing) {
            console.log('❌ Already processing emails. Please wait...');
            return false;
        }
        
        if (emails.length === 0) {
            console.log(`ℹ️ No ${type} emails to retry`);
            return true;
        }
        
        this.isProcessing = true;
        console.log(`🚀 Retrying ${emails.length} ${type} emails...`);
        console.log('');
        
        let successCount = 0;
        let failureCount = 0;
        
        for (let i = 0; i < emails.length; i++) {
            const email = emails[i];
            
            try {
                console.log(`📧 [${i + 1}/${emails.length}] Sending to ${email.guestName}...`);
                
                email.attempts++;
                email.lastAttempt = new Date().toISOString();
                
                const result = await this.emailService.sendEmail(
                    email.guestEmail,
                    email.subject,
                    email.content
                );
                
                email.status = 'sent';
                email.errorMessage = null;
                successCount++;
                
                console.log(`   ✅ Sent (${result.messageId})`);
                
            } catch (error) {
                email.status = 'failed';
                email.errorMessage = error.message;
                failureCount++;
                
                console.log(`   ❌ Failed: ${error.message}`);
            }
            
            // Progress indicator
            const progress = Math.round(((i + 1) / emails.length) * 100);
            console.log(`   Progress: ${progress}%`);
            console.log('');
            
            // Delay between sends (except for last email)
            if (i < emails.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        this.isProcessing = false;
        
        console.log('🎉 Retry batch completed!');
        console.log(`   ✅ Successful: ${successCount}`);
        console.log(`   ❌ Failed: ${failureCount}`);
        console.log('');
        
        this.status();
        return successCount > 0;
    }

    // Add test emails
    test() {
        console.log('📝 Adding test emails...');
        
        const testEmails = [
            { name: 'John Doe', email: 'john@example.com', status: 'pending' },
            { name: 'Jane Smith', email: 'jane@example.com', status: 'failed', error: 'SMTP timeout' },
            { name: 'Bob Johnson', email: 'bob@example.com', status: 'sent' },
            { name: 'Alice Brown', email: 'alice@example.com', status: 'pending' },
            { name: 'Charlie Wilson', email: 'charlie@example.com', status: 'failed', error: 'Invalid address' },
            { name: 'Diana Prince', email: 'diana@example.com', status: 'pending' },
            { name: 'Eve Adams', email: 'eve@example.com', status: 'sent' },
            { name: 'Frank Miller', email: 'frank@example.com', status: 'failed', error: 'Mailbox full' }
        ];
        
        testEmails.forEach(guest => {
            const emailItem = {
                id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                invitationId: 'test_invitation_' + Date.now(),
                guestName: guest.name,
                guestEmail: guest.email,
                subject: "You're Invited to Test Wedding",
                content: `<p>Dear ${guest.name}, you're invited to our test event!</p>`,
                status: guest.status,
                attempts: guest.status === 'failed' ? Math.floor(Math.random() * 3) + 1 : guest.status === 'sent' ? 1 : 0,
                lastAttempt: guest.status !== 'pending' ? new Date().toISOString() : null,
                errorMessage: guest.error || null,
                createdAt: new Date().toISOString()
            };
            
            this.emailQueue.push(emailItem);
        });
        
        console.log(`✅ Added ${testEmails.length} test emails`);
        this.status();
        return this;
    }

    // Simulate failures
    simulate() {
        console.log('❌ Simulating email failures...');
        
        const sentEmails = this.emailQueue.filter(e => e.status === 'sent');
        const toFail = sentEmails.slice(0, Math.min(3, sentEmails.length));
        
        const errors = [
            'Simulated SMTP timeout',
            'Simulated bounce',
            'Simulated rate limit'
        ];
        
        toFail.forEach((email, index) => {
            email.status = 'failed';
            email.errorMessage = errors[index % errors.length];
            email.attempts++;
        });
        
        console.log(`❌ Simulated failures for ${toFail.length} emails`);
        this.status();
        return this;
    }

    // Clear queue
    clear() {
        const count = this.emailQueue.length;
        this.emailQueue = [];
        console.log(`🗑️ Cleared ${count} emails from queue`);
        this.status();
        return this;
    }

    // Export queue data
    export() {
        const data = {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            emails: this.emailQueue
        };
        
        console.log('📊 Email queue data:');
        console.log(JSON.stringify(data, null, 2));
        
        return data;
    }

    // Import queue data
    import(data) {
        try {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            
            if (data.emails && Array.isArray(data.emails)) {
                this.emailQueue = data.emails;
                console.log(`📥 Imported ${data.emails.length} emails`);
                this.status();
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.log(`❌ Import failed: ${error.message}`);
        }
        
        return this;
    }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.emailCLI = new EmailRetryCLI();
    
    // Auto-init when page loads
    window.addEventListener('load', async () => {
        await window.emailCLI.init();
        console.log('💡 Email CLI ready! Type emailCLI.help() for commands');
    });
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js export
    module.exports = EmailRetryCLI;
}

// Usage examples:
/*
// In browser console:
await emailCLI.init()
emailCLI.status()
await emailCLI.retry()
emailCLI.list('failed')
await emailCLI.retryFailed()

// Quick commands:
emailCLI.test()           // Add test data
emailCLI.configure()      // Setup mock service  
await emailCLI.retry()    // Retry pending
emailCLI.simulate()       // Create failures
await emailCLI.retryFailed() // Retry failed
emailCLI.clear()          // Clear queue
*/