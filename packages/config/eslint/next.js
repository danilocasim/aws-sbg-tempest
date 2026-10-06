// Shared ESLint flat config for the Next.js apps.
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [
  { ignores: ["**/node_modules/**", "**/.next/**", "**/out/**", "next-env.d.ts"] },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];
