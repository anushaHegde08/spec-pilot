#!/usr/bin/env node
import "dotenv/config";

import { program } from "commander";
import { parseSpec } from "./parser.js";
import { generateCode } from "./generator.js";
import { writeFiles } from "./writer.js";

program
  .name("spec-pilot")
  .description("Turn a plain English spec into code and tests using AI")
  .version("0.1.0");

program
  .command("generate")
  .description("Generate code from a spec file")
  .requiredOption("--spec <path>", "Path to your spec markdown file")
  .option("--out <dir>", "Output directory", "./output")
  .action(async (options) => {
    console.log(`Reading spec from: ${options.spec}`);

    const spec = parseSpec(options.spec);
    console.log(`Feature: ${spec.title}`);
    console.log(`Requirements found: ${spec.bullets.length}`);

    const files = await generateCode(spec);
    writeFiles(spec.title, files, options.out);

    console.log("\n Done! You got your files:", options.out);
  });

program.parse();
