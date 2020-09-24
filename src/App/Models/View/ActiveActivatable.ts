import { Maybe } from "../../../Data/Maybe"
import { fromDefault, makeLenses, Record, RecordI, StrictAccessor } from "../../../Data/Record"
import { pipe } from "../../Utilities/pipe"
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent"
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId"
import { Advantage } from "../Wiki/Advantage"
import { Disadvantage } from "../Wiki/Disadvantage"
import { SpecialAbility } from "../Wiki/SpecialAbility"
import { Activatable } from "../Wiki/wikiTypeHelpers"
import { ActivatableActivationValidation } from "./ActivatableActivationValidationObject"
import { ActivatableNameCost, ActivatableNameCostA_, ActivatableNameCostSafeCost } from "./ActivatableNameCost"

export interface ActiveActivatable<A extends RecordI<Activatable> = RecordI<Activatable>> {
  "@@name": "ActiveActivatable"
  nameAndCost: Record<ActivatableNameCostSafeCost>
  validation: Record<ActivatableActivationValidation>
  wikiEntry: Record<A>
  heroEntry: Record<ActivatableDependent>
}

export const ActiveActivatable =
  fromDefault ("ActiveActivatable")
              <ActiveActivatable> ({
                nameAndCost: ActivatableNameCost.default,
                validation: ActivatableActivationValidation.default,
                heroEntry: ActivatableDependent.default,
                wikiEntry: Advantage.default,
              })

type GenA<B> =
  <A extends Advantage | Disadvantage | SpecialAbility = Advantage | Disadvantage | SpecialAbility>
  (x: Record<ActiveActivatable<A>>) => B

const AAA = ActiveActivatable.A
const AAAL = ActiveActivatable.AL
const ANCA = ActivatableNameCost.A
const AAVA = ActivatableActivationValidation.A
const ANCA_ = ActivatableNameCostA_
const AOWIA = ActiveObjectWithId.A

export const ActiveActivatableA_ = {
  id: pipe (AAA.wikiEntry, Advantage.AL.id) as GenA<string>,
  nameInWiki:
    pipe (
      AAA.wikiEntry as StrictAccessor<ActiveActivatable<SpecialAbility>, "wikiEntry">,
      SpecialAbility.A.nameInWiki
    ),
  levels: pipe (AAA.wikiEntry, Advantage.AL.tiers),
  gr: pipe (AAA.wikiEntry, Advantage.AL.gr),
  isAutomatic: pipe (AAA.nameAndCost, ANCA.isAutomatic),
  level: pipe (AAA.nameAndCost, ANCA_.tier),
  customCost: pipe (AAA.nameAndCost, ANCA.active, AOWIA.cost),
  index: pipe (AAA.nameAndCost, ANCA_.index) as GenA<number>,
  finalCost:
    pipe (
      AAA.nameAndCost,
      ANCA.finalCost as StrictAccessor<ActivatableNameCostSafeCost, "finalCost">
    ),
  name: pipe (AAA.nameAndCost, ANCA_.name),
  baseName: pipe (AAA.nameAndCost, ANCA_.baseName) as GenA<string>,
  addName: pipe (AAA.nameAndCost, ANCA_.addName) as GenA<Maybe<string>>,
  levelName: pipe (AAA.nameAndCost, ANCA_.levelName) as GenA<Maybe<string>>,
  maxLevel: pipe (AAA.validation, AAVA.maxLevel),
  minLevel: pipe (AAA.validation, AAVA.minLevel),
  disabled: pipe (AAA.validation, AAVA.disabled),
  active: pipe (AAA.heroEntry, ActivatableDependent.A.active),
}

export const ActiveActivatableAL_ = {
  id: pipe (AAAL.wikiEntry, Advantage.AL.id),
}

export const ActiveActivatableL = makeLenses (ActiveActivatable)
