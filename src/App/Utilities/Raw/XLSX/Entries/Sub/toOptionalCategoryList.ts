import { equals } from "../../../../../../Data/Eq"
import { elem, flength, List, map, NonEmptyList, notNull, splitOn, unsafeIndex } from "../../../../../../Data/List"
import { bindF, ensure, Just, liftM2, mapM, Maybe, Nothing } from "../../../../../../Data/Maybe"
import { Record } from "../../../../../../Data/Record"
import { bimap, fst, isTuple, Pair, snd, uncurry } from "../../../../../../Data/Tuple"
import { Category, SkillishCategory } from "../../../../../Constants/Categories"
import { SelectOption } from "../../../../../Models/Wiki/sub/SelectOption"
import { toInt } from "../../../../NumberUtils"
import { pipe, pipe_ } from "../../../../pipe"
import { Expect } from "../../../Expect"
import { lookupKeyValid, TableType } from "../../Validators/Generic"
import { mensureMapListOptional } from "../../Validators/ToValue"

export type AutomatedCategory = SkillishCategory
                              | Category.CANTRIPS
                              | Category.BLESSINGS

const AutomatedCategories =
  List<AutomatedCategory> (
    Category.COMBAT_TECHNIQUES,
    Category.LITURGICAL_CHANTS,
    Category.SKILLS,
    Category.SPELLS,
    Category.CANTRIPS,
    Category.BLESSINGS
  )

export type OptionalCategoryOutput = AutomatedCategory
                                   | Pair<AutomatedCategory, NonEmptyList<number>>

const isAvailableSelectCategory =
  (x: string): x is AutomatedCategory => elem (x) (AutomatedCategories)

const checkCategory: (x: string) => Maybe<OptionalCategoryOutput> =
  x => isAvailableSelectCategory (x)
       ? Just (x)
       : pipe_ (
           x,
           splitOn ("?"),
           ensure (pipe (flength, equals (2))),
           bindF (pipe (
             xs => Pair (unsafeIndex (xs) (0), unsafeIndex (xs) (1)),
             bimap (ensure (isAvailableSelectCategory))
                   (pipe (
                     splitOn (","),
                     mapM (toInt),
                     bindF (ensure (notNull)),
                   )),
             uncurry (liftM2 (Pair)),
           )),
         )

export const toOptionalCategoryList =
  lookupKeyValid (mensureMapListOptional ("&")
                                         (Expect.Union (
                                           "Category",
                                           Expect.Pair ("Category") (Expect.NonEmptyList ("Group"))
                                         ))
                                         (checkCategory))
                 (TableType.Univ)

export const categoryToSelectOptions: (x: OptionalCategoryOutput) => List<Record<SelectOption>> =
  x => isTuple (x)
       ? map ((gr: number) => SelectOption ({
                                id: fst (x),
                                name: Nothing,
                                cost: Nothing,
                                prerequisites: Nothing,
                                target: Nothing,
                                level: Nothing,
                                specializations: Nothing,
                                specializationInput: Nothing,
                                applications: Nothing,
                                applicationInput: Nothing,
                                gr: Just (gr),
                                src: Nothing,
                                errata: Nothing,
                              }))
             (snd (x))
       : List (SelectOption ({
                 id: x,
                 name: Nothing,
                 cost: Nothing,
                 prerequisites: Nothing,
                 target: Nothing,
                 level: Nothing,
                 specializations: Nothing,
                 specializationInput: Nothing,
                 applications: Nothing,
                 applicationInput: Nothing,
                 gr: Nothing,
                 src: Nothing,
                 errata: Nothing,
               }))
