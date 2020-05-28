import { flip } from "../../Data/Function"
import { set } from "../../Data/Lens"
import { List } from "../../Data/List"
import * as ActionTypes from "../Constants/ActionTypes"
import { HeroModelRecord } from "../Models/Hero/Hero"
import { reduceReducersC } from "../Utilities/reduceReducers"
import { undo } from "../Utilities/undo"
import { adventurePointsReducer } from "./adventurePointsReducer"
import { applyRCPSelectionsReducer } from "./applyRCPSelectionsReducer"
import { dependentReducer } from "./dependentReducer"
import { energiesReducer } from "./energiesReducer"
import { equipmentReducer } from "./equipmentReducer"
import { pactReducer } from "./pactReducer"
import { petsReducer } from "./petsReducer"
import { phaseReducer } from "./phaseReducer"
import { profileReducer } from "./profileReducer"
import { rcpReducer } from "./rcpReducer"
import { rulesReducer } from "./rulesReducer"

export const heroReducer =
  undo (List (
         ActionTypes.SAVE_HERO
       ))
       (List (
         ActionTypes.CREATE_ITEM,
         ActionTypes.CLOSE_ITEM_EDITOR,
         ActionTypes.EDIT_ITEM,
         ActionTypes.SET_ITEM_NAME,
         ActionTypes.SET_ITEM_PRICE,
         ActionTypes.SET_ITEM_WEIGHT,
         ActionTypes.SET_ITEM_AMOUNT,
         ActionTypes.SET_ITEM_WHERE,
         ActionTypes.SET_ITEM_GROUP,
         ActionTypes.SET_ITEM_TEMPLATE,
         ActionTypes.SET_ITEM_COMBAT_TECHNIQUE,
         ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER,
         ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES,
         ActionTypes.SET_ITEM_DAMAGE_FLAT,
         ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE,
         ActionTypes.SET_ITEM_DAMAGE_THRESHOLD,
         ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD,
         ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD,
         ActionTypes.SWITCH_IS_ITEM_DT_SEPARATED,
         ActionTypes.SET_ITEM_ATTACK,
         ActionTypes.SET_ITEM_PARRY,
         ActionTypes.SET_ITEM_REACH,
         ActionTypes.SET_ITEM_LENGTH,
         ActionTypes.SET_ITEM_STRUCTURE_POINTS,
         ActionTypes.SET_ITEM_RANGE,
         ActionTypes.SET_ITEM_RELOAD_TIME,
         ActionTypes.SET_ITEM_AMMUNITION,
         ActionTypes.SET_ITEM_PROTECTION,
         ActionTypes.SET_ITEM_ENCUMBRANCE,
         ActionTypes.SET_ITEM_MOVEMENT_MODIFIER,
         ActionTypes.SET_ITEM_INITIATIVE_MODIFIER,
         ActionTypes.SET_ITEM_STABILITY_MODIFIER,
         ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON,
         ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON,
         ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON,
         ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP,
         ActionTypes.SET_ITEM_LOSS,
         ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY,
         ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES,
         ActionTypes.SET_ITEM_ARMOR_TYPE,
         ActionTypes.APPLY_ITEM_TEMPLATE,
         ActionTypes.LOCK_ITEM_TEMPLATE,
         ActionTypes.UNLOCK_ITEM_TEMPLATE,
         ActionTypes.CREATE_ARMOR_ZONES,
         ActionTypes.EDIT_ARMOR_ZONES,
         ActionTypes.CLOSE_ARMOR_ZONES_EDITOR,
         ActionTypes.SET_ARMOR_ZONES_NAME,
         ActionTypes.SET_ARMOR_ZONES_HEAD,
         ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS,
         ActionTypes.SET_ARMOR_ZONES_LEFT_ARM,
         ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS,
         ActionTypes.SET_ARMOR_ZONES_LEFT_LEG,
         ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS,
         ActionTypes.SET_ARMOR_ZONES_TORSO,
         ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS,
         ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM,
         ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS,
         ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG,
         ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS
       ))
       (HeroModel.default)
       (reduceReducersC<HeroModelRecord, any> (
         adventurePointsReducer,
         dependentReducer,
         energiesReducer,
         equipmentReducer,
         pactReducer,
         petsReducer,
         phaseReducer,
         profileReducer,
         rcpReducer,
         rulesReducer,
         applyRCPSelectionsReducer
       ))

export const toHeroWithHistory =
  flip (set (heroReducer.L.present)) (heroReducer.default)
