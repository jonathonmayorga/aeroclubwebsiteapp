document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addFlight');
  const table  = document.getElementById('flightsTable');
  const LESSONS = [
    "Effects of Controls","Straight & Level","Climbing & Descending","Turning","Stalling",
    "Consolidation & Circuit Introduction","Circuits","Circuits: Flapless & Go Arounds",
    "Circuits: Emergencies","Circuits: Pre Solo","Solo Circuits","Circuit Consolidation",
    "Advanced Stalling","Forced Landings","Steep Turns","Crosswind Circuits",
    "Pre Training Area Solo","First Training Area Solo","Short Field Take Off & Landing",
    "Consolidation","Precautionary Search","Basic Instrument Flight","Pre Licence Flight Check",
    "RPL Flight Test","PARO + CTR Endorsement Check","NAVEX","Private Hire",
    "Standardisation & Proficiency check","Flight Proficiency Check","Other"
  ];

  let flights     = JSON.parse(localStorage.getItem('flights'))     || [];
  let students    = JSON.parse(localStorage.getItem('students'))    || [];
  let instructors = JSON.parse(localStorage.getItem('instructors')) || [];

  // Re-load dropdown data when lists change
  window.addEventListener('students-updated',    () => students    = JSON.parse(localStorage.getItem('students')));
  window.addEventListener('instructors-updated', () => instructors = JSON.parse(localStorage.getItem('instructors')));

  function render() {
    table.innerHTML = `
      <tr>
        <th>Student</th><th>Lesson Type</th><th>Instructor</th><th>Action</th>
      </tr>`;
    flights.forEach((f,i) => {
      const tr = document.createElement('tr');
      // Build <select> for each column
      const studentOpts = students
        .map((s,idx) => `<option value="${idx}" ${f.student==idx?'selected':''}>${s.name}</option>`)
        .join('');
      const lessonOpts  = LESSONS
        .map(l => `<option value="${l}" ${f.lesson===l?'selected':''}>${l}</option>`)
        .join('');
      const instrOpts   = instructors
        .map((ins,idx) => `<option value="${idx}" ${f.instructor==idx?'selected':''}>${ins.name}</option>`)
        .join('');

      tr.innerHTML = `
        <td><select class="student-select">
          <option value="">—select—</option>${studentOpts}
        </select></td>
        <td><select class="lesson-select">
          <option value="">—select—</option>${lessonOpts}
        </select></td>
        <td><select class="instr-select">
          <option value="">—select—</option>${instrOpts}
        </select></td>
        <td><button data-index="${i}" class="delete">Delete</button></td>`;
      table.appendChild(tr);
    });
    attachListeners();
  }

  function attachListeners() {
    document.querySelectorAll('.student-select').forEach((sel,i) =>
      sel.onchange = () => update(i,'student',sel.value));
    document.querySelectorAll('.lesson-select').forEach((sel,i) =>
      sel.onchange = () => update(i,'lesson',sel.value));
    document.querySelectorAll('.instr-select').forEach((sel,i) =>
      sel.onchange = () => update(i,'instructor',sel.value));
    document.querySelectorAll('.delete').forEach(btn =>
      btn.onclick = () => {
        flights.splice(btn.dataset.index,1);
        saveAndRender();
      });
  }

  function update(idx,key,val) {
    flights[idx][key] = val;
    saveAndRender();
  }

  function saveAndRender() {
    localStorage.setItem('flights', JSON.stringify(flights));
    render();
  }

  addBtn.onclick = () => {
    flights.push({ student:'', lesson:'', instructor:'' });
    saveAndRender();
  };

  // Initial render
  render();
});
