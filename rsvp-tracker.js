// RSVP Tracker JavaScript

class RSVPTracker {
    constructor() {
        this.currentEventId = 'demo_invitation';
        this.guests = [];
        this.responses = [];
        this.init();
    }
    
    init() {
        this.loadEventData();
        this.bindEvents();
        this.updateStats();
        this.renderGuestTable();
        this.updateDietaryStats();
    }
    
    loadEventData() {
        // Load RSVP responses for current event
        const responses = JSON.parse(localStorage.getItem(`rsvp_responses_${this.currentEventId}`) || '[]');
        this.responses = responses;
        
        // Convert responses to guest format for compatibility
        this.guests = responses.map((response, index) => ({
            id: index + 1,
            name: response.guestName,
            email: response.guestEmail,
            status: response.attendance === 'yes' ? 'attending' : 'not-attending',
            plusOne: response.plusOneName ? true : false,
            plusOneName: response.plusOneName || '',
            dietary: response.dietaryRestrictions || 'none',
            responseDate: response.submittedAt ? response.submittedAt.split('T')[0] : null,
            notes: response.guestMessage || ''
        }));
        
        // Add some demo data if no responses exist
        if (this.guests.length === 0) {
            this.guests = [
                {
                    id: 1,
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    status: 'attending',
                    plusOne: true,
                    plusOneName: 'Bob Johnson',
                    dietary: 'vegetarian',
                    responseDate: '2026-01-15',
                    notes: 'Excited to celebrate!'
                },
                {
                    id: 2,
                    name: 'Carol Davis',
                    email: 'carol@example.com',
                    status: 'not-attending',
                    plusOne: false,
                    plusOneName: '',
                    dietary: 'none',
                    responseDate: '2026-01-18',
                    notes: 'Will be out of town'
                },
                {
                    id: 3,
                    name: 'David Wilson',
                    email: 'david@example.com',
                    status: 'pending',
                    plusOne: true,
                    plusOneName: '',
                    dietary: 'gluten-free',
                    responseDate: null,
                    notes: ''
                }
            ];
        }
        
        this.filteredGuests = [...this.guests];
    }
    
    bindEvents() {
        // Event selection
        document.getElementById('eventSelect').addEventListener('change', (e) => {
            this.loadEventData(e.target.value);
        });
        
        // Guest management buttons
        document.getElementById('addGuestBtn').addEventListener('click', () => {
            this.showAddGuestModal();
        });
        
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportGuestList();
        });
        
        document.getElementById('sendRemindersBtn').addEventListener('click', () => {
            this.sendReminders();
        });
        
        // Search and filters
        document.getElementById('searchGuests').addEventListener('input', (e) => {
            this.filterGuests();
        });
        
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterGuests();
        });
        
        document.getElementById('dietaryFilter').addEventListener('change', () => {
            this.filterGuests();
        });
        
        // Modal controls
        document.getElementById('closeAddGuest').addEventListener('click', () => {
            this.hideAddGuestModal();
        });
        
        document.getElementById('cancelAddGuest').addEventListener('click', () => {
            this.hideAddGuestModal();
        });
        
        document.getElementById('saveGuest').addEventListener('click', () => {
            this.saveNewGuest();
        });
        
        // Close modal when clicking outside
        document.getElementById('addGuestModal').addEventListener('click', (e) => {
            if (e.target.id === 'addGuestModal') {
                this.hideAddGuestModal();
            }
        });
    }
    
    updateStats() {
        const attending = this.guests.filter(g => g.status === 'attending').length;
        const notAttending = this.guests.filter(g => g.status === 'not-attending').length;
        const pending = this.guests.filter(g => g.status === 'pending').length;
        const total = this.guests.length;
        
        document.getElementById('attendingCount').textContent = attending;
        document.getElementById('notAttendingCount').textContent = notAttending;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('totalGuests').textContent = total;
        
        // Update progress bar
        const attendingPercent = Math.round((attending / total) * 100);
        const notAttendingPercent = Math.round((notAttending / total) * 100);
        const pendingPercent = Math.round((pending / total) * 100);
        
        document.querySelector('.progress-fill.attending').style.width = attendingPercent + '%';
        document.querySelector('.progress-fill.not-attending').style.width = notAttendingPercent + '%';
        document.querySelector('.progress-fill.pending').style.width = pendingPercent + '%';
        
        document.querySelector('.legend-item.attending').textContent = `Attending (${attendingPercent}%)`;
        document.querySelector('.legend-item.not-attending').textContent = `Not Attending (${notAttendingPercent}%)`;
        document.querySelector('.legend-item.pending').textContent = `Pending (${pendingPercent}%)`;
    }
    
    renderGuestTable() {
        const tbody = document.getElementById('guestTableBody');
        tbody.innerHTML = '';
        
        this.filteredGuests.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${guest.name}</td>
                <td>${guest.email}</td>
                <td><span class="status-badge ${guest.status}">${this.formatStatus(guest.status)}</span></td>
                <td>${guest.plusOne ? `✅ Yes${guest.plusOneName ? ` (${guest.plusOneName})` : ''}` : '❌ No'}</td>
                <td>${this.formatDietary(guest.dietary)}</td>
                <td>${guest.responseDate ? new Date(guest.responseDate).toLocaleDateString() : 'Not responded'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small primary" onclick="rsvpTracker.editGuest(${guest.id})">Edit</button>
                        <button class="btn-small secondary" onclick="rsvpTracker.sendReminder(${guest.id})">Remind</button>
                        <button class="btn-small danger" onclick="rsvpTracker.removeGuest(${guest.id})">Remove</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    filterGuests() {
        const searchTerm = document.getElementById('searchGuests').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const dietaryFilter = document.getElementById('dietaryFilter').value;
        
        this.filteredGuests = this.guests.filter(guest => {
            const matchesSearch = guest.name.toLowerCase().includes(searchTerm) || 
                                guest.email.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
            const matchesDietary = dietaryFilter === 'all' || guest.dietary === dietaryFilter;
            
            return matchesSearch && matchesStatus && matchesDietary;
        });
        
        this.renderGuestTable();
    }
    
    updateDietaryStats() {
        const vegetarian = this.guests.filter(g => g.dietary === 'vegetarian').length;
        const vegan = this.guests.filter(g => g.dietary === 'vegan').length;
        const glutenFree = this.guests.filter(g => g.dietary === 'gluten-free').length;
        const none = this.guests.filter(g => g.dietary === 'none').length;
        
        const dietaryItems = document.querySelectorAll('.dietary-item .dietary-count');
        dietaryItems[0].textContent = `${vegetarian} guests`;
        dietaryItems[1].textContent = `${vegan} guests`;
        dietaryItems[2].textContent = `${glutenFree} guests`;
        dietaryItems[3].textContent = `${none} guests`;
    }
    
    showAddGuestModal() {
        document.getElementById('addGuestModal').classList.add('show');
        document.getElementById('guestName').focus();
    }
    
    hideAddGuestModal() {
        document.getElementById('addGuestModal').classList.remove('show');
        document.getElementById('addGuestForm').reset();
    }
    
    saveNewGuest() {
        const form = document.getElementById('addGuestForm');
        const formData = new FormData(form);
        
        const name = document.getElementById('guestName').value.trim();
        const email = document.getElementById('guestEmail').value.trim();
        const phone = document.getElementById('guestPhone').value.trim();
        const allowPlusOne = document.getElementById('allowPlusOne').checked;
        const notes = document.getElementById('guestNotes').value.trim();
        
        if (!name || !email) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Check for duplicate email
        if (this.guests.some(g => g.email === email)) {
            alert('A guest with this email already exists.');
            return;
        }
        
        const newGuest = {
            id: Math.max(...this.guests.map(g => g.id)) + 1,
            name: name,
            email: email,
            phone: phone,
            status: 'pending',
            plusOne: allowPlusOne,
            dietary: 'none',
            responseDate: null,
            notes: notes
        };
        
        this.guests.push(newGuest);
        this.filteredGuests = [...this.guests];
        
        this.updateStats();
        this.renderGuestTable();
        this.updateDietaryStats();
        this.hideAddGuestModal();
        
        this.showNotification(`Guest "${name}" added successfully!`);
    }
    
    editGuest(guestId) {
        const guest = this.guests.find(g => g.id === guestId);
        if (!guest) return;
        
        // For demo purposes, show a simple prompt
        const newStatus = prompt(`Update status for ${guest.name}:\n1. attending\n2. not-attending\n3. pending`, guest.status);
        if (newStatus && ['attending', 'not-attending', 'pending'].includes(newStatus)) {
            guest.status = newStatus;
            if (newStatus !== 'pending' && !guest.responseDate) {
                guest.responseDate = new Date().toISOString().split('T')[0];
            }
            
            this.updateStats();
            this.renderGuestTable();
            this.showNotification(`${guest.name}'s status updated to ${newStatus}`);
        }
    }
    
    sendReminder(guestId) {
        const guest = this.guests.find(g => g.id === guestId);
        if (!guest) return;
        
        // Simulate sending reminder
        this.showNotification(`Reminder sent to ${guest.name} (${guest.email})`);
    }
    
    removeGuest(guestId) {
        const guest = this.guests.find(g => g.id === guestId);
        if (!guest) return;
        
        if (confirm(`Are you sure you want to remove ${guest.name} from the guest list?`)) {
            this.guests = this.guests.filter(g => g.id !== guestId);
            this.filteredGuests = [...this.guests];
            
            this.updateStats();
            this.renderGuestTable();
            this.updateDietaryStats();
            this.showNotification(`${guest.name} removed from guest list`);
        }
    }
    
    sendReminders() {
        const pendingGuests = this.guests.filter(g => g.status === 'pending');
        if (pendingGuests.length === 0) {
            alert('No pending RSVPs to remind.');
            return;
        }
        
        if (confirm(`Send reminders to ${pendingGuests.length} guests who haven't responded?`)) {
            this.showNotification(`Reminders sent to ${pendingGuests.length} guests`);
        }
    }
    
    exportGuestList() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guest-list.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Guest list exported successfully!');
    }
    
    generateCSV() {
        const headers = ['Name', 'Email', 'Status', 'Plus One', 'Dietary', 'Response Date', 'Notes'];
        const rows = this.guests.map(guest => [
            guest.name,
            guest.email,
            guest.status,
            guest.plusOne ? 'Yes' : 'No',
            guest.dietary,
            guest.responseDate || 'Not responded',
            guest.notes
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }
    
    loadEventData(eventId) {
        // Simulate loading different event data
        this.showNotification(`Loading data for event: ${eventId}`);
        // In a real app, this would fetch data from the server
    }
    
    formatStatus(status) {
        const statusMap = {
            'attending': 'Attending',
            'not-attending': 'Not Attending',
            'pending': 'Pending'
        };
        return statusMap[status] || status;
    }
    
    formatDietary(dietary) {
        const dietaryMap = {
            'vegetarian': 'Vegetarian',
            'vegan': 'Vegan',
            'gluten-free': 'Gluten-Free',
            'none': 'No Restrictions'
        };
        return dietaryMap[dietary] || dietary;
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize RSVP Tracker
let rsvpTracker;
document.addEventListener('DOMContentLoaded', () => {
    rsvpTracker = new RSVPTracker();
});

// Add CSS for RSVP tracker specific styles
const style = document.createElement('style');
style.textContent = `
    .rsvp-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .stat-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 50%;
    }
    
    .stat-info h3 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-color);
    }
    
    .stat-info p {
        margin: 0;
        color: var(--text-color);
        font-weight: 500;
    }
    
    .chart-container {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin: 2rem 0;
    }
    
    .progress-chart {
        margin-top: 1rem;
    }
    
    .progress-bar {
        height: 30px;
        background: #f1f5f9;
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        margin-bottom: 1rem;
    }
    
    .progress-fill {
        height: 100%;
        transition: width 0.3s ease;
    }
    
    .progress-fill.attending {
        background: #10b981;
    }
    
    .progress-fill.not-attending {
        background: #ef4444;
    }
    
    .progress-fill.pending {
        background: #f59e0b;
    }
    
    .progress-legend {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        font-weight: 500;
    }
    
    .legend-item::before {
        content: '';
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 0.5rem;
    }
    
    .legend-item.attending::before {
        background: #10b981;
    }
    
    .legend-item.not-attending::before {
        background: #ef4444;
    }
    
    .legend-item.pending::before {
        background: #f59e0b;
    }
    
    .guest-management {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin: 2rem 0;
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .guest-actions {
        display: flex;
        gap: 1rem;
    }
    
    .guest-filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }
    
    .search-input,
    .filter-select {
        padding: 8px 12px;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 0.9rem;
    }
    
    .search-input {
        flex: 1;
        min-width: 200px;
    }
    
    .guest-table-container {
        overflow-x: auto;
    }
    
    .guest-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    
    .guest-table th,
    .guest-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .guest-table th {
        background: #f8fafc;
        font-weight: 600;
        color: var(--text-color);
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .status-badge.attending {
        background: #dcfce7;
        color: #166534;
    }
    
    .status-badge.not-attending {
        background: #fecaca;
        color: #991b1b;
    }
    
    .status-badge.pending {
        background: #fef3c7;
        color: #92400e;
    }
    
    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .btn-small {
        padding: 4px 8px;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .btn-small.primary {
        background: var(--primary-color);
        color: white;
    }
    
    .btn-small.secondary {
        background: #6b7280;
        color: white;
    }
    
    .btn-small.danger {
        background: #ef4444;
        color: white;
    }
    
    .dietary-summary {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin: 2rem 0;
    }
    
    .dietary-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .dietary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .dietary-label {
        font-weight: 500;
        color: var(--text-color);
    }
    
    .dietary-count {
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .event-selector {
        margin: 2rem 0;
    }
    
    .event-selector label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
    }
    
    .form-control {
        width: 100%;
        max-width: 400px;
        padding: 10px 12px;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 1rem;
    }
    
    @media (max-width: 768px) {
        .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }
        
        .guest-actions {
            justify-content: center;
        }
        
        .guest-filters {
            flex-direction: column;
        }
        
        .search-input {
            min-width: auto;
        }
        
        .action-buttons {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);