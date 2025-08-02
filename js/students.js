document.addEventListener('DOMContentLoaded', () => {
  const openModalBtn  = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal         = document.getElementById('studentModal');
  const form          = document.getElementById('studentForm');
  const table         = document.getElementById('studentTable');

  let students = JSON.parse(localStorage.getItem('students')) || [];

  // Calculate age from DOB string (YYYY-MM-DD)
  function calculateAge(dob) {
    const diffMs = Date.now() - new Date(dob).getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  // Render the students table
  function render() {
    table.innerHTML = `
      <tr>
        <th>Name</th><th>Mem#</th><th>Sex</th><th>Email</th><th>Phone</th>
        <th>DOB</th><th>Age</th><th>Dietary</th><th>Medication</th>
        <th>Disabilities</th><th>Address</th><th>Action</th>
      </tr>`;
    students.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.membership}</td>
        <td>${s.sex}</td>
        <td>${s.email}</td>
        <td>${s.phone}</td>
        <td>${s.dob}</td>
        <td>${s.age}</td>
        <td>${s.dietary}</td>
        <td>${s.medication}</td>
        <td>${s.disabilities}</td>
        <td>${s.address}</td>
        <td><button data-index="${i}" class="delete">Delete</button></td>
      `;
      table.appendChild(tr);
    });
    // Notify flights.js of updates
    window.dispatchEvent(new Event('students-updated'));
  }

  function save() {
    localStorage.setItem('students', JSON.stringify(students));
  }

  // Modal open/close
  openModalBtn.onclick = () => modal.classList.add('active');
  closeModalBtn.onclick = () => {
    modal.classList.remove('active');
    form.reset();
  };
  // Click outside modal-content closes
  modal.onclick = e => {
    if (e.target === modal) {
      modal.classList.remove('active');
      form.reset();
    }
  };

  // Handle form submission
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const student = {
      name:         data.get('name'),
      membership:   data.get('membership'),
      sex:          data.get('sex'),
      email:        data.get('email'),
      phone:        data.get('phone'),
      dob:          data.get('dob'),
      age:          calculateAge(data.get('dob')),
      dietary:      data.get('dietary'),
      medication:   data.get('medication'),
      disabilities: data.get('disabilities'),
      address:      data.get('address')
    };
    students.push(student);
    save();
    form.reset();
    modal.classList.remove('active');
    render();
  });

  // Handle deletes
  table.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
      students.splice(e.target.dataset.index, 1);
      save();
      render();
    }
  });

  // Initial render
  render();
});
