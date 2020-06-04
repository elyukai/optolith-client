import { not } from "../../Data/Bool"
import { ident } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { over, set, view } from "../../Data/Lens"
import { insertAt, isList } from "../../Data/List"
import { bind, bindF, ensure, fromJust, isJust, Just, maybe, Maybe, Nothing } from "../../Data/Maybe"
import { insert, lookup, map, sdelete } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { isTuple, Pair } from "../../Data/Tuple"
import { upd1, upd2 } from "../../Data/Tuple/Update"
import * as EquipmentActions from "../Actions/EquipmentActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { CombatTechniqueId } from "../Constants/Ids"
import { BelongingsL } from "../Models/Hero/Belongings"
import { EditHitZoneArmor, EditHitZoneArmorL, EditHitZoneArmorSafe, ensureHitZoneArmorId } from "../Models/Hero/EditHitZoneArmor"
import { EditItem, EditItemL, EditItemSafe, ensureEditId } from "../Models/Hero/EditItem"
import { EditPrimaryAttributeDamageThreshold, EditPrimaryAttributeDamageThresholdL } from "../Models/Hero/EditPrimaryAttributeDamageThreshold"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import { HitZoneArmor, HitZoneArmorL } from "../Models/Hero/HitZoneArmor"
import { fromItemTemplate, Item } from "../Models/Hero/Item"
import { PurseL } from "../Models/Hero/Purse"
import { composeL } from "../Utilities/compose"
import { editableToHitZoneArmor, editableToItem, fromItemTemplateEdit, hitZoneArmorToEditable, itemToEditable } from "../Utilities/ItemUtils"
import { pipe, pipe_ } from "../Utilities/pipe"

type Action = EquipmentActions.AddItemAction
            | EquipmentActions.AddItemTemplateAction
            | EquipmentActions.CreateItemAction
            | EquipmentActions.EditItemAction
            | EquipmentActions.RemoveItemAction
            | EquipmentActions.SaveItemAction
            | EquipmentActions.SetDucatesAction
            | EquipmentActions.SetSilverthalersAction
            | EquipmentActions.SetHellersAction
            | EquipmentActions.SetKreutzersAction
            | EquipmentActions.SetMoneyAction
            | EquipmentActions.AddArmorZonesAction
            | EquipmentActions.RemoveArmorZonesAction
            | EquipmentActions.SetAmmunitionAction
            | EquipmentActions.SetAmountAction
            | EquipmentActions.SetArmorTypeAction
            | EquipmentActions.SetAttackAction
            | EquipmentActions.SetCombatTechniqueAction
            | EquipmentActions.SetDamageDiceNumberAction
            | EquipmentActions.SetDamageDiceSidesAction
            | EquipmentActions.SetDamageFlatAction
            | EquipmentActions.SetDamageThresholdAction
            | EquipmentActions.SetEncumbranceAction
            | EquipmentActions.SetFirstDamageThresholdAction
            | EquipmentActions.SetGroupAction
            | EquipmentActions.SetImprovisedWeaponGroupAction
            | EquipmentActions.SetInitiativeModifierAction
            | EquipmentActions.SetItemsSortOrderAction
            | EquipmentActions.SetLengthAction
            | EquipmentActions.SetLossAction
            | EquipmentActions.SetMovementModifierAction
            | EquipmentActions.SetNameAction
            | EquipmentActions.SetParryAction
            | EquipmentActions.SetPriceAction
            | EquipmentActions.SetPrimaryAttributeAction
            | EquipmentActions.SetProtectionAction
            | EquipmentActions.SetRangeAction
            | EquipmentActions.SetReachAction
            | EquipmentActions.SetReloadTimeAction
            | EquipmentActions.SetSecondDamageThresholdAction
            | EquipmentActions.SetStabilityModifierAction
            | EquipmentActions.SetStructurePointsAction
            | EquipmentActions.SetTemplateAction
            | EquipmentActions.SetWeightAction
            | EquipmentActions.SetWhereAction
            | EquipmentActions.SwitchHasAdditionalPenaltiesAction
            | EquipmentActions.SwitchIsDamageThresholdSeparatedAction
            | EquipmentActions.SwitchIsForArmorZonesOnlyAction
            | EquipmentActions.SwitchIsImprovisedWeaponAction
            | EquipmentActions.SwitchIsParryingWeaponAction
            | EquipmentActions.SwitchIsTwoHandedWeaponAction
            | EquipmentActions.ApplyItemTemplateAction
            | EquipmentActions.LockItemTemplateAction
            | EquipmentActions.UnlockItemTemplateAction
            | EquipmentActions.CloseItemEditorAction
            | EquipmentActions.SetArmorZonesHeadAction
            | EquipmentActions.SetArmorZonesHeadLossAction
            | EquipmentActions.SetArmorZonesLeftArmAction
            | EquipmentActions.SetArmorZonesLeftArmLossAction
            | EquipmentActions.SetArmorZonesLeftLegAction
            | EquipmentActions.SetArmorZonesLeftLegLossAction
            | EquipmentActions.SetArmorZonesNameAction
            | EquipmentActions.SetArmorZonesRightArmAction
            | EquipmentActions.SetArmorZonesRightArmLossAction
            | EquipmentActions.SetArmorZonesRightLegAction
            | EquipmentActions.SetArmorZonesRightLegLossAction
            | EquipmentActions.SetArmorZonesTorsoAction
            | EquipmentActions.SetArmorZonesTorsoLossAction
            | EquipmentActions.CloseArmorZonesEditorAction
            | EquipmentActions.SaveArmorZonesAction
            | EquipmentActions.EditArmorZonesAction
            | EquipmentActions.CreateArmorZonesAction

const { belongings } = HeroModelL

const {
  hitZoneArmors,
  isInItemCreation,
  isInHitZoneArmorCreation,
  itemInEditor,
  items,
  purse,
  hitZoneArmorInEditor,
} = BelongingsL

const { d, h, k, s } = PurseL

const EIA = EditItem.A

const {
  id: edit_id,
  name,
  addPenalties,
  ammunition,
  amount,
  armorType,
  at,
  combatTechnique,
  damageBonus,
  damageDiceNumber,
  damageDiceSides,
  damageFlat,
  enc,
  forArmorZoneOnly,
  gr,
  improvisedWeaponGroup,
  iniMod,
  isParryingWeapon,
  isTemplateLocked,
  isTwoHandedWeapon,
  length,
  loss,
  movMod,
  pa,
  price,
  pro,
  range,
  reach,
  reloadTime,
  stabilityMod,
  stp,
  template,
  weight,
  where,
} = EditItemL

const {
  head,
  leftArm,
  leftLeg,
  rightArm,
  rightLeg,
  torso,
} = HitZoneArmorL

const {
  id: ehza_id,
  name: ehza_name,
  head: ehza_head,
  headLoss: ehza_headLoss,
  leftArm: ehza_leftArm,
  leftArmLoss: ehza_leftArmLoss,
  leftLeg: ehza_leftLeg,
  leftLegLoss: ehza_leftLegLoss,
  rightArm: ehza_rightArm,
  rightArmLoss: ehza_rightArmLoss,
  rightLeg: ehza_rightLeg,
  rightLegLoss: ehza_rightLegLoss,
  torso: ehza_torso,
  torsoLoss: ehza_torsoLoss,
} = EditHitZoneArmorL

const purseReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_DUCATES:
        return set (composeL (belongings, purse, d))
                   (action.payload.value)

      case ActionTypes.SET_SILVERTHALERS:
        return set (composeL (belongings, purse, s))
                   (action.payload.value)

      case ActionTypes.SET_HELLERS:
        return set (composeL (belongings, purse, h))
                   (action.payload.value)

      case ActionTypes.SET_KREUTZERS:
        return set (composeL (belongings, purse, k))
                   (action.payload.value)

      case ActionTypes.SET_MONEY:
        return pipe (
          set (composeL (belongings, purse, d)) (action.payload.d.toString ()),
          set (composeL (belongings, purse, s)) (action.payload.s.toString ()),
          set (composeL (belongings, purse, h)) (action.payload.h.toString ()),
          set (composeL (belongings, purse, k)) (action.payload.k.toString ()),
        )

      default:
        return ident
    }
  }

const equipmentManagingReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ADD_ITEM: {
        const { newId } = action.payload

        return hero =>
          maybe (hero)
                ((edit_item: Record<EditItem>) =>
                  over (belongings)
                       (pipe (
                         over (items)
                              (insert (newId)
                                      (editableToItem (set (edit_id)
                                                           (Just (newId))
                                                           (edit_item) as Record<EditItemSafe>))),
                         set (itemInEditor) (Nothing)
                       ))
                       (hero))
                (view (composeL (belongings, itemInEditor)) (hero))
      }

      case ActionTypes.ADD_ITEM_TEMPLATE: {
        const { newId } = action.payload

        return over (composeL (belongings, items))
                    (insert (newId) (fromItemTemplate (newId) (action.payload.template)))
      }

      case ActionTypes.CREATE_ITEM: {
        return over (belongings)
                    (pipe (
                      set (itemInEditor) (Just (EditItem.default)),
                      set (isInItemCreation) (true)
                    ))
      }

      case ActionTypes.SAVE_ITEM: {
        return hero =>
          maybe (hero)
                ((edit_item: Record<EditItemSafe>) =>
                  over (belongings)
                       (pipe (
                         over (items)
                              (insert (fromJust (view (edit_id) (edit_item) as Just<string>))
                                      (
                                        editableToItem (edit_item)

                                        // TODO: does not handle locked
                                        // templated anymore
                                      )),
                         set (itemInEditor) (Nothing)
                       ))
                       (hero))
                (bind (view (composeL (belongings, itemInEditor)) (hero))
                      (ensure (ensureEditId)))
      }

      case ActionTypes.EDIT_ITEM: {
        return hero =>
          maybe (hero)
                ((x: Record<Item>) =>
                  over (belongings)
                       (pipe (
                         set (itemInEditor)
                             (Just (itemToEditable (x))),
                         set (isInItemCreation)
                             (false)
                       ))
                       (hero))
                (lookup (action.payload.id)
                        (view (composeL (belongings, items)) (hero)))
      }

      case ActionTypes.CLOSE_ITEM_EDITOR: {
        return over (belongings)
                    (pipe (
                      set (itemInEditor)
                          (Nothing),
                      set (isInItemCreation)
                          (false)
                    ))
      }

      case ActionTypes.REMOVE_ITEM: {
        const { id: id_to_remove } = action.payload

        const ensureNotId: (x: string) => Maybe<string> =
          ensure<string> (x => x !== id_to_remove)

        return over (belongings)
                    (pipe (
                      over (items)
                           (sdelete (id_to_remove)),
                      over (hitZoneArmors)
                           (map (pipe (

                                  // Remove hit zone from armor if hit zone
                                  // contains removed item
                                  over (head) (bindF (ensureNotId)),
                                  over (torso) (bindF (ensureNotId)),
                                  over (leftArm) (bindF (ensureNotId)),
                                  over (rightArm) (bindF (ensureNotId)),
                                  over (leftLeg) (bindF (ensureNotId)),
                                  over (rightLeg) (bindF (ensureNotId))
                                )))
                    ))
      }

      default:
        return ident
    }
  }

const modifyEditItem =
  (f: ident<Record<EditItem>>) =>
    over (composeL (belongings, itemInEditor))
         (fmap (f))

const itemGeneralReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_ITEM_NAME:
        return modifyEditItem (set (name)
                                   (action.payload.value))

      case ActionTypes.SET_ITEM_PRICE:
        return modifyEditItem (set (price)
                                   (action.payload.value))

      case ActionTypes.SET_ITEM_WEIGHT:
        return modifyEditItem (set (weight)
                                   (action.payload.value))

      case ActionTypes.SET_ITEM_AMOUNT:
        return modifyEditItem (set (amount)
                                   (action.payload.value))

      case ActionTypes.SET_ITEM_WHERE:
        return modifyEditItem (set (where)
                                   (Just (action.payload.value)))

      case ActionTypes.SET_ITEM_GROUP:
        return modifyEditItem (item => pipe_ (
                                item,
                                set (gr) (action.payload.gr),
                                EIA.gr (item) < 5 && action.payload.gr > 4
                                ? set (improvisedWeaponGroup) (Nothing)
                                : ident
                              ))

      case ActionTypes.SET_ITEM_TEMPLATE:
        return modifyEditItem (set (template)
                                   (Just (action.payload.template)))

      default:
        return ident
    }
  }

const { primary, threshold } = EditPrimaryAttributeDamageThresholdL

const itemDetailsReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_ITEM_COMBAT_TECHNIQUE: {
        return modifyEditItem (action.payload.id === CombatTechniqueId.Lances
                                ? pipe (
                                  set (at) (""),
                                  set (pa) (""),
                                  set (damageBonus) (EditPrimaryAttributeDamageThreshold.default),
                                  set (reach) (Nothing),
                                  set (combatTechnique) (Just (action.payload.id))
                                )
                                : set (combatTechnique) (Just (action.payload.id)))
      }

      case ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER: {
        return modifyEditItem (set (damageDiceNumber)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES: {
        return modifyEditItem (set (damageDiceSides)
                                   (Just (action.payload.value)))
      }

      case ActionTypes.SET_ITEM_DAMAGE_FLAT: {
        return modifyEditItem (set (damageFlat)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE: {
        return modifyEditItem (over (damageBonus)
                                    (pipe (
                                      set (primary) (action.payload.primary),
                                      over (threshold)
                                           (xs => isList (xs) ? "" : xs)
                                    )))
      }

      case ActionTypes.SET_ITEM_DAMAGE_THRESHOLD: {
        return modifyEditItem (set (composeL (damageBonus, threshold))
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD:
      case ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD: {
        const isFirst = action.type === ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD

        return modifyEditItem (over (composeL (damageBonus, threshold))
                                    (xs => isTuple (xs)
                                      ? isFirst
                                        ? upd1 (action.payload.value) (xs)
                                        : upd2 (action.payload.value) (xs)
                                      : xs))
      }

      case ActionTypes.SET_ITEM_ATTACK: {
        return modifyEditItem (set (at)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_PARRY: {
        return modifyEditItem (set (pa)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_REACH: {
        return modifyEditItem (set (reach)
                                   (Just (action.payload.id)))
      }

      case ActionTypes.SET_ITEM_LENGTH: {
        return modifyEditItem (set (length)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_STRUCTURE_POINTS: {
        return modifyEditItem (set (stp)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_RANGE: {
        const { index, value } = action.payload

        return modifyEditItem (over (range)
                                    (insertAt (index - 1) (value)))
      }

      case ActionTypes.SET_ITEM_RELOAD_TIME: {
        return modifyEditItem (set (reloadTime)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_AMMUNITION: {
        return modifyEditItem (set (ammunition)
                                   (Just (action.payload.id)))
      }

      case ActionTypes.SET_ITEM_STABILITY_MODIFIER: {
        return modifyEditItem (set (stabilityMod)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_LOSS: {
        return modifyEditItem (set (loss)
                                   (action.payload.id))
      }

      default:
        return ident
    }
  }

const itemOptionsReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SWITCH_IS_ITEM_DT_SEPARATED: {
        return modifyEditItem (over (composeL (damageBonus, threshold))
                                    (xs => isTuple (xs) ? "" : Pair ("", "")))
      }

      case ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON: {
        return modifyEditItem (over (isParryingWeapon)
                                    (not))
      }

      case ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON: {
        return modifyEditItem (over (isTwoHandedWeapon)
                                    (not))
      }

      case ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON: {
        return modifyEditItem (over (improvisedWeaponGroup)
                                    (x => isJust (x) ? Nothing : Just (1)))
      }

      case ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP: {
        return modifyEditItem (set (improvisedWeaponGroup)
                                   (Just (action.payload.gr)))
      }

      default:
        return ident
    }
  }

const armorReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_ITEM_PROTECTION: {
        return modifyEditItem (set (pro)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_ENCUMBRANCE: {
        return modifyEditItem (set (enc)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_MOVEMENT_MODIFIER: {
        return modifyEditItem (set (movMod)
                                   (action.payload.value))
      }

      case ActionTypes.SET_ITEM_INITIATIVE_MODIFIER: {
        return modifyEditItem (set (iniMod)
                                   (action.payload.value))
      }

      case ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY: {
        return modifyEditItem (over (forArmorZoneOnly)
                                    (not))
      }

      case ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES: {
        return modifyEditItem (over (addPenalties)
                                    (not))
      }

      case ActionTypes.SET_ITEM_ARMOR_TYPE: {
        return modifyEditItem (set (armorType)
                                   (Just (action.payload.id)))
      }

      default:
        return ident
    }
  }

const itemTemplateReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.APPLY_ITEM_TEMPLATE:
      case ActionTypes.LOCK_ITEM_TEMPLATE: {
        return modifyEditItem (x => pipe (
                                           fromItemTemplateEdit (view (edit_id) (x)),
                                           set (where) (view (where) (x)),
                                           set (loss) (view (loss) (x)),
                                           set (amount) (view (amount) (x)),
                                           set (isTemplateLocked)
                                               (action.type === ActionTypes.LOCK_ITEM_TEMPLATE)
                                         )
                                         (action.payload.template))
      }

      case ActionTypes.UNLOCK_ITEM_TEMPLATE: {
        return modifyEditItem (set (isTemplateLocked)
                                   (false))
      }

      default:
        return ident
    }
  }

const modifyEditHitZoneArmor =
  (f: ident<Record<EditHitZoneArmor>>) =>
    over (composeL (belongings, hitZoneArmorInEditor))
         (fmap (f))

const hitZoneArmorsReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ADD_ARMOR_ZONES: {
        const { newId } = action.payload

        return hero =>
          maybe (hero)
                ((edit_hza: Record<EditHitZoneArmor>) =>
                  over (belongings)
                       (pipe (
                         over (hitZoneArmors)
                              (insert (newId)
                                      (editableToHitZoneArmor
                                        (set (ehza_id)
                                             (Just (newId))
                                             (edit_hza) as Record<EditHitZoneArmorSafe>))),
                         set (hitZoneArmorInEditor) (Nothing)
                       ))
                       (hero))
                (view (composeL (belongings, hitZoneArmorInEditor)) (hero))
      }

      case ActionTypes.REMOVE_ARMOR_ZONES: {
        return over (composeL (belongings, hitZoneArmors))
                    (sdelete (action.payload.id))
      }

      case ActionTypes.CREATE_ARMOR_ZONES: {
        return over (belongings)
                    (pipe (
                      set (hitZoneArmorInEditor) (Just (EditHitZoneArmor.default)),
                      set (isInHitZoneArmorCreation) (true)
                    ))
      }

      case ActionTypes.SAVE_ARMOR_ZONES: {
        return hero =>
          maybe (hero)
                ((edit_hza: Record<EditHitZoneArmorSafe>) =>
                  over (belongings)
                       (pipe (
                         over (hitZoneArmors)
                              (insert (fromJust (view (ehza_id) (edit_hza) as Just<string>))
                                      (
                                        editableToHitZoneArmor (edit_hza)
                                      )),
                         set (itemInEditor) (Nothing)
                       ))
                       (hero))
                (bind (view (composeL (belongings, hitZoneArmorInEditor)) (hero))
                      (ensure (ensureHitZoneArmorId)))
      }

      case ActionTypes.EDIT_ARMOR_ZONES: {
        return hero =>
          maybe (hero)
                ((x: Record<HitZoneArmor>) =>
                  over (belongings)
                       (pipe (
                         set (hitZoneArmorInEditor)
                             (Just (hitZoneArmorToEditable (x))),
                         set (isInHitZoneArmorCreation)
                             (false)
                       ))
                       (hero))
                (lookup (action.payload.id)
                        (view (composeL (belongings, hitZoneArmors)) (hero)))
      }

      case ActionTypes.CLOSE_ARMOR_ZONES_EDITOR: {
        return over (belongings)
                    (pipe (
                      set (hitZoneArmorInEditor)
                          (Nothing),
                      set (isInHitZoneArmorCreation)
                          (false)
                    ))
      }

      case ActionTypes.SET_ARMOR_ZONES_NAME: {
        return modifyEditHitZoneArmor (set (ehza_name)
                                           (action.payload.value))
      }

      case ActionTypes.SET_ARMOR_ZONES_HEAD: {
        return modifyEditHitZoneArmor (set (ehza_head)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS: {
        return modifyEditHitZoneArmor (set (ehza_headLoss)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM: {
        return modifyEditHitZoneArmor (set (ehza_leftArm)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS: {
        return modifyEditHitZoneArmor (set (ehza_leftArmLoss)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG: {
        return modifyEditHitZoneArmor (set (ehza_leftLeg)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS: {
        return modifyEditHitZoneArmor (set (ehza_leftLegLoss)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_TORSO: {
        return modifyEditHitZoneArmor (set (ehza_torso)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS: {
        return modifyEditHitZoneArmor (set (ehza_torsoLoss)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM: {
        return modifyEditHitZoneArmor (set (ehza_rightArm)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS: {
        return modifyEditHitZoneArmor (set (ehza_rightArmLoss)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG: {
        return modifyEditHitZoneArmor (set (ehza_rightLeg)
                                           (action.payload.id))
      }

      case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS: {
        return modifyEditHitZoneArmor (set (ehza_rightLegLoss)
                                           (action.payload.id))
      }

      default:
        return ident
    }
  }

export const equipmentReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_DUCATES:
      case ActionTypes.SET_SILVERTHALERS:
      case ActionTypes.SET_HELLERS:
      case ActionTypes.SET_KREUTZERS:
      case ActionTypes.SET_MONEY:
        return purseReducer (action)

      case ActionTypes.ADD_ITEM:
      case ActionTypes.ADD_ITEM_TEMPLATE:
      case ActionTypes.CREATE_ITEM:
      case ActionTypes.SAVE_ITEM:
      case ActionTypes.EDIT_ITEM:
      case ActionTypes.CLOSE_ITEM_EDITOR:
      case ActionTypes.REMOVE_ITEM:
        return equipmentManagingReducer (action)

      case ActionTypes.SET_ITEM_NAME:
      case ActionTypes.SET_ITEM_PRICE:
      case ActionTypes.SET_ITEM_WEIGHT:
      case ActionTypes.SET_ITEM_AMOUNT:
      case ActionTypes.SET_ITEM_WHERE:
      case ActionTypes.SET_ITEM_GROUP:
      case ActionTypes.SET_ITEM_TEMPLATE:
        return itemGeneralReducer (action)

      case ActionTypes.SET_ITEM_COMBAT_TECHNIQUE:
      case ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER:
      case ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES:
      case ActionTypes.SET_ITEM_DAMAGE_FLAT:
      case ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE:
      case ActionTypes.SET_ITEM_DAMAGE_THRESHOLD:
      case ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD:
      case ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD:
      case ActionTypes.SET_ITEM_ATTACK:
      case ActionTypes.SET_ITEM_PARRY:
      case ActionTypes.SET_ITEM_REACH:
      case ActionTypes.SET_ITEM_LENGTH:
      case ActionTypes.SET_ITEM_STRUCTURE_POINTS:
      case ActionTypes.SET_ITEM_RANGE:
      case ActionTypes.SET_ITEM_RELOAD_TIME:
      case ActionTypes.SET_ITEM_AMMUNITION:
      case ActionTypes.SET_ITEM_STABILITY_MODIFIER:
      case ActionTypes.SET_ITEM_LOSS:
        return itemDetailsReducer (action)

      case ActionTypes.SWITCH_IS_ITEM_DT_SEPARATED:
      case ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON:
      case ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON:
      case ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON:
      case ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP:
        return itemOptionsReducer (action)

      case ActionTypes.SET_ITEM_PROTECTION:
      case ActionTypes.SET_ITEM_ENCUMBRANCE:
      case ActionTypes.SET_ITEM_MOVEMENT_MODIFIER:
      case ActionTypes.SET_ITEM_INITIATIVE_MODIFIER:
      case ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY:
      case ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES:
      case ActionTypes.SET_ITEM_ARMOR_TYPE:
        return armorReducer (action)

      case ActionTypes.APPLY_ITEM_TEMPLATE:
      case ActionTypes.LOCK_ITEM_TEMPLATE:
      case ActionTypes.UNLOCK_ITEM_TEMPLATE:
        return itemTemplateReducer (action)

      case ActionTypes.ADD_ARMOR_ZONES:
      case ActionTypes.REMOVE_ARMOR_ZONES:
      case ActionTypes.CREATE_ARMOR_ZONES:
      case ActionTypes.SAVE_ARMOR_ZONES:
      case ActionTypes.EDIT_ARMOR_ZONES:
      case ActionTypes.CLOSE_ARMOR_ZONES_EDITOR:
      case ActionTypes.SET_ARMOR_ZONES_NAME:
      case ActionTypes.SET_ARMOR_ZONES_HEAD:
      case ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS:
      case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM:
      case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS:
      case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG:
      case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS:
      case ActionTypes.SET_ARMOR_ZONES_TORSO:
      case ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS:
      case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM:
      case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS:
      case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG:
      case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS:
        return hitZoneArmorsReducer (action)

      default:
        return ident
    }
  }
