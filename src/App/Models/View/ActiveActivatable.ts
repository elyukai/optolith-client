import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent"
import { Activatable } from "../Wiki/wikiTypeHelpers"
import { ActivatableActivationValidation } from "./ActivatableActivationValidationObject"
import { ActivatableNameCostSafeCost } from "./ActivatableNameCost"

export interface ActiveActivatable<A extends Activatable = Activatable> {
  nameAndCost: ActivatableNameCostSafeCost
  validation: ActivatableActivationValidation
  wikiEntry: A
  heroEntry: ActivatableDependent
}
