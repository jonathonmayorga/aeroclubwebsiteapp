import { useEffect, useState } from "react";

function getCookie(name){
  const m = document.cookie.match(new RegExp('(^| )'+name+'=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

export default function Me(){
  const [student, setStudent] = useState(null);

  useEffect(()=>{
    const id = getCookie("studentId");
    if(!id) return;
    fetch(`/api/students/${id}`).then(r=>r.json()).then(setStudent);
  },[]);

  if(!student) return <div className="p-6">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm h-14 flex items-center px-4">
        <h1 className="font-semibold">My Details</h1>
      </header>
      <main className="p-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-card p-5">
          <h2 className="text-lg font-semibold mb-3">{student.firstName} {student.lastName}</h2>
          <ul className="space-y-1 text-sm">
            <li><b>Membership:</b> {student.membershipNo}</li>
            <li><b>Email:</b> {student.email}</li>
            <li><b>Phone:</b> {student.phone}</li>
            <li><b>Requested Hours:</b> {student.requestedHours}</li>
            <li><b>Completed Hours:</b> {student.completedHours}</li>
            <li><b>Study Kit:</b> ${student.studyKit?.toFixed?.(2) ?? student.studyKit}</li>
            <li><b>Total Extras:</b> ${student.extras?.toFixed?.(2) ?? student.extras}</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">This page is read-only. Contact staff to update your details.</p>
        </div>
      </main>
    </div>
  );
}
