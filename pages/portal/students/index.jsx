import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

const cx = (...c)=>c.filter(Boolean).join(" ");
const currency = (n)=> (n ?? 0).toLocaleString(undefined,{style:"currency",currency:"USD"});

function ageFromDOB(dob){
  if(!dob) return "N/A";
  const d = new Date(dob), n = new Date();
  let y = n.getFullYear() - d.getFullYear();
  let m = n.getMonth() - d.getMonth();
  if (m<0 || (m===0 && n.getDate()<d.getDate())) { y--; m += 12; }
  return `${y} Years, ${m} Month(s)`;
}

export default function StudentsIndex(){
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ refresh(); },[]);
  function refresh(){ fetch("/api/students").then(r=>r.json()).then(setStudents); }

  const filtered = useMemo(()=>{
    const s = q.toLowerCase().trim();
    return students.filter(x => (`${x.firstName} ${x.lastName} ${x.membershipNo}`).toLowerCase().includes(s));
  },[students,q]);

  return (
    <>
      <Head><title>Student Index and Data</title></Head>
      <div className="h-screen w-screen overflow-hidden bg-gray-50 text-gray-800">
        {/* Top bar */}
        <header className="h-14 pl-16 pr-4 sticky top-0 z-30 bg-white shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-brand-500 grid place-items-center text-white">
              <span className="msr">flight</span>
            </div>
            <h1 className="font-semibold">RAC Winter Camp 2025</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="msr absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input value={q} onChange={e=>setQ(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 outline-none text-sm w-[420px]"
                placeholder="Search Student Index and Data"/>
            </div>
            <button onClick={()=>{ setEditing(null); setShowForm(true); }} className="ml-2 inline-flex items-center px-3 py-2 rounded-md bg-brand-500 text-white text-sm hover:bg-brand-600 transition shadow">
              <span className="msr mr-1">add</span> Add
            </button>
          </div>
        </header>

        {/* left rail */}
        <nav className="fixed left-0 top-0 h-screen w-14 bg-white border-r border-gray-200 flex flex-col items-center pt-3 gap-2 z-40">
          <RailBtn icon="person" label="Students" active/>
        </nav>

        {/* content */}
        <main className="pl-16 h-[calc(100vh-56px)] overflow-auto p-4">
          <h2 className="text-lg font-semibold mb-3">Student Index and Data</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-lg shadow-card p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.firstName} {s.lastName}</div>
                    <div className="text-sm text-gray-500">{s.membershipNo}</div>
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <button title="View" onClick={()=>setSelected(s)} className="h-9 w-9 grid place-items-center rounded hover:bg-gray-100"><span className="msr">visibility</span></button>
                    <button title="Edit" onClick={()=>{ setEditing(s); setShowForm(true); }} className="h-9 w-9 grid place-items-center rounded hover:bg-gray-100"><span className="msr">edit</span></button>
                    <button title="Delete" onClick={()=>onDelete(s.id, refresh)} className="h-9 w-9 grid place-items-center rounded hover:bg-gray-100 text-red-600"><span className="msr">delete</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {selected && <DetailsDrawer student={selected} onClose={()=>setSelected(null)}/> }
        {showForm && <StudentForm initial={editing} onClose={()=>setShowForm(false)} onSaved={()=>{ setShowForm(false); refresh(); }}/>}
      </div>
    </>
  );
}

function RailBtn({ icon, label, active }) {
  return (
    <div className={cx("h-10 w-10 grid place-items-center rounded-md text-gray-500", active && "bg-gray-100 text-brand-600 font-semibold")}>
      <span className="msr">{icon}</span>
    </div>
  );
}

async function onDelete(id, refresh) {
  if (!confirm("Delete this student?")) return;
  await fetch(`/api/students/${id}`, { method:"DELETE" });
  refresh();
}

/* ---------- Details Drawer ---------- */
function DetailsDrawer({ student, onClose }){
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [owing, setOwing] = useState({ amount:0, hours:0 });

  useEffect(()=>{
    // fetch owing based on date range (empty range = all time)
    const qs = new URLSearchParams({ studentId: student.id, ...(from?{from}:{}), ...(to?{to}:{}) });
    fetch(`/api/finance/owing?${qs}`).then(r=>r.json()).then(setOwing);
  }, [student.id, from, to]);

  const percent = student.requestedHours ? ((student.completedHours / student.requestedHours) * 100).toFixed(2) : "0.00";

  return (
    <aside className="fixed top-0 right-0 w-[400px] h-full bg-white border-l border-gray-200 shadow-xl z-50 overflow-auto">
      <div className="p-4 flex items-center justify-between">
        <div className="text-lg font-semibold">{student.firstName} {student.lastName}</div>
        <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded hover:bg-gray-100"><span className="msr">close</span></button>
      </div>
      <div className="p-4 space-y-3">
        <KV k="Student First Name" v={student.firstName}/>
        <KV k="Student Last Name"  v={student.lastName}/>
        <KV k="Membership Number"  v={student.membershipNo}/>
        <KV k="Sex"                v={student.sex||"N/A"}/>
        <KV k="Student Email"      v={student.email}/>
        <KV k="Student Phone Number" v={student.phone}/>
        <KV k="Student Date of Birth" v={student.dob}/>
        <KV k="Age" v={ageFromDOB(student.dob)}/>
        <KV k="Dietary Requirements" v={student.dietary ?? "N/A"}/>
        <KV k="Medication Details" v={student.medication ?? "N/A"}/>
        <KV k="Medical / Physical Disabilities" v={student.disabilities ?? "N/A"}/>
        <KV k="Requested Flight Hours" v={student.requestedHours}/>
        <KV k="Completed Flight Hours" v={student.completedHours}/>
        <KV k="Remaining Flight Hours" v={Math.max(0,(student.requestedHours||0)-(student.completedHours||0)).toFixed(2)}/>
        <div className="grid grid-cols-[220px_1fr] gap-2 items-start">
          <div className="text-xs text-gray-500">Amount Owing (Flights) — Select Range</div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input type="date" className="border rounded px-2 py-1 text-sm" value={from} onChange={e=>setFrom(e.target.value)} />
              <input type="date" className="border rounded px-2 py-1 text-sm" value={to} onChange={e=>setTo(e.target.value)} />
            </div>
            <div className="text-sm">Hours: <b>{owing.hours.toFixed(2)}</b></div>
            <div className="text-sm">Amount: <b>{currency(owing.amount)}</b></div>
          </div>
        </div>
        <KV k="Study Kit / Pilot Shirt" v={currency(student.studyKit)}/>
        <KV k="Total Extras" v={currency(student.extras)}/>
        <KV k="Total Owing Amount (Flights + Extras)" v={currency(owing.amount + (student.studyKit||0) + (student.extras||0))}/>
        <KV k="Balance" v={currency(owing.amount + (student.studyKit||0) + (student.extras||0))}/>
        <KV k="Full Name" v={`${student.firstName} ${student.lastName}`}/>
        <KV k="Percent Flights Complete" v={`${percent}%`}/>
      </div>
    </aside>
  );
}

function KV({ k, v }) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-2">
      <div className="text-xs text-gray-500">{k}</div>
      <div className="text-sm text-gray-800 break-words">{v}</div>
    </div>
  );
}

/* ---------- Add/Edit Modal ---------- */
function StudentForm({ initial, onClose, onSaved }){
  const [form, setForm] = useState(initial || {
    firstName:"", lastName:"", sex:"", membershipNo:"",
    email:"", phone:"", dob:"", dietary:"", medication:"", disabilities:"",
    requestedHours:0, completedHours:0, studyKit:0, extras:0
  });
  const isEdit = Boolean(initial?.id);

  function upd(k,v){ setForm(f=>({ ...f, [k]: v })); }
  async function submit(){
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/students/${initial.id}` : "/api/students";
    const res = await fetch(url, { method, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
    if(res.ok) onSaved(); else alert("Failed to save");
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="w-[780px] max-w-full bg-white rounded-lg shadow-xl overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <div className="text-lg font-semibold">{isEdit? "Edit Student" : "Add Student"}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded border">Cancel</button>
            <button onClick={submit} className="inline-flex items-center px-3 py-1.5 rounded bg-brand-500 hover:bg-brand-600 text-white">
              <span className="msr mr-1">save</span> Save
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4 text-sm">
          <Text label="First Name" value={form.firstName} onChange={v=>upd("firstName", v)}/>
          <Text label="Last Name"  value={form.lastName}  onChange={v=>upd("lastName", v)}/>
          <Text label="Membership Number" value={form.membershipNo} onChange={v=>upd("membershipNo", v)}/>
          <Text label="Sex" value={form.sex} onChange={v=>upd("sex", v)} placeholder="Male / Female"/>
          <Text label="Email" value={form.email} onChange={v=>upd("email", v)}/>
          <Text label="Phone" value={form.phone} onChange={v=>upd("phone", v)}/>
          <Text label="Date of Birth" type="date" value={form.dob} onChange={v=>upd("dob", v)}/>
          <Text label="Dietary Requirements" value={form.dietary} onChange={v=>upd("dietary", v)}/>
          <Text label="Medication Details" value={form.medication} onChange={v=>upd("medication", v)}/>
          <Text label="Medical / Physical Disabilities" value={form.disabilities} onChange={v=>upd("disabilities", v)}/>
          <Number label="Requested Flight Hours" value={form.requestedHours} onChange={v=>upd("requestedHours", v)}/>
          <Number label="Completed Flight Hours" value={form.completedHours} onChange={v=>upd("completedHours", v)}/>
          <Number label="Study Kit / Pilot Shirt" value={form.studyKit} onChange={v=>upd("studyKit", v)}/>
          <Number label="Total Extras" value={form.extras} onChange={v=>upd("extras", v)}/>
        </div>
      </div>
    </div>
  );
}

function Text({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <label className="block">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <input type={type} value={value||""} placeholder={placeholder}
        onChange={e=>onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"/>
    </label>
  );
}
function Number({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <input type="number" value={value ?? 0} step="0.01"
        onChange={e=>onChange(parseFloat(e.target.value))}
        className="w-full border rounded px-3 py-2"/>
    </label>
  );
}
