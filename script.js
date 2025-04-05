// Premium Student Management System - script.js

let students = JSON.parse(localStorage.getItem('students')) || [];
let currentEditId = null;
let filterValue = 'all';

document.addEventListener('DOMContentLoaded', function () {
  if (students.length > 0) {
    const viewButton = document.querySelector('.buttons button:nth-child(2)');
    const dot = document.createElement('span');
    dot.className = 'notification-dot';
    viewButton.style.position = 'relative';
    viewButton.appendChild(dot);
    viewButton.style.animation = 'pulse 2s infinite';
  }

  document.getElementById('studentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addOrUpdateStudent();
  });

  initGpaGrades();
  showWelcomeMessage();
});

function showWelcomeMessage() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = today.toLocaleDateString('en-US', options);
  const welcomeMsg = document.createElement('div');
  welcomeMsg.style.padding = '1rem 2rem';
  welcomeMsg.style.backgroundColor = 'var(--primary-transparent)';
  welcomeMsg.style.borderRadius = 'var(--border-radius)';
  welcomeMsg.style.margin = '0 2rem 1.5rem';
  welcomeMsg.style.fontSize = '0.875rem';
  welcomeMsg.style.color = 'var(--dark)';
  welcomeMsg.style.textAlign = 'center';
  welcomeMsg.style.animation = 'fadeIn 0.6s ease-out forwards';

  const hour = today.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
  else if (hour >= 18) greeting = 'Good evening';

  welcomeMsg.innerHTML = `<strong>${greeting}!</strong> Today is ${dateStr}. Welcome to your Student Management System.`;
  const buttonsDiv = document.querySelector('.buttons');
  buttonsDiv.parentNode.insertBefore(welcomeMsg, buttonsDiv.nextSibling);

  setTimeout(() => {
    welcomeMsg.style.opacity = '0';
    welcomeMsg.style.height = '0';
    welcomeMsg.style.margin = '0 2rem';
    welcomeMsg.style.padding = '0 2rem';
    welcomeMsg.style.overflow = 'hidden';
    welcomeMsg.style.transition = 'all 0.5s ease-out';
  }, 10000);
}

function initGpaGrades() {
  window.getGpaLetter = function (gpa) {
    gpa = parseFloat(gpa);
    if (gpa >= 3.7) return 'A';
    else if (gpa >= 3.0) return 'B';
    else if (gpa >= 2.0) return 'C';
    else if (gpa >= 1.0) return 'D';
    else return 'F';
  };
}

function showAddForm() {
  document.getElementById('studentList').style.display = 'none';
  document.getElementById('searchStudentForm').style.display = 'none';
  const formContainer = document.getElementById('addStudentForm');
  formContainer.style.display = 'block';

  if (currentEditId !== null) {
    document.getElementById('studentForm').reset();
    currentEditId = null;
    const submitBtn = document.querySelector('#studentForm button[type="submit"]');
    submitBtn.textContent = 'Add Student';
  }

  setTimeout(() => {
    document.getElementById('name').focus();
  }, 100);
}

function closeAddForm() {
  document.getElementById('addStudentForm').style.display = 'none';
  document.getElementById('studentForm').reset();
}

function addOrUpdateStudent() {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const grade = document.getElementById('grade').value;
  const section = document.getElementById('section').value;
  const gpa = document.getElementById('gpa').value;

  if (currentEditId !== null) {
    const index = students.findIndex((s) => s.id === currentEditId);
    if (index !== -1) {
      students[index] = {
        ...students[index],
        name,
        age,
        grade,
        section,
        gpa,
        updatedAt: new Date().toISOString(),
      };
      showNotification('Student updated successfully!', 'success');
    }
    currentEditId = null;
  } else {
    const newStudent = {
      id: Date.now().toString(),
      name,
      age,
      grade,
      section,
      gpa,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };
    students.push(newStudent);
    showNotification('Student added successfully!', 'success');
  }

  saveData();
  document.getElementById('studentForm').reset();
  closeAddForm();
  showStudentList();
}

function showStudentList() {
  document.getElementById('addStudentForm').style.display = 'none';
  document.getElementById('searchStudentForm').style.display = 'none';
  const tableContainer = document.getElementById('studentList');
  tableContainer.style.display = 'block';

  const viewButton = document.querySelector('.buttons button:nth-child(2)');
  const dot = viewButton.querySelector('.notification-dot');
  if (dot) dot.remove();
  viewButton.style.animation = '';

  const tableBody = document.querySelector('#studentTable tbody');
  tableBody.innerHTML = '';

  if (students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No students found. Click on "Add Student" to add your first student.</p>
        </td>
      </tr>
    `;
    return;
  }

  students.forEach((student) => {
    const row = document.createElement('tr');
    const updatedAt = new Date(student.updatedAt);
    const now = new Date();
    const diffTime = Math.abs(now - updatedAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let timeAgo = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    const gpaLetter = window.getGpaLetter(student.gpa);

    row.innerHTML = `
      <td data-label="Name">${student.name}</td>
      <td data-label="Age">${student.age}</td>
      <td data-label="Grade">${student.grade}</td>
      <td data-label="Section">${student.section}</td>
      <td data-label="GPA" data-gpa="${gpaLetter}">${student.gpa}</td>
      <td data-label="Actions">
        <div class="actions">
          <button onclick="editStudent('${student.id}')">Edit</button>
          <button onclick="deleteStudent('${student.id}')">Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function editStudent(id) {
  const student = students.find((s) => s.id === id);
  if (student) {
    currentEditId = id;
    document.getElementById('addStudentForm').style.display = 'block';
    document.getElementById('studentList').style.display = 'none';
    document.getElementById('name').value = student.name;
    document.getElementById('age').value = student.age;
    document.getElementById('grade').value = student.grade;
    document.getElementById('section').value = student.section;
    document.getElementById('gpa').value = student.gpa;
    const submitBtn = document.querySelector('#studentForm button[type="submit"]');
    submitBtn.textContent = 'Update Student';
    document.getElementById('name').focus();
  }
}

function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    students = students.filter((s) => s.id !== id);
    saveData();
    showStudentList();
    showNotification('Student deleted successfully', 'warning');
  }
}

function showNotification(message, type) {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 4000);
}

function saveData() {
  localStorage.setItem('students', JSON.stringify(students));
}
