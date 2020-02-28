import { ident } from "../../Data/Function"
import { any, consF, List } from "../../Data/List"
import { liftM2, mapMaybe } from "../../Data/Maybe"
import { foldr, lookup } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { Tuple } from "../../Data/Tuple"
import { sel1, uncurryN } from "../../Data/Tuple/All"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { MagicalTradition } from "../Models/Wiki/MagicalTradition"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { StaticData } from "../Models/Wiki/WikiModel"
import { getMagicalTraditionsHeroEntries } from "../Utilities/Activatable/traditionUtils"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe, pipe_ } from "../Utilities/pipe"
import { getSpecialAbilities, getWiki } from "./stateSelectors"


const SDA = StaticData.A
const MTA = MagicalTradition.A
const ADA = ActivatableDependent.A


const combineTradition = (heroEntry: Record<ActivatableDependent>) =>
                         (staticDataEntry: Record<SpecialAbility>) =>
                         (tradEntry: Record<MagicalTradition>) =>
                           Tuple (tradEntry, staticDataEntry, heroEntry)


export const getMagicalTraditionStaticEntries = createMaybeSelector (
  getWiki,
  getSpecialAbilities,
  uncurryN (staticData => pipe (
    getMagicalTraditionsHeroEntries,
    mapMaybe (x => liftM2 (combineTradition (x))
                          (lookup (ADA.id (x)) (SDA.specialAbilities (staticData)))
                          (lookup (ADA.id (x)) (SDA.magicalTraditions (staticData))))
  ))
)


export const getAreDisAdvRequiredApplyToMagActionsOrApps = createMaybeSelector (
  getMagicalTraditionStaticEntries,
  any (pipe (sel1, MTA.areDisAdvRequiredApplyToMagActionsOrApps))
)


export const getMagicalTraditionsWithRituals = createMaybeSelector (
  getWiki,
  pipe (
    SDA.magicalTraditions,
    foldr ((x: Record<MagicalTradition>): ident<List<string>> =>
            pipe_ (
              x,
              MTA.canLearnRituals,
              r => r ? consF (MTA.id (x)) : ident
            ))
          (List ())
  )
)
