import { readFileSync, existsSync } from "fs";

/**
 * Represents a parsed feature spec from a markdown file.
 */
export interface ParsedSpec {
  title: string;
  bullets: string[];
  raw: string;
}

/**
 * Parses a markdown spec file into a structured format.
 * Expects a ## heading for the feature title and - bullets for requirements.
 *
 * @param filePath - path to the markdown spec file
 * @returns ParsedSpec object with title, bullets, and raw content
 */
export function parseSpec(filePath: string): ParsedSpec {
  // check if the file actually exists before trying to read it
  if (!existsSync(filePath)) {
    console.error(`Spec file not found: ${filePath}`);
    console.error(`   Make sure the file exists and try again.`);
    process.exit(1);
  }

  const raw = readFileSync(filePath, "utf-8").trim();

  // don't process empty files
  if (!raw) {
    console.error(`Spec file is empty: ${filePath}`);
    console.error(`   Add a ## title and some - bullet points.`);
    process.exit(1);
  }

  // grabbing the feature title from the first ## heading
  const titleMatch = raw.match(/^##\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled Feature";

  // pulling out each requirement line that starts with a dash
  const bullets = raw
    .split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.trim().replace(/^-\s*/, ""))
    .filter((line) => line.length > 0);

  // warn the user if the spec is too vague to generate good code
  if (bullets.length === 0) {
    console.error(`No requirements found in: ${filePath}`);
    console.error(
      `   Add bullet points starting with - to describe the feature.`,
    );
    process.exit(1);
  }

  if (bullets.length < 2) {
    console.warn(`Only ${bullets.length} requirement found.`);
    console.warn(
      `   Consider adding more bullet points for better code generation.\n`,
    );
  }

  return { title, bullets, raw };
}
