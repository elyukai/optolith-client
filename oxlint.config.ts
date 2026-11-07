import config from "@elyukai/oxc-config/linter"
import { defineConfig } from "oxlint"

export default defineConfig({
  extends: [config],
  options: {
    typeAware: false,
  },
  rules: {
    "prefer-arrow-callback": ["off", { allowNamedFunctions: true }],
  },
})
