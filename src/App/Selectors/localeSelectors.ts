import { consF, List } from "../../Data/List"
import { Just } from "../../Data/Maybe"
import { foldr } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { Locale } from "../Models/Locale"
import { DropdownOption } from "../Models/View/DropdownOption"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { getAvailableLanguages } from "./stateSelectors"

const LA = Locale.A

export const getUserSelectableSupportedLanguages = createMaybeSelector (
  getAvailableLanguages,
  foldr ((x: Record<Locale>) => consF (DropdownOption ({
                                        id: Just (LA.id (x)),
                                        name: LA.name (x),
                                      })))
        (List ())
)
