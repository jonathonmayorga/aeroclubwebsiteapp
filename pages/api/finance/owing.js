import { readJson } from "../_util";

// keep in sync with your flights page later:
const HOURLY_RATE = 322.42; // derived from your example ($451.39 / 1.4h)

export default async function handler(req, res) {
  const { studentId, from, to } = req.query;
  if (!studentId) return res.status(400).json({ error:"studentId required" });

  const flights = await readJson("flights.json", []);
  const start = from ? new Date(from) : new Date("1970-01-01");
  const end   = to   ? new Date(to)   : new Date("2999-12-31");

  const hours = flights
    .filter(f => f.studentId === studentId)
    .filter(f => {
      const d = new Date(f.date);
      return d >= start && d <= end;
    })
    .reduce((sum,f)=>sum + Number(f.hours||0), 0);

  const amount = +(hours * HOURLY_RATE).toFixed(2);
  res.json({ hours, amount, rate: HOURLY_RATE, from, to });
}
