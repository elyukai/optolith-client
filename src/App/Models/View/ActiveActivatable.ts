import { fromDefault, Record, RecordI } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { Advantage } from "../Wiki/Advantage";
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

export const ActiveActivatableAL_ = {
  id: pipe (ActiveActivatable.AL.wikiEntry, Advantage.AL.id),
}
