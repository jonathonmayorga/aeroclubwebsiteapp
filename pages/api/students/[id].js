import { readJson, writeJson } from "../_util";

export default async function handler(req, res) {
  const { id } = req.query;
  const students = await readJson("students.json", []);
  const idx = students.findIndex(s => s.id === id);

  if (req.method === "GET") {
    const s = students.find(s=>s.id===id);
    return s ? res.json(s) : res.status(404).end();
  }

  if (req.method === "PUT") {
    if (idx === -1) return res.status(404).end();
    students[idx] = { ...students[idx], ...req.body };
    await writeJson("students.json", students);
    return res.json(students[idx]);
  }

  if (req.method === "DELETE") {
    if (idx === -1) return res.status(404).end();
    const [removed] = students.splice(idx,1);
    await writeJson("students.json", students);
    return res.json(removed);
  }

  res.setHeader("Allow", "GET, PUT, DELETE");
  res.status(405).end();
}
