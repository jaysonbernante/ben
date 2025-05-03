// Register Page Functions
function registerUser() {
  const id = document.getElementById('id')?.value.trim();
  const fullname = document.getElementById('fullname')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const error = document.getElementById('error');

  if (!id || !fullname || !password) {
      error.style.display = 'block';
      return;
  }

  // Retrieve existing users from localStorage or initialize empty array
  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if ID already exists
  if (users.some(user => user.id === id)) {
      error.textContent = 'ID already exists.';
      error.style.display = 'block';
      return;
  }

  // Add new user to localStorage
  users.push({ id, fullname, password, status: 'pending' });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful! Awaiting approval.');
  // Clear form
  document.getElementById('id').value = '';
  document.getElementById('fullname').value = '';
  document.getElementById('password').value = '';
  error.style.display = 'none';
}

// Approval Page Functions
function checkSession() {
  const adminSession = sessionStorage.getItem('adminSession');
  const loginContainer = document.getElementById('loginContainer');
  const userTable = document.getElementById('userTable');

  if (adminSession) {
      loginContainer.classList.add('hidden');
      userTable.classList.remove('hidden');
      loadUsers();
  } else {
      loginContainer.classList.remove('hidden');
      userTable.classList.add('hidden');
  }
}

function adminLogin() {
  // Simulate admin login (in a real system, use proper authentication)
  const password = prompt('Enter admin password:');
  if (password === 'admin123') { // Simple password check for demo
      sessionStorage.setItem('adminSession', 'active');
      checkSession();
  } else {
      alert('Invalid password.');
  }
}

function loadUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const tableBody = document.getElementById('userTableBody');
  tableBody.innerHTML = '';

  if (users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="no-users">No users to display.</td></tr>';
      return;
  }

  users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.fullname}</td>
          <td>${user.password}</td>
          <td>${user.status}</td>
          <td>
              ${user.status === 'pending' ? 
                  `<button class="approve" onclick="approveUser('${user.id}')">Approve</button>
                   <button class="delete" onclick="deleteUser('${user.id}')">Delete</button>` 
                  : ''}
          </td>
      `;
      tableBody.appendChild(row);
  });
}

function approveUser(id) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.map(user => 
      user.id === id ? { ...user, status: 'approved' } : user
  );
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
}

function deleteUser(id) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.filter(user => user.id !== id);
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('userTable')) {
      // Approval page
      checkSession();
  }
  // Register page doesn't need initialization
});