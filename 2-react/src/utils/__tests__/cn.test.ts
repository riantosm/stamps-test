import { describe, expect, it } from "vitest";
import { cn } from "@/utils/cn";

describe("cn", () => {
  it("menggabungkan class dan membuang nilai falsy", () => {
    expect(cn("px-2", { hidden: false, block: true }, undefined, "py-1")).toBe("px-2 block py-1");
  });

  it("class belakangan menang atas yang bentrok, termasuk token custom", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("rounded-card", "rounded-control")).toBe("rounded-control");
  });
});
