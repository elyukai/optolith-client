import { fmap } from "../../Data/Functor"
import { bindF, fromJust, isJust, Just, Maybe } from "../../Data/Maybe"
import { keys, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import * as ActionTypes from "../Constants/ActionTypes"
import { IdPrefixes } from "../Constants/IdPrefixes"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../Constants/Ids"
import { EquipmentSortOptions } from "../Models/Config"
import { EditItem } from "../Models/Hero/EditItem"
import { HitZoneArmor } from "../Models/Hero/HitZoneArmor"
import { Item } from "../Models/Hero/Item"
import { ItemTemplate } from "../Models/Wiki/ItemTemplate"
import { getHitZoneArmorsState, getItemEditorInstance, getItemsState, getWikiItemTemplates } from "../Selectors/stateSelectors"
import { getNewId, prefixId } from "../Utilities/IDUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { ReduxAction } from "./Actions"

const getNewIdFromCurrentItems: (x: Just<OrderedMap<string, Record<Item>>>) => string =
  pipe (fromJust, keys, getNewId, prefixId (IdPrefixes.ITEM))

const getNewIdFromCurrentHitZoneArmors:
  (x: Just<OrderedMap<string, Record<HitZoneArmor>>>) => string =
  pipe (fromJust, keys, getNewId, prefixId (IdPrefixes.HIT_ZONE_ARMOR))

export interface AddItemAction {
  type: ActionTypes.ADD_ITEM
  payload: {
    newId: string
  }
}

export const addItem: ReduxAction =
  (dispatch, getState) => {
    const mitems = getItemsState (getState ())

    if (isJust (mitems)) {
      const newId = getNewIdFromCurrentItems (mitems)

      return dispatch<AddItemAction> ({
        type: ActionTypes.ADD_ITEM,
        payload: {
          newId,
        },
      })
    }

    return undefined
  }

export interface AddItemTemplateAction {
  type: ActionTypes.ADD_ITEM_TEMPLATE
  payload: {
    template: Record<ItemTemplate>
    newId: string
  }
}

export const addTemplateToList =
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const mitems = getItemsState (getState ())
    const mtemplate = lookup (id) (getWikiItemTemplates (getState ()))

    if (isJust (mitems) && isJust (mtemplate)) {
      const newId = getNewIdFromCurrentItems (mitems)

      return dispatch<AddItemTemplateAction> ({
        type: ActionTypes.ADD_ITEM_TEMPLATE,
        payload: {
          newId,
          template: fromJust (mtemplate),
        },
      })
    }

    return undefined
  }

export interface SetMoneyAction {
  type: ActionTypes.SET_MONEY
  payload: {
    d: number
    s: number
    h: number
    k: number
  }
}

export const setMoney = (d: number, s: number, h: number, k: number): SetMoneyAction => ({
  type: ActionTypes.SET_MONEY,
  payload: {
    d,
    s,
    h,
    k,
  },
})

export interface CreateItemAction {
  type: ActionTypes.CREATE_ITEM
}

export const createItem = (): CreateItemAction => ({
  type: ActionTypes.CREATE_ITEM,
})

export interface CloseItemEditorAction {
  type: ActionTypes.CLOSE_ITEM_EDITOR
}

export const closeItemEditor = (): CloseItemEditorAction => ({
  type: ActionTypes.CLOSE_ITEM_EDITOR,
})

export interface SaveItemAction {
  type: ActionTypes.SAVE_ITEM
}

export const saveItem = (): SaveItemAction => ({
  type: ActionTypes.SAVE_ITEM,
})

export interface EditItemAction {
  type: ActionTypes.EDIT_ITEM
  payload: {
    id: string
  }
}

export const editItem = (id: string): EditItemAction => ({
  type: ActionTypes.EDIT_ITEM,
  payload: {
    id,
  },
})

export interface RemoveItemAction {
  type: ActionTypes.REMOVE_ITEM
  payload: {
    id: string
  }
}

export const removeItem = (id: string): RemoveItemAction => ({
  type: ActionTypes.REMOVE_ITEM,
  payload: {
    id,
  },
})

export interface SetItemsSortOrderAction {
  type: ActionTypes.SET_ITEMS_SORT_ORDER
  payload: {
    sortOrder: EquipmentSortOptions
  }
}

export const setItemsSortOrder = (sortOrder: EquipmentSortOptions): SetItemsSortOrderAction => ({
  type: ActionTypes.SET_ITEMS_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SetDucatesAction {
  type: ActionTypes.SET_DUCATES
  payload: {
    value: string
  }
}

export const setDucates = (value: string): SetDucatesAction => ({
  type: ActionTypes.SET_DUCATES,
  payload: {
    value,
  },
})

export interface SetSilverthalersAction {
  type: ActionTypes.SET_SILVERTHALERS
  payload: {
    value: string
  }
}

export const setSilverthalers = (value: string): SetSilverthalersAction => ({
  type: ActionTypes.SET_SILVERTHALERS,
  payload: {
    value,
  },
})

export interface SetHellersAction {
  type: ActionTypes.SET_HELLERS
  payload: {
    value: string
  }
}

export const setHellers = (value: string): SetHellersAction => ({
  type: ActionTypes.SET_HELLERS,
  payload: {
    value,
  },
})

export interface SetKreutzersAction {
  type: ActionTypes.SET_KREUTZERS
  payload: {
    value: string
  }
}

export const setKreutzers = (value: string): SetKreutzersAction => ({
  type: ActionTypes.SET_KREUTZERS,
  payload: {
    value,
  },
})

export interface SetNameAction {
  type: ActionTypes.SET_ITEM_NAME
  payload: {
    value: string
  }
}

export const setName = (value: string): SetNameAction => ({
  type: ActionTypes.SET_ITEM_NAME,
  payload: {
    value,
  },
})

export interface SetPriceAction {
  type: ActionTypes.SET_ITEM_PRICE
  payload: {
    value: string
  }
}

export const setPrice = (value: string): SetPriceAction => ({
  type: ActionTypes.SET_ITEM_PRICE,
  payload: {
    value,
  },
})

export interface SetWeightAction {
  type: ActionTypes.SET_ITEM_WEIGHT
  payload: {
    value: string
  }
}

export const setWeight = (value: string): SetWeightAction => ({
  type: ActionTypes.SET_ITEM_WEIGHT,
  payload: {
    value,
  },
})

export interface SetAmountAction {
  type: ActionTypes.SET_ITEM_AMOUNT
  payload: {
    value: string
  }
}

export const setAmount = (value: string): SetAmountAction => ({
  type: ActionTypes.SET_ITEM_AMOUNT,
  payload: {
    value,
  },
})

export interface SetWhereAction {
  type: ActionTypes.SET_ITEM_WHERE
  payload: {
    value: string
  }
}

export const setWhere = (value: string): SetWhereAction => ({
  type: ActionTypes.SET_ITEM_WHERE,
  payload: {
    value,
  },
})

export interface SetGroupAction {
  type: ActionTypes.SET_ITEM_GROUP
  payload: {
    gr: number
  }
}

export const setGroup = (gr: number): SetGroupAction => ({
  type: ActionTypes.SET_ITEM_GROUP,
  payload: {
    gr,
  },
})

export interface SetTemplateAction {
  type: ActionTypes.SET_ITEM_TEMPLATE
  payload: {
    template: string
  }
}

export const setTemplate = (template: string): SetTemplateAction => ({
  type: ActionTypes.SET_ITEM_TEMPLATE,
  payload: {
    template,
  },
})

export interface SetCombatTechniqueAction {
  type: ActionTypes.SET_ITEM_COMBAT_TECHNIQUE
  payload: {
    id: string
  }
}

export const setCombatTechnique = (id: string): SetCombatTechniqueAction => ({
  type: ActionTypes.SET_ITEM_COMBAT_TECHNIQUE,
  payload: {
    id,
  },
})

export interface SetDamageDiceNumberAction {
  type: ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER
  payload: {
    value: string
  }
}

export const setDamageDiceNumber = (value: string): SetDamageDiceNumberAction => ({
  type: ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER,
  payload: {
    value,
  },
})

export interface SetDamageDiceSidesAction {
  type: ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES
  payload: {
    value: number
  }
}

export const setDamageDiceSides = (value: number): SetDamageDiceSidesAction => ({
  type: ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES,
  payload: {
    value,
  },
})

export interface SetDamageFlatAction {
  type: ActionTypes.SET_ITEM_DAMAGE_FLAT
  payload: {
    value: string
  }
}

export const setDamageFlat = (value: string): SetDamageFlatAction => ({
  type: ActionTypes.SET_ITEM_DAMAGE_FLAT,
  payload: {
    value,
  },
})

export interface SetPrimaryAttributeAction {
  type: ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE
  payload: {
    primary: Maybe<string>
  }
}

export const setPrimaryAttribute = (primary: Maybe<string>): SetPrimaryAttributeAction => ({
  type: ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE,
  payload: {
    primary,
  },
})

export interface SetDamageThresholdAction {
  type: ActionTypes.SET_ITEM_DAMAGE_THRESHOLD
  payload: {
    value: string
  }
}

export const setDamageThreshold = (value: string): SetDamageThresholdAction => ({
  type: ActionTypes.SET_ITEM_DAMAGE_THRESHOLD,
  payload: {
    value,
  },
})

export interface SetFirstDamageThresholdAction {
  type: ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD
  payload: {
    value: string
  }
}

export const setFirstDamageThreshold = (value: string): SetFirstDamageThresholdAction => ({
  type: ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD,
  payload: {
    value,
  },
})

export interface SetSecondDamageThresholdAction {
  type: ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD
  payload: {
    value: string
  }
}

export const setSecondDamageThreshold = (value: string): SetSecondDamageThresholdAction => ({
  type: ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD,
  payload: {
    value,
  },
})

export interface SwitchIsDamageThresholdSeparatedAction {
  type: ActionTypes.SWITCH_IS_ITEM_DT_SEPARATED
}

export const switchIsDamageThresholdSeparated = (): SwitchIsDamageThresholdSeparatedAction => ({
  type: ActionTypes.SWITCH_IS_ITEM_DT_SEPARATED,
})

export interface SetAttackAction {
  type: ActionTypes.SET_ITEM_ATTACK
  payload: {
    value: string
  }
}

export const setAttack = (value: string): SetAttackAction => ({
  type: ActionTypes.SET_ITEM_ATTACK,
  payload: {
    value,
  },
})

export interface SetParryAction {
  type: ActionTypes.SET_ITEM_PARRY
  payload: {
    value: string
  }
}

export const setParry = (value: string): SetParryAction => ({
  type: ActionTypes.SET_ITEM_PARRY,
  payload: {
    value,
  },
})

export interface SetReachAction {
  type: ActionTypes.SET_ITEM_REACH
  payload: {
    id: number
  }
}

export const setReach = (id: number): SetReachAction => ({
  type: ActionTypes.SET_ITEM_REACH,
  payload: {
    id,
  },
})

export interface SetLengthAction {
  type: ActionTypes.SET_ITEM_LENGTH
  payload: {
    value: string
  }
}

export const setLength = (value: string): SetLengthAction => ({
  type: ActionTypes.SET_ITEM_LENGTH,
  payload: {
    value,
  },
})

export interface SetStructurePointsAction {
  type: ActionTypes.SET_ITEM_STRUCTURE_POINTS
  payload: {
    value: string
  }
}

export const setStructurePoints = (value: string): SetStructurePointsAction => ({
  type: ActionTypes.SET_ITEM_STRUCTURE_POINTS,
  payload: {
    value,
  },
})

export interface SetRangeAction {
  type: ActionTypes.SET_ITEM_RANGE
  payload: {
    value: string
    index: number
  }
}

export const setRange = (value: string, index: number): SetRangeAction => ({
  type: ActionTypes.SET_ITEM_RANGE,
  payload: {
    value,
    index,
  },
})

export interface SetReloadTimeAction {
  type: ActionTypes.SET_ITEM_RELOAD_TIME
  payload: {
    value: string
  }
}

export const setReloadTime = (value: string): SetReloadTimeAction => ({
  type: ActionTypes.SET_ITEM_RELOAD_TIME,
  payload: {
    value,
  },
})

export interface SetAmmunitionAction {
  type: ActionTypes.SET_ITEM_AMMUNITION
  payload: {
    id: string
  }
}

export const setAmmunition = (id: string): SetAmmunitionAction => ({
  type: ActionTypes.SET_ITEM_AMMUNITION,
  payload: {
    id,
  },
})

export interface SetProtectionAction {
  type: ActionTypes.SET_ITEM_PROTECTION
  payload: {
    value: string
  }
}

export const setProtection = (value: string): SetProtectionAction => ({
  type: ActionTypes.SET_ITEM_PROTECTION,
  payload: {
    value,
  },
})

export interface SetEncumbranceAction {
  type: ActionTypes.SET_ITEM_ENCUMBRANCE
  payload: {
    value: string
  }
}

export const setEncumbrance = (value: string): SetEncumbranceAction => ({
  type: ActionTypes.SET_ITEM_ENCUMBRANCE,
  payload: {
    value,
  },
})

export interface SetMovementModifierAction {
  type: ActionTypes.SET_ITEM_MOVEMENT_MODIFIER
  payload: {
    value: string
  }
}

export const setMovementModifier = (value: string): SetMovementModifierAction => ({
  type: ActionTypes.SET_ITEM_MOVEMENT_MODIFIER,
  payload: {
    value,
  },
})

export interface SetInitiativeModifierAction {
  type: ActionTypes.SET_ITEM_INITIATIVE_MODIFIER
  payload: {
    value: string
  }
}

export const setInitiativeModifier = (value: string): SetInitiativeModifierAction => ({
  type: ActionTypes.SET_ITEM_INITIATIVE_MODIFIER,
  payload: {
    value,
  },
})

export interface SetStabilityModifierAction {
  type: ActionTypes.SET_ITEM_STABILITY_MODIFIER
  payload: {
    value: string
  }
}

export const setStabilityModifier = (value: string): SetStabilityModifierAction => ({
  type: ActionTypes.SET_ITEM_STABILITY_MODIFIER,
  payload: {
    value,
  },
})

export interface SwitchIsParryingWeaponAction {
  type: ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON
}

export const switchIsParryingWeapon = (): SwitchIsParryingWeaponAction => ({
  type: ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON,
})

export interface SwitchIsTwoHandedWeaponAction {
  type: ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON
}

export const switchIsTwoHandedWeapon = (): SwitchIsTwoHandedWeaponAction => ({
  type: ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON,
})

export interface SwitchIsImprovisedWeaponAction {
  type: ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON
}

export const switchIsImprovisedWeapon = (): SwitchIsImprovisedWeaponAction => ({
  type: ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON,
})

export interface SetImprovisedWeaponGroupAction {
  type: ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP
  payload: {
    gr: number
  }
}

export const setImprovisedWeaponGroup = (gr: number): SetImprovisedWeaponGroupAction => ({
  type: ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP,
  payload: {
    gr,
  },
})

export interface SetLossAction {
  type: ActionTypes.SET_ITEM_LOSS
  payload: {
    id: Maybe<number>
  }
}

export const setLoss = (id: Maybe<number>): SetLossAction => ({
  type: ActionTypes.SET_ITEM_LOSS,
  payload: {
    id,
  },
})

export interface SwitchIsForArmorZonesOnlyAction {
  type: ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY
}

export const switchIsForArmorZonesOnly = (): SwitchIsForArmorZonesOnlyAction => ({
  type: ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY,
})

export interface SwitchHasAdditionalPenaltiesAction {
  type: ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES
}

export const setHasAdditionalPenalties = (): SwitchHasAdditionalPenaltiesAction => ({
  type: ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES,
})

export interface SetArmorTypeAction {
  type: ActionTypes.SET_ITEM_ARMOR_TYPE
  payload: {
    id: number
  }
}

export const setArmorType = (id: number): SetArmorTypeAction => ({
  type: ActionTypes.SET_ITEM_ARMOR_TYPE,
  payload: {
    id,
  },
})

export interface ApplyItemTemplateAction {
  type: ActionTypes.APPLY_ITEM_TEMPLATE
  payload: {
    template: Record<ItemTemplate>
  }
}

export const applyItemTemplate: ReduxAction =
  (dispatch, getState) => {
    pipe_ (
      getState (),
      getItemEditorInstance,
      bindF (EditItem.A.template),
      bindF (lookupF (getWikiItemTemplates (getState ()))),
      fmap (template => dispatch<ApplyItemTemplateAction> ({
                          type: ActionTypes.APPLY_ITEM_TEMPLATE,
                          payload: {
                            template,
                          },
                        }))
    )
}

export interface LockItemTemplateAction {
  type: ActionTypes.LOCK_ITEM_TEMPLATE
  payload: {
    template: Record<ItemTemplate>
  }
}

export const lockItemTemplate: ReduxAction =
  (dispatch, getState) => {
    pipe_ (
      getState (),
      getItemEditorInstance,
      bindF (EditItem.A.template),
      bindF (lookupF (getWikiItemTemplates (getState ()))),
      fmap (template => dispatch<LockItemTemplateAction> ({
                          type: ActionTypes.LOCK_ITEM_TEMPLATE,
                          payload: {
                            template,
                          },
                        }))
    )
  }

export interface UnlockItemTemplateAction {
  type: ActionTypes.UNLOCK_ITEM_TEMPLATE
}

export const unlockItemTemplate = (): UnlockItemTemplateAction => ({
  type: ActionTypes.UNLOCK_ITEM_TEMPLATE,
})

export interface AddArmorZonesAction {
  type: ActionTypes.ADD_ARMOR_ZONES
  payload: {
    newId: string
  }
}

export const addArmorZonesToList = (): ReduxAction => (dispatch, getState) => {
  const mhit_zone_armors = getHitZoneArmorsState (getState ())

  if (isJust (mhit_zone_armors)) {
    const newId = getNewIdFromCurrentHitZoneArmors (mhit_zone_armors)

    return dispatch<AddArmorZonesAction> ({
      type: ActionTypes.ADD_ARMOR_ZONES,
      payload: {
        newId,
      },
    })
  }

  return undefined
}

export interface CreateArmorZonesAction {
  type: ActionTypes.CREATE_ARMOR_ZONES
}

export const createArmorZones = (): CreateArmorZonesAction => ({
  type: ActionTypes.CREATE_ARMOR_ZONES,
})

export interface CloseArmorZonesEditorAction {
  type: ActionTypes.CLOSE_ARMOR_ZONES_EDITOR
}

export const closeArmorZonesEditor = (): CloseArmorZonesEditorAction => ({
  type: ActionTypes.CLOSE_ARMOR_ZONES_EDITOR,
})

export interface SaveArmorZonesAction {
  type: ActionTypes.SAVE_ARMOR_ZONES
}

export const saveArmorZones = (): SaveArmorZonesAction => ({
  type: ActionTypes.SAVE_ARMOR_ZONES,
})

export interface EditArmorZonesAction {
  type: ActionTypes.EDIT_ARMOR_ZONES
  payload: {
    id: string
  }
}

export const editArmorZones = (id: string): EditArmorZonesAction => ({
  type: ActionTypes.EDIT_ARMOR_ZONES,
  payload: {
    id,
  },
})

export interface RemoveArmorZonesAction {
  type: ActionTypes.REMOVE_ARMOR_ZONES
  payload: {
    id: string
  }
}

export const removeArmorZonesFromList = (id: string): RemoveArmorZonesAction => ({
  type: ActionTypes.REMOVE_ARMOR_ZONES,
  payload: {
    id,
  },
})

export interface SetArmorZonesNameAction {
  type: ActionTypes.SET_ARMOR_ZONES_NAME
  payload: {
    value: string
  }
}

export const setArmorZonesName = (value: string): SetArmorZonesNameAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_NAME,
  payload: {
    value,
  },
})

export interface SetArmorZonesHeadAction {
  type: ActionTypes.SET_ARMOR_ZONES_HEAD
  payload: {
    id: Maybe<string>
  }
}

export const setArmorZonesHead = (id: Maybe<string>): SetArmorZonesHeadAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_HEAD,
  payload: {
    id,
  },
})

export interface SetArmorZonesHeadLossAction {
  type: ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS
  payload: {
    id: Maybe<number>
  }
}

export const setArmorZonesHeadLoss = (id: Maybe<number>): SetArmorZonesHeadLossAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS,
  payload: {
    id,
  },
})

export interface SetArmorZonesLeftArmAction {
  type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM
  payload: {
    id: Maybe<string>
  }
}

export const setArmorZonesLeftArm = (id: Maybe<string>): SetArmorZonesLeftArmAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM,
  payload: {
    id,
  },
})

export interface SetArmorZonesLeftArmLossAction {
  type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS
  payload: {
    id: Maybe<number>
  }
}

export const setArmorZonesLeftArmLoss = (id: Maybe<number>): SetArmorZonesLeftArmLossAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS,
  payload: {
    id,
  },
})

export interface SetArmorZonesLeftLegAction {
  type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG
  payload: {
    id: Maybe<string>
  }
}

export const setArmorZonesLeftLeg = (id: Maybe<string>): SetArmorZonesLeftLegAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG,
  payload: {
    id,
  },
})

export interface SetArmorZonesLeftLegLossAction {
  type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS
  payload: {
    id: Maybe<number>
  }
}

export const setArmorZonesLeftLegLoss =
  (id: Maybe<number>): SetArmorZonesLeftLegLossAction => ({
    type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS,
    payload: {
      id,
    },
  })

export interface SetArmorZonesTorsoAction {
  type: ActionTypes.SET_ARMOR_ZONES_TORSO
  payload: {
    id: Maybe<string>
  }
}

export const setArmorZonesTorso = (id: Maybe<string>): SetArmorZonesTorsoAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_TORSO,
  payload: {
    id,
  },
})

export interface SetArmorZonesTorsoLossAction {
  type: ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS
  payload: {
    id: Maybe<number>
  }
}

export const setArmorZonesTorsoLoss = (id: Maybe<number>): SetArmorZonesTorsoLossAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS,
  payload: {
    id,
  },
})

export interface SetArmorZonesRightArmAction {
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM
  payload: {
    id: Maybe<string>
  }
}

export const setArmorZonesRightArm = (id: Maybe<string>): SetArmorZonesRightArmAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM,
  payload: {
    id,
  },
})

export interface SetArmorZonesRightArmLossAction {
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS
  payload: {
    id: Maybe<number>
  }
}

export const setArmorZonesRightArmLoss = (id: Maybe<number>): SetArmorZonesRightArmLossAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS,
  payload: {
    id,
  },
})

export interface SetArmorZonesRightLegAction {
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG
  payload: {
    id: Maybe<string>
  }
}

export const setArmorZonesRightLeg = (id: Maybe<string>): SetArmorZonesRightLegAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG,
  payload: {
    id,
  },
})

export interface SetArmorZonesRightLegLossAction {
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS
  payload: {
    id: Maybe<number>
  }
}

export const setArmorZonesRightLegLoss = (id: Maybe<number>): SetArmorZonesRightLegLossAction => ({
  type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS,
  payload: {
    id,
  },
})

export interface SetMeleeItemTemplatesCombatTechniqueFilterAction {
  type: ActionTypes.SET_MELEE_ITEM_TEMPLATES_CT_FILTER
  payload: {
    filterOption: Maybe<MeleeCombatTechniqueId>
  }
}

export const setMeleeItemTemplatesCombatTechniqueFilter =
  (filterOption: Maybe<MeleeCombatTechniqueId>):
  SetMeleeItemTemplatesCombatTechniqueFilterAction => ({
    type: ActionTypes.SET_MELEE_ITEM_TEMPLATES_CT_FILTER,
    payload: {
      filterOption,
    },
  })

export interface SetRangedItemTemplatesCombatTechniqueFilterAction {
  type: ActionTypes.SET_RANGED_ITEM_TEMPLATES_CT_FILTER
  payload: {
    filterOption: Maybe<RangedCombatTechniqueId>
  }
}

export const setRangedItemTemplatesCombatTechniqueFilter =
  (filterOption: Maybe<RangedCombatTechniqueId>):
  SetRangedItemTemplatesCombatTechniqueFilterAction => ({
    type: ActionTypes.SET_RANGED_ITEM_TEMPLATES_CT_FILTER,
    payload: {
      filterOption,
    },
  })

export interface SetEquipmentFilterTextAction {
  type: ActionTypes.SET_EQUIPMENT_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setEquipmentFilterText = (filterText: string): SetEquipmentFilterTextAction => ({
  type: ActionTypes.SET_EQUIPMENT_FILTER_TEXT,
  payload: {
    filterText,
  },
})

export interface SetItemTemplatesFilterTextAction {
  type: ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setItemTemplatesFilterText =
  (filterText: string): SetItemTemplatesFilterTextAction => ({
    type: ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SetZoneArmorFilterTextAction {
  type: ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setZoneArmorFilterText = (filterText: string): SetZoneArmorFilterTextAction => ({
  type: ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT,
  payload: {
    filterText,
  },
})
