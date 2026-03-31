import { describe, it, expect, vi, beforeEach } from "vitest";

// mock the entire fs module before importing parser
vi.mock("fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

import { parseSpec } from "../src/parser.js";
import * as fs from "fs";

describe("parseSpec", () => {
  // reset all mocks before each test so they don't affect each other
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should correctly parse the title from a markdown file", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(`
## User Login

- POST /login accepts email and password
- Return a JWT token if credentials are correct
    `);

    const result = parseSpec("fake/path.md");
    expect(result.title).toBe("User Login");
  });

  it("should correctly parse bullet points from a markdown file", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(`
## User Login

- POST /login accepts email and password
- Return a JWT token if credentials are correct
- Return 401 error if credentials are wrong
    `);

    const result = parseSpec("fake/path.md");
    expect(result.bullets).toHaveLength(3);
    expect(result.bullets[0]).toBe("POST /login accepts email and password");
  });

  it("should exit the process if the file does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => parseSpec("nonexistent/path.md")).toThrow(
      "process.exit called",
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should exit the process if the file is empty", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue("");
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => parseSpec("empty/path.md")).toThrow("process.exit called");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should exit the process if no bullet points are found", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(`
## User Login

No bullet points here.
    `);
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => parseSpec("no-bullets/path.md")).toThrow(
      "process.exit called",
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
