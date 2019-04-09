import { Maybe } from "../../../Data/Maybe";
import { fromDefault, Record, RecordI, StrictAccessor } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { Advantage } from "../Wiki/Advantage";
import { Disadvantage } from "../Wiki/Disadvantage";
import { SpecialAbility } from "../Wiki/SpecialAbility";
import { Activatable } from "../Wiki/wikiTypeHelpers";
import { ActivatableActivationValidation } from "./ActivatableActivationValidationObject";
import { ActivatableNameCost, ActivatableNameCostA_, ActivatableNameCostSafeCost } from "./ActivatableNameCost";

export interface ActiveActivatable<A extends RecordI<Activatable> = RecordI<Activatable>> {
  nameAndCost: Record<ActivatableNameCostSafeCost>
  validation: Record<ActivatableActivationValidation>
  wikiEntry: Record<A>
  heroEntry: Record<ActivatableDependent>
}

export const ActiveActivatable =
  fromDefault<ActiveActivatable> ({
    nameAndCost: ActivatableNameCost.default as Record<ActivatableNameCostSafeCost>,
    validation: ActivatableActivationValidation.default,
    heroEntry: ActivatableDependent.default,
    wikiEntry: Advantage.default,
  })

type GenA<B> =
  <A extends Advantage | Disadvantage | SpecialAbility>
  (x: Record<ActiveActivatable<A>>) => B

export const ActiveActivatableA_ = {
  id: pipe (ActiveActivatable.A.wikiEntry, Advantage.AL.id) as GenA<string>,
  name: pipe (ActiveActivatable.A.wikiEntry, Advantage.AL.name) as GenA<string>,
  tier: pipe (ActiveActivatable.A.nameAndCost, ActivatableNameCostA_.tier) as GenA<Maybe<number>>,
  finalCost:
    pipe (
      ActiveActivatable.A.nameAndCost,
      ActivatableNameCost.A.finalCost as StrictAccessor<ActivatableNameCostSafeCost, "finalCost">
    ) as GenA<number>,
  baseName:
    pipe (ActiveActivatable.A.nameAndCost, ActivatableNameCostA_.baseName) as GenA<string>,
  addName:
    pipe (ActiveActivatable.A.nameAndCost, ActivatableNameCostA_.addName) as GenA<Maybe<string>>,
  levelName:
    pipe (ActiveActivatable.A.nameAndCost, ActivatableNameCostA_.levelName) as GenA<Maybe<string>>,
}

export const ActiveActivatableAL_ = {
  id: pipe (ActiveActivatable.AL.wikiEntry, Advantage.AL.id),
}
