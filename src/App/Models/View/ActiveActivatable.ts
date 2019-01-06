import { Nothing } from "../../../Data/Maybe";
import { fromDefault, RecordI } from "../../../Data/Record";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { ActivatableActivationMeta, ActivatableActivationValidationObject, ActivatableNameAdjustedCostEvalTier } from "../Hero/heroTypeHelpers";
import { Advantage } from "../Wiki/Advantage";
import { Activatable } from "../Wiki/wikiTypeHelpers";

export interface ActiveActivatable<T extends RecordI<Activatable> = RecordI<Activatable>>
  extends ActivatableNameAdjustedCostEvalTier,
          ActivatableActivationValidationObject,
          ActivatableActivationMeta<T> { }

export const ActiveActivatable =
  fromDefault<ActiveActivatable> ({
    id: "",

    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
    cost: Nothing,

    index: -1,

    name: "",
    baseName: "",
    addName: Nothing,

    tierName: Nothing,

    finalCost: 0,

    disabled: true,
    maxLevel: Nothing,
    minLevel: Nothing,

    stateEntry: ActivatableDependent.default,
    wikiEntry: Advantage.default,
    customCost: Nothing,
  })
