import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { GeneratedFiles } from "./generator.js";

export function writeFiles(
  featureName: string,
  files: GeneratedFiles,
  outputDir: string = "./output",
): void {
  // Create output folder if it doesn't exist
  mkdirSync(outputDir, { recursive: true });

  const name = featureName.toLowerCase().replace(/\s+/g, "-");

  const controllerPath = join(outputDir, `${name}.controller.ts`);
  const servicePath = join(outputDir, `${name}.service.ts`);
  const testPath = join(outputDir, `${name}.spec.ts`);

  writeFileSync(controllerPath, files.controller);
  writeFileSync(servicePath, files.service);
  writeFileSync(testPath, files.tests);

  console.log(`controller : ${controllerPath}`);
  console.log(`service : ${servicePath}`);
  console.log(`tests : ${testPath}`);
}
