document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('instructorForm');
  const table = document.getElementById('instructorTable');
  let instructors = JSON.parse(localStorage.getItem('instructors')) || [];

  function render() {
    table.innerHTML = '<tr><th>Name</th><th>Action</th></tr>';
    instructors.forEach((inst,i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${inst.name}</td>
        <td><button data-index="${i}" class="delete">Delete</button></td>`;
      table.appendChild(tr);
    });
    // Tell flights.js to update its dropdowns:
    window.dispatchEvent(new Event('instructors-updated'));
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value;
    instructors.push({ name });
    localStorage.setItem('instructors', JSON.stringify(instructors));
    form.reset();
    render();
  });

  table.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
      instructors.splice(e.target.dataset.index, 1);
      localStorage.setItem('instructors', JSON.stringify(instructors));
      render();
    }
  });

  render();
});
