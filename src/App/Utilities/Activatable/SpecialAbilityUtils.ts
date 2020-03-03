import { Record } from "../../../Data/Record"
import { fst } from "../../../Data/Tuple"
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction } from "../../Actions/SpecialAbilitiesActions"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { ActiveObjectWithId, toActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { addTransferUnfamiliarDependencies, addTransferUnfamiliarDependenciesByActivationOptions, removeTransferUnfamiliarDependencies } from "../Dependencies/TransferredUnfamiliarUtils"
import { pipe } from "../pipe"
import { addAllStyleRelatedDependencies, removeAllStyleRelatedDependencies } from "./ExtendedStyleUtils"

export const addOtherSpecialAbilityDependenciesOnActivation =
  (action: ActivateSpecialAbilityAction) => pipe (
    addAllStyleRelatedDependencies (fst (action.payload.entryType)),
    addTransferUnfamiliarDependenciesByActivationOptions (action.payload.args)
  )

export const addOtherSpecialAbilityDependenciesOnRCPApplication =
  (wiki_entry: Record<SpecialAbility>) =>
  (active: Record<ActiveObject>) => pipe (
    addAllStyleRelatedDependencies (wiki_entry),
    addTransferUnfamiliarDependencies (toActiveObjectWithId (-1)
                                                            (SpecialAbility.A.id (wiki_entry))
                                                            (active))
  )

export const addOtherSpecialAbilityDependenciesOnHeroInit =
  (wiki_entry: Record<SpecialAbility>) =>
  (active: Record<ActiveObjectWithId>) => pipe (
    addAllStyleRelatedDependencies (wiki_entry),
    addTransferUnfamiliarDependencies (active)
  )

export const removeOtherSpecialAbilityDependenciesOnDeletion =
  (action: DeactivateSpecialAbilityAction) => pipe (
    removeAllStyleRelatedDependencies (fst (action.payload.entryType)),
    removeTransferUnfamiliarDependencies (action.payload.args)
  )
