import { describe, expect, it } from "vitest";
import { buildEdgeFunctionErrorMessage } from "./edgeFunctions";

describe("buildEdgeFunctionErrorMessage", () => {
  it("returns deployment guidance for connection failures", () => {
    const message = buildEdgeFunctionErrorMessage(
      "fetch-news",
      "Failed to send a request to the Edge Function"
    );

    expect(message).toContain("fetch-news");
    expect(message).toContain("deploy");
    expect(message).toContain("GNEWS_API_KEY");
  });
});
