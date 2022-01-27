import { fmapF } from "../../Data/Functor"
import { bindF, listToMaybe } from "../../Data/Maybe"
import { elems } from "../../Data/OrderedMap"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe_ } from "../Utilities/pipe"
import { getPets } from "./stateSelectors"

export const getPet = createMaybeSelector (
  getPets,
  pets =>
  pipe_ (
    fmapF (pets) (pets => elems(pets)),
    bindF (listToMaybe)
  )
)

export const getAllPets = createMaybeSelector (
  getPets,
  pets => fmapF (pets) (pets => elems(pets))
)
