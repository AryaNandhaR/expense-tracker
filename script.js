// Data Structures & State
let currentUser = null;
let userData = {
    monthlyLimit: 1000,
    expenses: []
};

// Initialize application
window.onload = () => {
    // Default current date on expense form
    const expDateElem = document.getElementById('exp-date');
    if (expDateElem) {
        expDateElem.value = new Date().toISOString().substring(0, 10);
    }
    
    checkPersistedSession();
};

// Navigation logic for Frame 1 to Frame 2
function goToAuth() {
    document.getElementById('frame-splash').classList.add('hidden');
    document.getElementById('frame-auth').classList.remove('hidden');
}

// Handle Sign In / Registration (Frame 2)
function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('auth-username').value.trim();
    if (!username) return;

    currentUser = username;
    loadUserData();

    document.getElementById('frame-auth').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('user-display-name').innerText = currentUser;

    // Save persistent login flag
    localStorage.setItem('exp_tracker_active_user', currentUser);

    renderAll();
}

function logout() {
    localStorage.removeItem('exp_tracker_active_user');
    currentUser = null;
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('frame-auth').classList.remove('hidden');
}

function checkPersistedSession() {
    const savedUser = localStorage.getItem('exp_tracker_active_user');
    if (savedUser) {
        currentUser = savedUser;
        loadUserData();
        document.getElementById('frame-splash').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('user-display-name').innerText = currentUser;
        renderAll();
    }
}

// Local Storage Handling (Persistent Data per User)
function loadUserData() {
    const stored = localStorage.getItem(`exp_data_${currentUser}`);
    if (stored) {
        userData = JSON.parse(stored);
    } else {
        userData = {
            monthlyLimit: 1000,
            expenses: []
        };
        saveUserData();
    }
}

function saveUserData() {
    localStorage.setItem(`exp_data_${currentUser}`, JSON.stringify(userData));
}

// Frame Switcher Logic
function switchFrame(frameName, e) {
    const frames = document.querySelectorAll('.frame');
    frames.forEach(f => f.classList.remove('active'));

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));

    document.getElementById(`frame-${frameName}`).classList.add('active');
    
    // Set active navigation highlight
    if (e && e.currentTarget) {
        e.currentTarget.classList.add('active');
    }

    if (frameName === 'analytics') {
        renderAnalytics();
    }
}

// Expense Management
function addExpense(e) {
    e.preventDefault();
    const title = document.getElementById('exp-title').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);
    const category = document.getElementById('exp-category').value;
    const date = document.getElementById('exp-date').value;

    const newExpense = {
        id: Date.now(),
        title,
        amount,
        category,
        date
    };

    userData.expenses.push(newExpense);
    saveUserData();
    
    // Reset form inputs
    document.getElementById('exp-title').value = '';
    document.getElementById('exp-amount').value = '';

    renderAll();
}

function deleteExpense(id) {
    userData.expenses = userData.expenses.filter(item => item.id !== id);
    saveUserData();
    renderAll();
}

function updateLimit(e) {
    e.preventDefault();
    const limitVal = parseFloat(document.getElementById('limit-input').value);
    userData.monthlyLimit = limitVal;
    saveUserData();
    renderAll();
    alert('Monthly budget limit updated!');
}

// Calculation Helpers
function getDailyTotal() {
    const todayStr = new Date().toISOString().substring(0, 10);
    return userData.expenses
        .filter(exp => exp.date === todayStr)
        .reduce((acc, exp) => acc + exp.amount, 0);
}

function getMonthlyTotal() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return userData.expenses
        .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        })
        .reduce((acc, exp) => acc + exp.amount, 0);
}

// Render Functions
function renderAll() {
    renderDashboard();
    renderHistory();
    checkLimitNotifications();
    document.getElementById('limit-input').value = userData.monthlyLimit;
}

function renderDashboard() {
    const daily = getDailyTotal();
    const monthly = getMonthlyTotal();

    document.getElementById('dash-daily').innerText = `$${daily.toFixed(2)}`;
    document.getElementById('dash-monthly').innerText = `$${monthly.toFixed(2)}`;
    document.getElementById('dash-limit').innerText = `$${userData.monthlyLimit.toFixed(2)}`;

    // Render Recent Table (Last 5)
    const recentBody = document.getElementById('recent-table-body');
    recentBody.innerHTML = '';
    
    const sorted = [...userData.expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    sorted.forEach(exp => {
        recentBody.innerHTML += `
            <tr>
                <td>${exp.date}</td>
                <td>${exp.title}</td>
                <td>${exp.category}</td>
                <td style="font-weight:bold; color:var(--primary-dark);">$${exp.amount.toFixed(2)}</td>
            </tr>
        `;
    });
}

function renderHistory() {
    const historyBody = document.getElementById('history-table-body');
    historyBody.innerHTML = '';

    const sorted = [...userData.expenses].sort((a,b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(exp => {
        historyBody.innerHTML += `
            <tr>
                <td>${exp.date}</td>
                <td>${exp.title}</td>
                <td>${exp.category}</td>
                <td style="font-weight:bold;">$${exp.amount.toFixed(2)}</td>
                <td>
                    <button onclick="deleteExpense(${exp.id})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-weight:bold;">Delete</button>
                </td>
            </tr>
        `;
    });
}

function checkLimitNotifications() {
    const monthlyTotal = getMonthlyTotal();
    const limit = userData.monthlyLimit;
    const banner = document.getElementById('notification-banner');
    const text = document.getElementById('notification-text');

    if (monthlyTotal >= limit && limit > 0) {
        banner.className = 'alert-banner';
        text.innerText = `Warning: You have reached or exceeded your monthly budget limit of $${limit.toFixed(2)}! Current spending: $${monthlyTotal.toFixed(2)}`;
        banner.classList.remove('hidden');
    } else if (monthlyTotal >= limit * 0.85 && limit > 0) {
        banner.className = 'alert-banner warning';
        text.innerText = `Caution: You have used over 85% of your monthly budget limit. ($${monthlyTotal.toFixed(2)} / $${limit.toFixed(2)})`;
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}

function renderAnalytics() {
    const chartContainer = document.getElementById('bar-chart');
    chartContainer.innerHTML = '';

    // Group spending by category
    const categories = ['Development', 'Design', 'Marketing', 'Operations', 'Other'];
    const totals = {};

    categories.forEach(cat => totals[cat] = 0);
    userData.expenses.forEach(exp => {
        if (totals[exp.category] !== undefined) {
            totals[exp.category] += exp.amount;
        } else {
            totals['Other'] += exp.amount;
        }
    });

    const maxVal = Math.max(...Object.values(totals), 100);

    categories.forEach(cat => {
        const val = totals[cat];
        const heightPercent = (val / maxVal) * 100;

        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${Math.max(heightPercent, 2)}%`;

        bar.innerHTML = `
            <span class="bar-value">$${val.toFixed(0)}</span>
            <span class="bar-label">${cat}</span>
        `;

        chartContainer.appendChild(bar);
    });
}