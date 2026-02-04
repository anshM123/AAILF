// School Lost & Found - Main JS
// Handles navigation, form submissions, and localStorage backend

document.addEventListener('DOMContentLoaded', () => {
            // Demo filler items
            function addDemoItems() {
                console.log('Adding demo items');
                const demoItems = [
                    {
                        id: 1001,
                        type: 'lost',
                        name: 'Blue Water Bottle',
                        category: 'accessories',
                        description: 'A blue stainless steel water bottle with a dent on the side.',
                        date: '2026-01-15',
                        location: 'Gym',
                        email: 'student1@school.edu',
                        status: 'approved',
                        createdAt: '2026-01-15T10:00:00Z',
                        image: 'https://picsum.photos/300/200?random=1'
                    },
                    {
                        id: 1002,
                        type: 'found',
                        name: 'Black Hoodie',
                        category: 'clothing',
                        description: 'Black hoodie with white stripes on the sleeves.',
                        date: '2026-01-20',
                        location: 'Cafeteria',
                        held_at: 'Lost & Found Box',
                        email: 'staff@school.edu',
                        status: 'approved',
                        createdAt: '2026-01-20T12:00:00Z',
                        image: 'https://picsum.photos/300/200?random=2'
                    },
                    {
                        id: 1003,
                        type: 'lost',
                        name: 'Math Textbook',
                        category: 'books',
                        description: 'Calculus textbook, name written inside front cover.',
                        date: '2026-01-10',
                        location: 'Library',
                        email: 'student2@school.edu',
                        status: 'approved',
                        createdAt: '2026-01-10T09:00:00Z',
                        image: 'https://picsum.photos/300/200?random=3'
                    },
                    {
                        id: 1004,
                        type: 'found',
                        name: 'Wireless Earbuds',
                        category: 'electronics',
                        description: 'Pair of white wireless earbuds in a charging case.',
                        date: '2026-01-18',
                        location: 'Bus Stop',
                        held_at: 'Main Office',
                        email: 'busdriver@school.edu',
                        status: 'approved',
                        createdAt: '2026-01-18T08:30:00Z',
                        image: 'https://picsum.photos/300/200?random=4'
                    },
                    {
                        id: 1005,
                        type: 'lost',
                        name: 'Red Backpack',
                        category: 'accessories',
                        description: 'Red backpack with a science club patch.',
                        date: '2026-01-22',
                        location: 'Science Lab',
                        email: 'student3@school.edu',
                        status: 'approved',
                        createdAt: '2026-01-22T14:00:00Z',
                        image: 'https://picsum.photos/300/200?random=5'
                    },
                    {
                        id: 1006,
                        type: 'found',
                        name: 'Silver Watch',
                        category: 'accessories',
                        description: 'Analog silver watch, found near the playground.',
                        date: '2026-01-25',
                        location: 'Playground',
                        held_at: 'Lost & Found Box',
                        email: 'teacher@school.edu',
                        status: 'approved',
                        createdAt: '2026-01-25T15:00:00Z',
                        image: 'https://picsum.photos/300/200?random=6'
                    }
                ];
                state.items.approved = demoItems;
                saveData();
                console.log('Demo items added and saved');
            }
    // State
    const state = {
        currentUser: null,
        isAdmin: false,
        items: {
            pending: [],
            approved: []
        },
        adminCredentials: {
            username: 'Admin',
            password: '12345678'
        }
    };

    // Load data from localStorage
    function loadData() {
        const saved = localStorage.getItem('lostfound_data');
        if (saved) {
            state.items = JSON.parse(saved);
        }
        console.log('Loaded data:', state.items);
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('lostfound_data', JSON.stringify(state.items));
    }


    // Per-page logic
    // Home page: index.html
    if (document.getElementById('recent-items')) {
        console.log('Loading homepage, calling loadRecentItems');
        loadRecentItems();
    }

    // Report Lost page
    if (document.getElementById('lost-form')) {
        console.log('Loading report-lost page');
        // Form logic already present below
    }

    // Report Found page
    if (document.getElementById('found-form')) {
        console.log('Loading report-found page');
        // Form logic already present below
    }

    // Feed page
    if (document.getElementById('items-feed')) {
        console.log('Loading feed page');
        loadFeed();
    }

    // Admin Login page
    if (document.getElementById('login-form')) {
        console.log('Loading admin-login page');
        // Login form logic already present below
    }

    // Admin Dashboard page
    if (document.getElementById('pending-requests')) {
        console.log('Loading admin-dashboard page');
        loadAdminDashboard();
    }

    // Report Lost Item
    const lostForm = document.getElementById('lost-form');
    if (lostForm) {
        lostForm.addEventListener('submit', e => {
            e.preventDefault();
            const item = {
                id: Date.now(),
                type: 'lost',
                name: lostForm.querySelector('input[type="text"]').value,
                category: lostForm.querySelector('select').value,
                description: lostForm.querySelector('textarea').value,
                date: lostForm.querySelector('input[type="date"]').value,
                location: lostForm.querySelectorAll('input[type="text"]')[1].value,
                email: lostForm.querySelector('input[type="email"]').value,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            state.items.pending.push(item);
            console.log('Submitted lost item:', item);
            saveData();
            console.log('Data saved after lost submission, pending:', state.items.pending);
            alert('✅ Your lost item report has been submitted! Admin will review it soon.');
            lostForm.reset();
            window.location.href = 'index.html';
        });
    }

    // Report Found Item
    const foundForm = document.getElementById('found-form');
    if (foundForm) {
        foundForm.addEventListener('submit', e => {
            e.preventDefault();
            const item = {
                id: Date.now(),
                type: 'found',
                name: foundForm.querySelector('input[type="text"]').value,
                category: foundForm.querySelector('select').value,
                description: foundForm.querySelector('textarea').value,
                date: foundForm.querySelector('input[type="date"]').value,
                location: foundForm.querySelectorAll('input[type="text"]')[1].value,
                held_at: foundForm.querySelectorAll('input[type="text"]')[2]?.value || '',
                email: foundForm.querySelector('input[type="email"]').value,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            state.items.pending.push(item);
            console.log('Submitted found item:', item);
            saveData();
            alert('✅ Your found item report has been submitted! Admin will review it soon.');
            foundForm.reset();
            window.location.href = 'index.html';
        });
    }

    // Load Recent Items
    function loadRecentItems() {
        console.log('Loading recent items, approved:', state.items.approved);
        const recent = state.items.approved.slice(-3).reverse();
        const container = document.getElementById('recent-items');
        container.innerHTML = recent.length ? recent.map(item => renderItemCard(item)).join('') : '<p style="grid-column: 1/-1; text-align: center; color: #999;">No items found yet</p>';
    }

    // Load Feed
    function loadFeed() {
        const search = document.getElementById('search-input').value.toLowerCase();
        const typeFilter = document.getElementById('type-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;
        let filtered = state.items.approved.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
            const matchesType = !typeFilter || item.type === typeFilter;
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            return matchesSearch && matchesType && matchesCategory && item.type === 'lost';
        });
        const container = document.getElementById('items-feed');
        container.innerHTML = filtered.length ? filtered.map(item => renderItemCard(item)).join('') : '<p style="grid-column: 1/-1; text-align: center; color: #999;">No lost items found</p>';
    }

    // Render Item Card
    function renderItemCard(item) {
        const icon = item.type === 'lost' ? '❌' : '✅';
        const typeLabel = item.type === 'lost' ? 'LOST' : 'FOUND';
        const dateStr = new Date(item.date).toLocaleDateString();
        const imageHtml = item.image ? `<img src="${item.image}" alt="${item.name}">` : (item.type === 'lost' ? '📍' : '📦');
        return `
            <div class="item-card" onclick="showItemDetail('${item.id}')">
                <div class="item-image">${imageHtml}</div>
                <div class="item-content">
                    <div class="item-header">
                        <div class="item-title">${item.name}</div>
                        <span class="status-badge status-approved">${icon} ${typeLabel}</span>
                    </div>
                    <span class="item-category">${item.category}</span>
                    <p class="item-description">${item.description.substring(0, 100)}...</p>
                    <div class="item-meta">
                        📅 ${dateStr} | 📍 ${item.location}
                    </div>
                </div>
            </div>
        `;
    }

    // Show Item Detail (modal)
    window.showItemDetail = function(itemId) {
        const item = [...state.items.pending, ...state.items.approved].find(i => i.id == itemId);
        if (!item) return;
        const held = item.held_at ? `<p><strong>Held at:</strong> ${item.held_at}</p>` : '';
        const typeLabel = item.type === 'lost' ? '❌ LOST ITEM' : '✅ FOUND ITEM';
        document.getElementById('modal-body').innerHTML = `
            <h3>${typeLabel}</h3>
            <p><strong>Name:</strong> ${item.name}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            ${held}
            <p style="color: #999; font-size: 0.9rem;">Posted on ${new Date(item.createdAt).toLocaleDateString()}</p>
        `;
        document.getElementById('item-modal').classList.add('active');
    }

    // Close Modal
    window.closeModal = function() {
        document.getElementById('item-modal').classList.remove('active');
    }

    // Admin Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === state.adminCredentials.username && password === state.adminCredentials.password) {
                state.isAdmin = true;
                state.currentUser = username;
                localStorage.setItem('admin_session', JSON.stringify({ user: username, time: Date.now() }));
                window.location.href = 'admin-dashboard.html';
            } else {
                document.getElementById('login-message').innerHTML = '<div class="error-message">Invalid credentials</div>';
            }
        });
    }

    // Load Admin Dashboard
    function loadAdminDashboard() {
        console.log('Loading admin dashboard');
        loadPendingRequests();
        loadApprovedItems();
    }

    // Load Pending Requests
    function loadPendingRequests() {
        console.log('Loading pending requests:', state.items.pending);
        const container = document.getElementById('pending-requests');
        container.innerHTML = state.items.pending.length ? state.items.pending.map(item => `
            <div class="request-card">
                <h4>${item.name}</h4>
                <p><strong>Type:</strong> ${item.type.toUpperCase()}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p style="color: #666; font-size: 0.9rem;"><strong>Email:</strong> ${item.email}</p>
                <div class="request-actions">
                    <button class="btn btn-success" data-approve="${item.id}">Approve</button>
                    <button class="btn btn-danger" data-reject="${item.id}">Reject</button>
                </div>
            </div>
        `).join('') : '<p style="grid-column: 1/-1;">No pending requests</p>';
        // Add event listeners for approve/reject
        container.querySelectorAll('[data-approve]').forEach(btn => {
            btn.addEventListener('click', () => approveItem(btn.getAttribute('data-approve')));
        });
        container.querySelectorAll('[data-reject]').forEach(btn => {
            btn.addEventListener('click', () => rejectItem(btn.getAttribute('data-reject')));
        });
    }

    // Load Approved Items
    function loadApprovedItems() {
        const container = document.getElementById('approved-requests');
        container.innerHTML = state.items.approved.length ? state.items.approved.map(item => `
            <div class="request-card approved">
                <h4>${item.name}</h4>
                <p><strong>Type:</strong> ${item.type.toUpperCase()}</p>
                <p><strong>Status:</strong> <span class="status-badge status-approved">Approved</span></p>
                <div class="request-actions">
                    <button class="btn btn-danger" data-delete="${item.id}">Delete</button>
                </div>
            </div>
        `).join('') : '<p style="grid-column: 1/-1;">No approved items</p>';
        // Add event listeners for delete
        container.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', () => deleteItem(btn.getAttribute('data-delete')));
        });
    }

    // Approve Item
    function approveItem(itemId) {
        const index = state.items.pending.findIndex(i => i.id == itemId);
        if (index !== -1) {
            const item = state.items.pending[index];
            item.status = 'approved';
            state.items.approved.push(item);
            state.items.pending.splice(index, 1);
            saveData();
            loadAdminDashboard();
            alert('✅ Item approved and posted!');
        }
    }

    // Reject Item
    function rejectItem(itemId) {
        const index = state.items.pending.findIndex(i => i.id == itemId);
        if (index !== -1) {
            state.items.pending.splice(index, 1);
            saveData();
            loadAdminDashboard();
            alert('❌ Request rejected');
        }
    }

    // Delete Item
    function deleteItem(itemId) {
        if (confirm('Delete this item?')) {
            const index = state.items.approved.findIndex(i => i.id == itemId);
            if (index !== -1) {
                state.items.approved.splice(index, 1);
                saveData();
                loadAdminDashboard();
            }
        }
    }

    // Admin Logout
    window.adminLogout = function() {
        state.isAdmin = false;
        state.currentUser = null;
        localStorage.removeItem('admin_session');
        window.location.href = 'index.html';
    }

    // Search/Filter handlers
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    if (searchInput) searchInput.addEventListener('input', loadFeed);
    if (categoryFilter) categoryFilter.addEventListener('change', loadFeed);

    // Initialize app
    loadData();
    console.log('After loadData, state.items:', state.items);
    if (state.items.approved.length === 0) {
        console.log('No approved items, adding demo items');
        addDemoItems();
    } else {
        console.log('Approved items exist, not adding demo');
    }
});
