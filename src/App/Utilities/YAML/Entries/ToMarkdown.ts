/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { fmap } from "../../../../Data/Functor"
import { Maybe } from "../../../../Data/Maybe"


/**
 * Takes a Markdown string from the YAML files and turns it into a string that
 * can be read by the Markdown parser in Optolith.
 */
export const toMarkdown : (x : string) => string
                        = x => x .replace ("\n", "\\n")


/**
 * Takes an Markdown string from the YAML files and turns it into a string that
 * can be read by the Markdown parser in Optolith.
 *
 * Like `toMarkdown`, but works with optional strings.
 */
export const toMarkdownM : (x : Maybe<string>) => Maybe<string>
                         = fmap (x => x .replace ("\n", "\\n"))
