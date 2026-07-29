import { describe, expect, it } from "vitest";
import { buildSubscribeErrorMessage, isDuplicateSubscriptionError, isValidEmail, normalizeEmail } from "./subscription";

describe("subscription helpers", () => {
  it("normalizes and validates email input", () => {
    expect(normalizeEmail("  Hello@Example.com ")).toBe("hello@example.com");
    expect(isValidEmail("hello@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("recognizes duplicate subscription errors", () => {
    const error = { code: "23505" };
    expect(isDuplicateSubscriptionError(error)).toBe(true);
    expect(buildSubscribeErrorMessage(error)).toBe("You're already subscribed!");
  });
});
