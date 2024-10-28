import { atomWithStorage } from "jotai/utils";
import { Theme } from "../lib/themes";

export const themeAtom = atomWithStorage<Theme>("theme", Theme.light);

export const mapboxApiKeyAtom = atomWithStorage<string>("mapboxApiKey", "");

export const pageLoadCountTodayAtom = atomWithStorage<number>(
  "pageLoadCountToday",
  0,
);

export const lastUsedDateAtom = atomWithStorage<Date>(
  "lastUsedDate",
  new Date(),
);

export const projectionAtom = atomWithStorage<"mercator" | "globe">(
  "projection",
  "mercator",
);
