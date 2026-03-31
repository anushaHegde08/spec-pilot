import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs", () => ({
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

import { writeFiles } from "../src/writer.js";
import * as fs from "fs";

describe("writeFiles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create the output directory", () => {
    writeFiles("User Login", {
      controller: "controller code",
      service: "service code",
      tests: "test code",
    });

    expect(fs.mkdirSync).toHaveBeenCalledWith("./output", { recursive: true });
  });

  it("should write all 3 files to the output directory", () => {
    writeFiles("User Login", {
      controller: "controller code",
      service: "service code",
      tests: "test code",
    });

    expect(fs.writeFileSync).toHaveBeenCalledTimes(3);
  });

  it("should write controller content correctly", () => {
    writeFiles("User Login", {
      controller: "controller code",
      service: "service code",
      tests: "test code",
    });

    const calls = vi.mocked(fs.writeFileSync).mock.calls;
    const controllerCall = calls.find((call) =>
      String(call[0]).includes("controller"),
    );

    expect(controllerCall).toBeDefined();
    expect(controllerCall?.[1]).toBe("controller code");
  });

  it("should write files to a custom output directory when provided", () => {
    writeFiles(
      "User Login",
      {
        controller: "controller code",
        service: "service code",
        tests: "test code",
      },
      "./custom-output",
    );

    expect(fs.mkdirSync).toHaveBeenCalledWith("./custom-output", {
      recursive: true,
    });
  });

  it("should handle errors and exit the process if writing fails", () => {
    vi.mocked(fs.mkdirSync).mockImplementation(() => {
      throw new Error("disk full");
    });

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() =>
      writeFiles("User Login", {
        controller: "controller code",
        service: "service code",
        tests: "test code",
      }),
    ).toThrow("process.exit called");

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
