import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("openai", () => {
  return {
    default: vi.fn(),
  };
});

import { generateCode } from "../src/generator.js";
import OpenAI from "openai";

// helper that sets up the mock create function with a given response
function mockOpenAIResponse(response: unknown) {
  vi.mocked(OpenAI).mockImplementation(
    () =>
      ({
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue(response),
          },
        },
      }) as any,
  );
}

// helper that sets up the mock create function to throw an error
function mockOpenAIError(error: unknown) {
  vi.mocked(OpenAI).mockImplementation(
    () =>
      ({
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(error),
          },
        },
      }) as any,
  );
}

describe("generateCode", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return generated files when openai responds correctly", async () => {
    mockOpenAIResponse({
      choices: [
        {
          message: {
            content: JSON.stringify({
              controller: "controller code",
              service: "service code",
              tests: "test code",
            }),
          },
        },
      ],
    });

    const result = await generateCode({
      title: "User Login",
      bullets: ["POST /login accepts email and password"],
      raw: "",
    });

    expect(result.controller).toBe("controller code");
    expect(result.service).toBe("service code");
    expect(result.tests).toBe("test code");
  });

  it("should exit the process if openai returns an empty response", async () => {
    mockOpenAIResponse({
      choices: [
        {
          message: {
            content: "",
          },
        },
      ],
    });

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      generateCode({
        title: "User Login",
        bullets: ["POST /login accepts email and password"],
        raw: "",
      }),
    ).rejects.toThrow("process.exit called");

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should exit the process if api key is invalid", async () => {
    mockOpenAIError({ status: 401, message: "Unauthorized" });

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      generateCode({
        title: "User Login",
        bullets: ["POST /login accepts email and password"],
        raw: "",
      }),
    ).rejects.toThrow("process.exit called");

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should exit the process if rate limit is hit", async () => {
    mockOpenAIError({ status: 429, message: "Too Many Requests" });

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      generateCode({
        title: "User Login",
        bullets: ["POST /login accepts email and password"],
        raw: "",
      }),
    ).rejects.toThrow("process.exit called");

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should exit the process if openai server errors", async () => {
    mockOpenAIError({ status: 500, message: "Internal Server Error" });

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      generateCode({
        title: "User Login",
        bullets: ["POST /login accepts email and password"],
        raw: "",
      }),
    ).rejects.toThrow("process.exit called");

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
