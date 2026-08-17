import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".open-next/**",
    "coverage/**",
    "screenshots/**",
    // Downloaded specification package, not project source.
    ".spec/**",
  ]),
  {
    rules: {
      /* A leading underscore marks a binding that exists only to be discarded.
         The pattern matters here: several places destructure a payload
         specifically to OMIT anti-abuse and consent fields before storing it,
         e.g. `const { botField: _b, ...rest } = enquiry`. That is the clearest
         way to express "everything except these"; the alternatives — a delete
         loop, or an explicit allowlist — read worse and are easier to get wrong
         when a field is added later. */
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    /* Build and inspection scripts are Node ESM, run directly, and are not part
       of the application bundle. */
    files: ["scripts/**/*.mjs", "*.config.mjs", "*.config.ts"],
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },
]);
