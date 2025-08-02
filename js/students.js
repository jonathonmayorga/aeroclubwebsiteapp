document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('studentForm');
  const table = document.getElementById('studentTable');
  let students = JSON.parse(localStorage.getItem('students')) || [];

  function render() {
    table.innerHTML = '<tr><th>Name</th><th>DOB</th><th>Membership#</th><th>Action</th></tr>';
    students.forEach((s,i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.dob}</td>
        <td>${s.membership}</td>
        <td><button data-index="${i}" class="delete">Delete</button></td>`;
      table.appendChild(tr);
    });
    // Tell flights.js to update its dropdowns:
    window.dispatchEvent(new Event('students-updated'));
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const { name, dob, membership } = form;
    students.push({ name: name.value, dob: dob.value, membership: membership.value });
    localStorage.setItem('students', JSON.stringify(students));
    form.reset();
    render();
  });

  table.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
      students.splice(e.target.dataset.index, 1);
      localStorage.setItem('students', JSON.stringify(students));
      render();
    }
  });

  render();
});
