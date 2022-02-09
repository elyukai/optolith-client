import { fmapF } from "../../Data/Functor"
import { bindF, listToMaybe } from "../../Data/Maybe"
import { elems } from "../../Data/OrderedMap"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe_ } from "../Utilities/pipe"
import { getPets } from "./stateSelectors"

export const getPet = createMaybeSelector (
  getPets,
  mpets =>
  pipe_ (
    fmapF (mpets) (pets => elems (pets)),
    bindF (listToMaybe)
  )
)

export const getAllPets = createMaybeSelector (
  getPets,
  mpets => fmapF (mpets) (pets => elems (pets))
)
