import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { GeneratedFiles } from "./generator.js";

/**
 * Writes the AI-generated files to the output directory.
 *
 * @param featureName - used to name the output files
 * @param files - generated controller, service, and test content
 * @param outputDir - where to save the files (default: ./output)
 */
export function writeFiles(
  featureName: string,
  files: GeneratedFiles,
  outputDir: string = "./output",
): void {
  try {
    // create the output folder if it doesn't exist yet
    mkdirSync(outputDir, { recursive: true });

    // convert feature name to a file-friendly format
    // example: "User Login" becomes "user-login"
    const name = featureName.toLowerCase().replace(/\s+/g, "-");

    const controllerPath = join(outputDir, `${name}.controller.ts`);
    const servicePath = join(outputDir, `${name}.service.ts`);
    const testPath = join(outputDir, `${name}.spec.ts`);

    writeFileSync(controllerPath, files.controller);
    writeFileSync(servicePath, files.service);
    writeFileSync(testPath, files.tests);

    console.log(`controller -> ${controllerPath}`);
    console.log(`service    -> ${servicePath}`);
    console.log(`tests      -> ${testPath}`);
  } catch (error: any) {
    console.error("Failed to write output files:", error?.message);
    process.exit(1);
  }
}
