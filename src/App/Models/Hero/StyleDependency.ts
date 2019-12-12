import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";

export interface StyleDependency {
  "@@name": "StyleDependency"

  /**
   * The extended special ability or list of available special abilities.
   */
  id: string | List<string>

  /**
   * If a ability meets a given id, then `Just id`, otherwise `Nothing`.
   */
  active: Maybe<string>

  /**
   * The style's id.
   */
  origin: string
}

/**
 * Create a new `StyleDependency` object.
 */
export const StyleDependency =
  fromDefault ("StyleDependency")
              <StyleDependency> ({
                id: "",
                active: Nothing,
                origin: "",
              })

export const StyleDependencyL = makeLenses (StyleDependency)
