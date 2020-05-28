import { ident } from "../../Data/Function"
import { map, notNull } from "../../Data/List"
import { elems, foldr } from "../../Data/OrderedMap"
import { insert, OrderedSet } from "../../Data/OrderedSet"
import { uncurryN3 } from "../../Data/Tuple/Curry"
import { heroReducer } from "../Reducers/heroReducer"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { pipe, pipe_ } from "../Utilities/pipe"
import { getHerolistSortOptions } from "./sortOptionsSelectors"
import { getHeroes, getHerolistFilterText } from "./stateSelectors"

export const getHeroesArray = createMaybeSelector (
  getHeroes,
  pipe (elems, map (heroReducer.A.present))
)

type HeroWithUndo = typeof heroReducer.default
const HRA = heroReducer.A
const HA = HeroModel.A

export const getUnsavedHeroesById = createMaybeSelector (
  getHeroes,
  foldr ((hero: HeroWithUndo) => pipe_ (
                                         hero,
                                         HRA.past,
                                         notNull,
                                         b => b
                                           ? insert (HA.id (HRA.present (hero)))
                                           : ident as ident<OrderedSet<string>>
                                       ))
        (OrderedSet.empty)
)

export const getSortedHerolist = createMaybeSelector (
  getHerolistSortOptions,
  getHerolistFilterText,
  getHeroesArray,
  uncurryN3 (filterAndSortRecordsBy (0) ([ HA.name ]))
)
