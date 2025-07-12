let editingEmployeeId = null;
let filteredEmployees = [...employees];
let filterPanelOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderEmployees();
    setupEventListeners();
    populateFilterOptions();
});

// Event Listeners Setup
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', handleSort);
    
    // Filter toggle
    document.getElementById('filterToggle').addEventListener('click', toggleFilterPanel);
    
    // Filter inputs
    document.getElementById('filterFirstName').addEventListener('input', applyFilters);
    document.getElementById('filterDepartment').addEventListener('change', applyFilters);
    document.getElementById('filterRole').addEventListener('change', applyFilters);
    
    // Form submission
    document.getElementById('employeeForm').addEventListener('submit', handleFormSubmit);
    
    // Modal close on backdrop click
    document.getElementById('formModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideForm();
        }
    });

    // Close filter panel when clicking outside
    document.addEventListener('click', function(e) {
        const filterPanel = document.getElementById('filterPanel');
        const filterToggle = document.getElementById('filterToggle');
        
        if (filterPanelOpen && !filterPanel.contains(e.target) && !filterToggle.contains(e.target)) {
            toggleFilterPanel();
        }
    });
}

// Toggle Filter Panel - Right Side
function toggleFilterPanel() {
    filterPanelOpen = !filterPanelOpen;
    const filterPanel = document.getElementById('filterPanel');
    const contentLeft = document.getElementById('contentLeft');
    const filterBtn = document.getElementById('filterToggle');
    
    if (filterPanelOpen) {
        filterPanel.classList.add('show');
        contentLeft.classList.add('filter-open');
        filterBtn.innerHTML = '<span>🔍</span> Hide Filters';
    } else {
        filterPanel.classList.remove('show');
        contentLeft.classList.remove('filter-open');
        filterBtn.innerHTML = '<span>🔍</span> Filters';
    }
}

// Populate filter dropdown options
function populateFilterOptions() {
    const departments = [...new Set(employees.map(emp => emp.department))];
    const roles = [...new Set(employees.map(emp => emp.role))];
    
    const deptSelect = document.getElementById('filterDepartment');
    const roleSelect = document.getElementById('filterRole');
    
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        deptSelect.appendChild(option);
    });
    
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleSelect.appendChild(option);
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredEmployees = employees.filter(employee => 
        employee.firstName.toLowerCase().includes(searchTerm) ||
        employee.lastName.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm)
    );
    
    renderEmployees();
}

// Sort functionality
function handleSort() {
    const sortBy = document.getElementById('sortBy').value;
    
    if (sortBy === 'firstName') {
        filteredEmployees.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === 'lastName') {
        filteredEmployees.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (sortBy === 'department') {
        filteredEmployees.sort((a, b) => a.department.localeCompare(b.department));
    } else if (sortBy === 'role') {
        filteredEmployees.sort((a, b) => a.role.localeCompare(b.role));
    }
    
    renderEmployees();
}

// Filter functionality
function applyFilters() {
    const firstNameFilter = document.getElementById('filterFirstName').value.toLowerCase();
    const departmentFilter = document.getElementById('filterDepartment').value;
    const roleFilter = document.getElementById('filterRole').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredEmployees = employees.filter(employee => {
        const matchesFirstName = !firstNameFilter || employee.firstName.toLowerCase().includes(firstNameFilter);
        const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
        const matchesRole = !roleFilter || employee.role === roleFilter;
        const matchesSearch = !searchTerm || 
            employee.firstName.toLowerCase().includes(searchTerm) ||
            employee.lastName.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm);
        
        return matchesFirstName && matchesDepartment && matchesRole && matchesSearch;
    });
    
    renderEmployees();
}

function resetFilters() {
    document.getElementById('filterFirstName').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterRole').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortBy').value = '';
    
    filteredEmployees = [...employees];
    renderEmployees();
}

// Render employees
function renderEmployees() {
    const grid = document.getElementById('employeeGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredEmployees.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        grid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        grid.innerHTML = filteredEmployees.map(employee => `
            <div class="employee-card">
                <h3>${employee.firstName} ${employee.lastName}</h3>
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Role:</strong> ${employee.role}</p>
                <div class="employee-actions">
                    <button class="btn btn-edit" onclick="editEmployee(${employee.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteEmployee(${employee.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

// Show add form
function showAddForm() {
    editingEmployeeId = null;
    document.getElementById('formTitle').textContent = 'Add Employee';
    document.getElementById('employeeForm').reset();
    document.getElementById('formModal').classList.add('show');
    
    // Update submit button text
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.textContent = 'Add Employee';
}

// Edit employee
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    editingEmployeeId = id;
    document.getElementById('formTitle').textContent = 'Edit Employee';
    
    document.getElementById('firstName').value = employee.firstName;
    document.getElementById('lastName').value = employee.lastName;
    document.getElementById('email').value = employee.email;
    document.getElementById('department').value = employee.department;
    document.getElementById('role').value = employee.role;
    
    document.getElementById('formModal').classList.add('show');
    
    // Update submit button text
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.textContent = 'Update Employee';
}

// Delete employee
function deleteEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
        employees = employees.filter(emp => emp.id !== id);
        filteredEmployees = filteredEmployees.filter(emp => emp.id !== id);
        renderEmployees();
        
        // Show success message
        showToast('Employee deleted successfully!', 'success');
    }
}

// Hide form
function hideForm() {
    document.getElementById('formModal').classList.remove('show');
    editingEmployeeId = null;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value,
        role: document.getElementById('role').value
    };
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || !formData.role) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (editingEmployeeId) {
        // Update existing employee
        const index = employees.findIndex(emp => emp.id === editingEmployeeId);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...formData };
            showToast('Employee updated successfully!', 'success');
        }
    } else {
        // Add new employee
        const newEmployee = {
            id: getNextId(),
            ...formData
        };
        employees.push(newEmployee);
        showToast('Employee added successfully!', 'success');
    }
    
    // Refresh the display
    filteredEmployees = [...employees];
    renderEmployees();
    hideForm();
}

// Get next available ID
function getNextId() {
    return Math.max(...employees.map(emp => emp.id)) + 1;
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    // Set background color based on type
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add CSS for toast animations
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
