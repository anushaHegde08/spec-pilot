#!/usr/bin/env node
import "dotenv/config";

import { program } from "commander";
import { parseSpec } from "./parser.js";
import { generateCode } from "./generator.js";
import { writeFiles } from "./writer.js";

/**
 * spec-pilot cli entry point.
 * Reads a markdown spec file and generates typescript
 * controller, service, and test files using openai.
 */

program
  .name("spec-pilot")
  .description("Turn a plain English spec into code and tests using AI")
  .version("0.1.0");

program
  .command("generate")
  .description("Generate code from a spec file")
  .requiredOption("--spec <path>", "Path to your spec markdown file")
  .option("--out <dir>", "Output directory", "./output")
  .option(
    "--dry-run",
    "Preview files that would be generated without calling the AI",
  )
  .action(async (options) => {
    // handle dry run before doing anything else
    if (options.dryRun) {
      const spec = parseSpec(options.spec);
      const name = spec.title.toLowerCase().replace(/\s+/g, "-");

      console.log(`\nDry run for: ${spec.title}`);
      console.log(`Requirements found: ${spec.bullets.length}`);
      console.log(`\nWould generate the following files in ${options.out}:`);
      console.log(`  ${name}.controller.ts`);
      console.log(`  ${name}.service.ts`);
      console.log(`  ${name}.spec.ts`);
      console.log(`\nRun without --dry-run to generate these files.\n`);
      process.exit(0);
    }

    console.log(`Reading spec from: ${options.spec}`);

    const spec = parseSpec(options.spec);
    console.log(`Feature: ${spec.title}`);
    console.log(`Requirements found: ${spec.bullets.length}`);

    const files = await generateCode(spec);

    if (!files.controller || !files.service || !files.tests) {
      console.error("AI did not return complete files. Try again.");
      process.exit(1);
    }

    writeFiles(spec.title, files, options.out);

    console.log(`\nDone. Your files are in: ${options.out}\n`);
  });

program.parse();
