import { prefersDarkMode } from "@/lib/utils";
import { atomWithStorage } from "jotai/utils";
import { Theme } from "../lib/themes";
import { store } from "./state";

export const themeAtom = atomWithStorage<Theme>("theme", Theme.light);

store.sub(themeAtom, () => {
  document.documentElement.classList.remove("dark", "light");
  const theme = store.get(themeAtom);
  if (theme === "system") {
    const isDark = prefersDarkMode();
    const t = isDark ? "dark" : "light";
    document.documentElement.classList.add(t);
  } else {
    document.documentElement.classList.add(theme);
  }
});

export const mapboxApiKeyAtom = atomWithStorage<string>("mapboxApiKey", "");

export const pageLoadCountTodayAtom = atomWithStorage<number>(
  "pageLoadCountToday",
  0,
);

export const lastUsedDateAtom = atomWithStorage<Date>(
  "lastUsedDate",
  new Date(),
);
