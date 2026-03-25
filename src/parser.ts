import { readFileSync } from "fs";

export interface ParsedSpec {
  title: string;
  bullets: string[];
  raw: string;
}

export function parseSpec(filePath: string): ParsedSpec {
  const raw = readFileSync(filePath, "utf-8");

  // grabbing the feature title from markdown
  const titleMatch = raw.match(/^##\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : "Feature";

  // pulling out each requirement as a bullet
  const bullets = raw
    .split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.trim().replace(/^-\s*/, ""));

  return { title, bullets, raw };
}
