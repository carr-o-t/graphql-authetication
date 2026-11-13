import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// unmount the previous test rendered
afterEach(() => cleanup());

// next/font only works inside next, so give the components a dummy font
vi.mock("next/font/google", () => ({
  Poppins: () => ({ className: "" }),
}));
