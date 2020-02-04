import { fmap } from "../../Data/Functor"
import { bindF, listToMaybe } from "../../Data/Maybe"
import { elems } from "../../Data/OrderedMap"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe } from "../Utilities/pipe"
import { getPets } from "./stateSelectors"

export const getPet = createMaybeSelector (
  getPets,
  pipe (
    fmap (elems),
    bindF (listToMaybe)
  )
)

export const getAllPets = createMaybeSelector (
  getPets,
  fmap (elems)
)
