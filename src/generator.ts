import OpenAI from "openai";
import { ParsedSpec } from "./parser.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedFiles {
  controller: string;
  service: string;
  tests: string;
}

export async function generateCode(spec: ParsedSpec): Promise<GeneratedFiles> {
  console.log("Calling AI to generate code.");

  const systemPrompt = `
You are a senior TypeScript developer helping scaffold a new feature.
Given the spec below, generate production-ready TypeScript code.

Feature: ${spec.title}
Requirements:
${spec.bullets.map((b) => `- ${b}`).join("\n")}

Respond ONLY in this exact JSON format, no markdown, no explanation:
{
  "controller": "// controller code here as a string",
  "service": "// service code here as a string",
  "tests": "// vitest test code here as a string"
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: systemPrompt }],
    response_format: { type: "json_object" },
  });

  const responseText = response.choices[0].message.content ?? "";
  const parsed = JSON.parse(responseText);
  return parsed;
}
