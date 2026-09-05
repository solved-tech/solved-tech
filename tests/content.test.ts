import { describe, expect, it } from "vitest";
import { contactConfig, getContactState, siteContent } from "../src/content";

describe("site content", () => {
  it("keeps the five service groups in outcome order", () => {
    expect(siteContent.services.map(({ title }) => title)).toEqual([
      "Be easier to find",
      "Turn visits into business",
      "Build what customers need",
      "Make your systems cooperate",
      "Give repetitive work away",
    ]);
  });

  it("keeps contact methods in the approved priority", () => {
    expect(siteContent.contactMethods.map(({ id }) => id)).toEqual([
      "call",
      "whatsapp",
      "voice",
      "quote",
    ]);
  });

  it("uses preview mode when production destinations are absent", () => {
    expect(getContactState(contactConfig)).toBe("preview");
  });
});
