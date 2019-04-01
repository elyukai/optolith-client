import { fromDefault, Record, RecordI } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { Advantage } from "../Wiki/Advantage";
import { Disadvantage } from "../Wiki/Disadvantage";
import { SpecialAbility } from "../Wiki/SpecialAbility";
import { Activatable } from "../Wiki/wikiTypeHelpers";
import { ActivatableActivationValidation } from "./ActivatableActivationValidationObject";
import { ActivatableNameCost, ActivatableNameCostSafeCost } from "./ActivatableNameCost";

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

type GenericA<B> =
  <A extends Advantage | Disadvantage | SpecialAbility>
  (x: Record<ActiveActivatable<A>>) => B

export const ActiveActivatableA_ = {
  id: pipe (ActiveActivatable.A.wikiEntry, Advantage.AL.id) as GenericA<string>,
  name: pipe (ActiveActivatable.A.wikiEntry, Advantage.AL.name) as GenericA<string>,
}

export const ActiveActivatableAL_ = {
  id: pipe (ActiveActivatable.AL.wikiEntry, Advantage.AL.id),
}
