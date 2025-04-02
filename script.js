// script.js

let students = [];

function showAddForm() {
  document.getElementById("addStudentForm").style.display = 'block';
  document.getElementById("studentList").style.display = 'none';
  document.getElementById("searchStudentForm").style.display = 'none';
}

function closeAddForm() {
  document.getElementById("addStudentForm").style.display = 'none';
}

function showStudentList() {
  document.getElementById("addStudentForm").style.display = 'none';
  document.getElementById("studentList").style.display = 'block';
  document.getElementById("searchStudentForm").style.display = 'none';
  displayStudents();
}

function closeStudentList() {
  document.getElementById("studentList").style.display = 'none';
}

function searchStudent() {
  document.getElementById("addStudentForm").style.display = 'none';
  document.getElementById("studentList").style.display = 'none';
  document.getElementById("searchStudentForm").style.display = 'block';
}

function closeSearchForm() {
  document.getElementById("searchStudentForm").style.display = 'none';
}

document.getElementById("studentForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const grade = document.getElementById("grade").value;
  const section = document.getElementById("section").value;
  const gpa = document.getElementById("gpa").value;

  if (name && age && grade && section && gpa) {
    const student = { name, age, grade, section, gpa };
    students.push(student);
    displayStudents();
    document.getElementById("studentForm").reset();
    closeAddForm();
  } else {
    alert("Please fill all fields.");
  }
});

function displayStudents() {
  const tableBody = document.getElementById("studentTable").getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Clear existing table rows

  students.forEach((student, index) => {
    const row = tableBody.insertRow();
    row.insertCell(0).innerText = student.name;
    row.insertCell(1).innerText = student.age;
    row.insertCell(2).innerText = student.grade;
    row.insertCell(3).innerText = student.section;
    row.insertCell(4).innerText = student.gpa;

    const actionsCell = row.insertCell(5);
    actionsCell.classList.add("actions");
    actionsCell.innerHTML = `<button onclick="deleteStudent(${index})">Delete</button> <button onclick="updateStudent(${index})">Update</button>`;
  });
}

function deleteStudent(index) {
  students.splice(index, 1);
  displayStudents();
}

function updateStudent(index) {
  const student = students[index];
  document.getElementById("name").value = student.name;
  document.getElementById("age").value = student.age;
  document.getElementById("grade").value = student.grade;
  document.getElementById("section").value = student.section;
  document.getElementById("gpa").value = student.gpa;

  showAddForm(); // Show the form to update student
  students.splice(index, 1); // Remove the old record
}

function performSearch() {
  const query = document.getElementById("searchQuery").value.toLowerCase();
  const results = students.filter(student => student.name.toLowerCase().includes(query));

  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = ''; // Clear previous results

  if (results.length > 0) {
    results.forEach(student => {
      const div = document.createElement("div");
      div.innerHTML = `Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}, Section: ${student.section}, GPA: ${student.gpa}`;
      resultsDiv.appendChild(div);
    });
  } else {
    resultsDiv.innerHTML = "No results found.";
  }
}

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
  alert("Data saved successfully!");
}

// Load data from localStorage when the page loads
window.onload = function() {
  const savedData = localStorage.getItem("students");
  if (savedData) {
    students = JSON.parse(savedData);
    displayStudents();
  }
}
