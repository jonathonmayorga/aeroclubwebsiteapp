import { useEffect, useState } from "react";
import Head from "next/head";

export default function Login() {
  const [role, setRole] = useState("staff");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");

  useEffect(()=>{ fetch("/api/students").then(r=>r.json()).then(setStudents); },[]);

  function setCookie(name, value, days=7){
    const d = new Date(Date.now()+days*864e5).toUTCString();
    document.cookie = `${name}=${value}; Path=/; Expires=${d}`;
  }

  function login() {
    setCookie("role", role);
    if (role === "student" && studentId) setCookie("studentId", studentId);
    window.location.href = role === "staff" ? "/portal/students" : "/portal/me";
  }

  return (
    <>
      <Head><title>Login</title></Head>
      <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
          <h1 className="text-lg font-semibold mb-4">Demo Login</h1>
          <label className="block mb-2 text-sm">Role</label>
          <select className="w-full border rounded px-3 py-2 mb-4" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="staff">Staff Access</option>
            <option value="student">Student Access</option>
          </select>
          {role==="student" && (
            <>
              <label className="block mb-2 text-sm">Select Student</label>
              <select className="w-full border rounded px-3 py-2 mb-4" value={studentId} onChange={e=>setStudentId(e.target.value)}>
                <option value="">-- choose --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.membershipNo})</option>)}
              </select>
            </>
          )}
          <button onClick={login} className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded px-4 py-2">
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
