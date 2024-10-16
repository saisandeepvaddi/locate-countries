import js from "@eslint/js";
// import reactHooks from 'eslint-plugin-react-hooks';
// import reactRefresh from 'eslint-plugin-react-refresh';
import react from "@eslint-react/eslint-plugin";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    ...react.configs.recommended,
    ...eslintPluginPrettier,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    // plugins: {
    //   'react-hooks': reactHooks,
    //   'react-refresh': reactRefresh,
    // },
    // rules: {
    //   ...reactHooks.configs.recommended.rules,
    //   'react-refresh/only-export-components': [
    //     'warn',
    //     { allowConstantExport: true },
    //   ],
    // },
  },
);
