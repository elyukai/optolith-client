import config from "@elyukai/oxc-config/linter"
import { defineConfig } from "oxlint"

export default defineConfig({
  extends: [config],
  jsPlugins: ["eslint-plugin-mobx"],
  options: {
    typeAware: true,
  },
  rules: {
    "prefer-arrow-callback": ["off", { allowNamedFunctions: true }],
    "mobx/exhaustive-make-observable": "warn",
    "mobx/unconditional-make-observable": "error",
    // "mobx/missing-observer": "warn"],
    "typescript/no-explicit-any": ["error", { ignoreRestArgs: true }],
    "typescript/no-unsafe-call": "off",
    "typescript/no-unsafe-return": "off",
    "typescript/no-unsafe-argument": "off",
    "typescript/no-unsafe-member-access": "off",
    "typescript/no-unsafe-assignment": "off",
    "typescript/no-invalid-void-type": "off",
    "typescript/return-await": ["error", "error-handling-correctness-only"],
    "typescript/no-confusing-void-expression": "off",
  },
  ignorePatterns: ["src/App/**/*", "src/Control/**/*", "src/Data/**/*", "src/Debug/**/*"],
})
