import { Provider, useAtomValue } from "jotai";
import { StrictMode, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { prefersDarkMode } from "./lib/utils.ts";
import { themeAtom } from "./state/settings.ts";
import { store } from "./state/state.ts";

const AppShell = () => {
  const theme = useAtomValue(themeAtom);
  useLayoutEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    if (theme === "system") {
      const isDark = prefersDarkMode();
      const t = isDark ? "dark" : "light";
      document.documentElement.classList.add(t);
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);
  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppShell />
    </Provider>
  </StrictMode>,
);
