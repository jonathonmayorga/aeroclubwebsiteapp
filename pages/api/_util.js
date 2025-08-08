import fs from "fs/promises";
import path from "path";
export const dataPath = (name) => path.join(process.cwd(), "data", name);

export async function readJson(name, fallback = []) {
  try {
    const p = dataPath(name);
    const buf = await fs.readFile(p, "utf8");
    return JSON.parse(buf);
  } catch {
    return fallback;
  }
}

export async function writeJson(name, data) {
  const p = dataPath(name);
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf8");
}
