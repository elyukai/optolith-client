import { ActivatableActivationMeta, ActivatableActivationValidationObject, ActivatableNameAdjustedCostEvalTier } from "../../types/data";
import { ActivatableDependent } from "../activeEntries/ActivatableDependent";
import { Nothing } from "../structures/Maybe";
import { fromDefault, RecordI } from "../structures/Record";
import { Advantage } from "../wikiData/Advantage";
import { Activatable } from "../wikiData/wikiTypeHelpers";

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
