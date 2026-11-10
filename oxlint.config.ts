import config from "@elyukai/oxc-config/linter"
import { defineConfig } from "oxlint"

export default defineConfig({
  extends: [config],
  jsPlugins: ["eslint-plugin-mobx"],
  options: {
    typeAware: false,
  },
  rules: {
    "prefer-arrow-callback": ["off", { allowNamedFunctions: true }],
    "mobx/exhaustive-make-observable": "warn",
    "mobx/unconditional-make-observable": "error",
    // "mobx/missing-observer": "warn"],
    "typescript/no-explicit-any": ["error", { ignoreRestArgs: true }],
  },
})
