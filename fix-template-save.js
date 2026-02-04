// Quick fix for template save issue
// Add this to template-editor.html to override the save function

// Override the save function with better form reading
if (window.templateEditor) {
    const originalSaveInvitation = window.templateEditor.saveInvitation;
    
    window.templateEditor.saveInvitation = async function() {
        console.log('🔧 Using fixed save function...');
        
        // Read directly from form fields
        const title = document.getElementById('eventTitle')?.value?.trim();
        const date = document.getElementById('eventDate')?.value;
        const venue = document.getElementById('eventVenue')?.value?.trim();
        const time = document.getElementById('eventTime')?.value || '18:00';
        const subtitle = document.getElementById('eventSubtitle')?.value?.trim() || '';
        const description = document.getElementById('eventDescription')?.value?.trim() || '';
        
        console.log('📝 Form values:', { title, date, venue, time, subtitle, description });
        
        // Validate required fields
        if (!title) {
            this.showNotification('Please enter an event title before saving.', 'error');
            document.getElementById('eventTitle')?.focus();
            return null;
        }
        
        if (!date) {
            this.showNotification('Please select an event date before saving.', 'error');
            document.getElementById('eventDate')?.focus();
            return null;
        }
        
        if (!venue) {
            this.showNotification('Please enter a venue before saving.', 'error');
            document.getElementById('eventVenue')?.focus();
            return null;
        }
        
        // Prepare clean invitation data
        const invitationData = {
            title: title,
            subtitle: subtitle,
            date: date,
            time: time,
            venue: venue,
            description: description,
            theme: this.currentTemplate?.theme || 'elegant',
            primary_color: this.currentTemplate?.primaryColor || '#d4af37',
            font_family: this.currentTemplate?.fontFamily || 'Inter',
            language: this.currentTemplate?.language || 'english',
            background: this.currentTemplate?.background || 'gradient'
        };
        
        console.log('💾 Saving invitation data:', invitationData);
        
        try {
            // Wait for database
            let attempts = 0;
            while (!window.easyrsvpDB && attempts < 30) {
                console.log('⏳ Waiting for database...');
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.easyrsvpDB) {
                throw new Error('Database not available. Please refresh the page.');
            }

            // Check authentication
            const user = await window.easyrsvpDB.getCurrentUser();
            if (!user) {
                throw new Error('Please sign in to save invitations.');
            }

            console.log('👤 User authenticated:', user.email);
            
            // Save to database
            const { data, error } = await window.easyrsvpDB.saveInvitation(invitationData);

            if (error) {
                console.error('❌ Save error:', error);
                throw error;
            }

            console.log('✅ Invitation saved successfully:', data);
            this.showNotification('Invitation saved to database successfully!', 'success');
            return data;

        } catch (error) {
            console.error('❌ Save failed:', error);
            this.showNotification(`Error saving invitation: ${error.message}`, 'error');
            return null;
        }
    };
}

console.log('🔧 Template save fix loaded');