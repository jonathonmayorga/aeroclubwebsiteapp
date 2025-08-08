import { readJson, writeJson } from "../_util";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const students = await readJson("students.json", []);
    return res.status(200).json(students);
  }
  if (req.method === "POST") {
    const students = await readJson("students.json", []);
    const body = req.body || {};
    const id = "s" + (Date.now().toString(36));
    const newStudent = {
      id, firstName:"", lastName:"", sex:"", membershipNo:"",
      email:"", phone:"", dob:"", dietary:null, medication:null, disabilities:null,
      requestedHours:0, completedHours:0, studyKit:0, extras:0, ...body
    };
    students.push(newStudent);
    await writeJson("students.json", students);
    return res.status(201).json(newStudent);
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
