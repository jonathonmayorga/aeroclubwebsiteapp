document.addEventListener('DOMContentLoaded', () => {
  const openBtn    = document.getElementById('openModalBtn');
  const closeBtn   = document.getElementById('closeModalBtn');
  const modal      = document.getElementById('instructorModal');
  const form       = document.getElementById('instructorForm');
  const list       = document.getElementById('instructorList');
  const pModal     = document.getElementById('profileModal');
  const closeProf  = document.getElementById('closeProfileBtn');
  const pContent   = document.getElementById('profileContent');

  let instructors = JSON.parse(localStorage.getItem('instructors')) || [];

  // Utility: calculate months until date
  function monthsUntil(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    return (then.getFullYear()-now.getFullYear())*12 + (then.getMonth()-now.getMonth());
  }

  // Determine CSS class based on expiry
  function dateClass(d) {
    const days = (new Date(d) - new Date())/ (1000*60*60*24);
    if (days < 0)                return 'date-expired';
    if (days < 30)               return 'date-soon';
    // 30–90 days: default white
    return 'date-valid';
  }

  // Render cards
  function render() {
    list.innerHTML = '';
    instructors.forEach((i,idx) => {
      const card = document.createElement('div');
      card.className = 'instructor-card';
      card.innerHTML = `
        <button class="delete-btn" data-index="${idx}">&times;</button>
        <h3 data-index="${idx}" class="name-cell">${i.name}</h3>
        <p>ARN: ${i.arn}</p>
      `;
      list.appendChild(card);
    });
    attachListeners();
  }

  function attachListeners() {
    list.querySelectorAll('.delete-btn').forEach(btn =>
      btn.onclick = () => {
        instructors.splice(+btn.dataset.index,1);
        saveAndRender();
      });
    list.querySelectorAll('.name-cell').forEach(h3 =>
      h3.onclick = () => showProfile(+h3.dataset.index));
  }

  function showProfile(idx) {
    const ins = instructors[idx];
    const fields = ['med1','med2','damp','wwcc'];
    pContent.innerHTML = `
      <p><strong>Name:</strong> ${ins.name}</p>
      <p><strong>ARN:</strong> ${ins.arn}</p>
      <p><strong>Grade:</strong> ${ins.grade}</p>
      ${fields.map(f => {
        const label = ({
          med1: 'Medical 1',
          med2: 'Medical 2',
          damp: 'DAMP Course',
          wwcc: 'WWCC'
        })[f];
        return `<p class="${dateClass(ins[f])}"><strong>${label}:</strong> ${ins[f]}</p>`;
      }).join('')}
    `;
    pModal.classList.add('active');
  }

  function saveAndRender() {
    localStorage.setItem('instructors', JSON.stringify(instructors));
    render();
  }

  // Modal controls
  openBtn.onclick = () => modal.classList.add('active');
  closeBtn.onclick = () => {
    modal.classList.remove('active'); form.reset();
  };
  modal.onclick = e => {
    if (e.target===modal) { modal.classList.remove('active'); form.reset(); }
  };
  closeProf.onclick = () => pModal.classList.remove('active');
  pModal.onclick = e => {
    if (e.target===pModal) pModal.classList.remove('active');
  };

  // Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const ins = {
      name:  d.get('name'),
      arn:   d.get('arn'),
      grade: d.get('grade'),
      med1:  d.get('med1'),
      med2:  d.get('med2'),
      damp:  d.get('damp'),
      wwcc:  d.get('wwcc')
    };
    instructors.push(ins);
    saveAndRender();
    form.reset();
    modal.classList.remove('active');
  });

  // Initial load
  render();
});
