// @ts-check
import { join } from "node:path"
import { jsonSchema } from "optolith-tsjsonschemamd/renderers"

/** @type {import("optolith-tsjsonschemamd").GeneratorOptions} */
export default {
  sourceDir: join("src", "shared", "schema"),
  outputs: [
    {
      targetDir: join("src", "assets", "schema"),
      renderer: jsonSchema({ spec: "Draft_07" }),
    }
  ],
  clean: true,
  verbose: false
}
