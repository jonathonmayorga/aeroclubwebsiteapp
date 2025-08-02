document.addEventListener('DOMContentLoaded', () => {
  // … existing modal & form setup …
  const profileModal   = document.getElementById('profileModal');
  const closeProfile   = document.getElementById('closeProfileBtn');
  const profileContent = document.getElementById('profileContent');
  const table          = document.getElementById('studentTable');

  let students = JSON.parse(localStorage.getItem('students')) || [];

  function calculateAge(dob) {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  }

  function render() {
    table.innerHTML = `
      <tr>
        <th>Name</th><th>Membership#</th><th>Sex</th><th>DOB</th>
        <th>Action</th>
      </tr>`;
    students.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="name-cell" data-index="${i}">${s.name}</td>
        <td>${s.membership}</td>
        <td>${s.sex}</td>
        <td>${s.dob}</td>
        <td><button data-index="${i}" class="delete">Delete</button></td>`;
      table.appendChild(tr);
    });
    attachListeners();
    window.dispatchEvent(new Event('students-updated'));
  }

  function attachListeners() {
    // Delete buttons
    table.querySelectorAll('.delete').forEach(btn =>
      btn.onclick = () => {
        students.splice(btn.dataset.index, 1);
        saveAndRender();
      });

    // Name‐cell clicks
    table.querySelectorAll('.name-cell').forEach(cell =>
      cell.onclick = () => showProfile(+cell.dataset.index));
  }

  function showProfile(idx) {
    const s = students[idx];
    // build HTML with all fields
    profileContent.innerHTML = `
      <p><strong>Name:</strong> ${s.name}</p>
      <p><strong>Membership #:</strong> ${s.membership}</p>
      <p><strong>Sex:</strong> ${s.sex}</p>
      <p><strong>Email:</strong> ${s.email}</p>
      <p><strong>Phone:</strong> ${s.phone}</p>
      <p><strong>DOB:</strong> ${s.dob}</p>
      <p><strong>Age:</strong> ${s.age} years</p>
      <p><strong>Dietary Requirements:</strong> ${s.dietary || 'N/A'}</p>
      <p><strong>Medication:</strong> ${s.medication || 'N/A'}</p>
      <p><strong>Disabilities:</strong> ${s.disabilities || 'N/A'}</p>
      <p><strong>Address:</strong> ${s.address || 'N/A'}</p>
    `;
    profileModal.classList.add('active');
  }

  closeProfile.onclick = () => profileModal.classList.remove('active');
  profileModal.onclick = e => {
    if (e.target === profileModal) {
      profileModal.classList.remove('active');
    }
  };

  function saveAndRender() {
    localStorage.setItem('students', JSON.stringify(students));
    render();
  }

  // … your existing add‐student modal code, then finally:
  render();
});
