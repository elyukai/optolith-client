import { AddArmorZonesAction, AddItemAction, AddItemTemplateAction, ApplyItemTemplateAction, CloseItemEditorAction, CreateItemAction, EditItemAction, LockItemTemplateAction, RemoveArmorZonesAction, RemoveItemAction, SaveItemAction, SetAmmunitionAction, SetAmountAction, SetArmorTypeAction, SetAttackAction, SetCombatTechniqueAction, SetDamageDiceNumberAction, SetDamageDiceSidesAction, SetDamageFlatAction, SetDamageThresholdAction, SetDucatesAction, SetEncumbranceAction, SetFirstDamageThresholdAction, SetGroupAction, SetHellersAction, SetImprovisedWeaponGroupAction, SetInitiativeModifierAction, SetItemsSortOrderAction, SetKreutzersAction, SetLengthAction, SetLossAction, SetMovementModifierAction, SetNameAction, SetParryAction, SetPriceAction, SetPrimaryAttributeAction, SetProtectionAction, SetRangeAction, SetReachAction, SetReloadTimeAction, SetSecondDamageThresholdAction, SetSilverthalersAction, SetStabilityModifierAction, SetStructurePointsAction, SetTemplateAction, SetWeightAction, SetWhereAction, SwitchHasAdditionalPenaltiesAction, SwitchIsDamageThresholdSeparatedAction, SwitchIsForArmorZonesOnlyAction, SwitchIsImprovisedWeaponAction, SwitchIsParryingWeaponAction, SwitchIsTwoHandedWeaponAction, UnlockItemTemplateAction, SetArmorZonesHeadAction, SetArmorZonesHeadLossAction, SetArmorZonesLeftArmAction, SetArmorZonesLeftArmLossAction, SetArmorZonesLeftLegAction, SetArmorZonesLeftLegLossAction, SetArmorZonesNameAction, SetArmorZonesRightArmAction, SetArmorZonesRightArmLossAction, SetArmorZonesRightLegAction, SetArmorZonesRightLegLossAction, SetArmorZonesTorsoAction, SetArmorZonesTorsoLossAction, CloseArmorZonesEditorAction, SaveArmorZonesAction, EditArmorZonesAction, CreateArmorZonesAction } from '../actions/EquipmentActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';
import { ArmorZonesEditorInstance, ArmorZonesInstance, ItemEditorInstance, ItemInstance } from '../types/data.d';
import { convertToEdit, convertToSave } from '../utils/ItemUtils';
import { mergeIntoList, removeListItem, setListItem } from '../utils/ListUtils';

type Action = AddItemAction | AddItemTemplateAction | CreateItemAction | EditItemAction | RemoveItemAction | LoadHeroAction | SaveItemAction | SetDucatesAction | SetSilverthalersAction | SetHellersAction | SetKreutzersAction | ReceiveInitialDataAction | AddArmorZonesAction | RemoveArmorZonesAction | CreateHeroAction | SetAmmunitionAction | SetAmountAction | SetArmorTypeAction | SetAttackAction | SetCombatTechniqueAction | SetDamageDiceNumberAction | SetDamageDiceSidesAction | SetDamageFlatAction | SetDamageThresholdAction | SetEncumbranceAction | SetFirstDamageThresholdAction | SetGroupAction | SetImprovisedWeaponGroupAction | SetInitiativeModifierAction | SetItemsSortOrderAction | SetLengthAction | SetLossAction | SetMovementModifierAction | SetNameAction | SetParryAction | SetPriceAction | SetPrimaryAttributeAction | SetProtectionAction | SetRangeAction | SetReachAction | SetReloadTimeAction | SetSecondDamageThresholdAction | SetStabilityModifierAction | SetStructurePointsAction | SetTemplateAction | SetWeightAction | SetWhereAction | SwitchHasAdditionalPenaltiesAction | SwitchIsDamageThresholdSeparatedAction | SwitchIsForArmorZonesOnlyAction | SwitchIsImprovisedWeaponAction | SwitchIsParryingWeaponAction | SwitchIsTwoHandedWeaponAction | ApplyItemTemplateAction | LockItemTemplateAction | UnlockItemTemplateAction | CloseItemEditorAction | SetArmorZonesHeadAction | SetArmorZonesHeadLossAction | SetArmorZonesLeftArmAction | SetArmorZonesLeftArmLossAction | SetArmorZonesLeftLegAction | SetArmorZonesLeftLegLossAction | SetArmorZonesNameAction | SetArmorZonesRightArmAction | SetArmorZonesRightArmLossAction | SetArmorZonesRightLegAction | SetArmorZonesRightLegLossAction | SetArmorZonesTorsoAction | SetArmorZonesTorsoLossAction | CloseArmorZonesEditorAction | SaveArmorZonesAction | EditArmorZonesAction | CreateArmorZonesAction;

export interface EquipmentState {
  items: Map<string, ItemInstance>;
  itemTemplates: Map<string, ItemInstance>;
  itemEditor?: ItemEditorInstance;
  isItemCreation?: boolean;
  isArmorZonesCreation?: boolean;
  armorZones: Map<string, ArmorZonesInstance>;
  armorZoneEditor?: ArmorZonesEditorInstance;
  purse: Purse;
}

export interface Purse {
  d: string;
  h: string;
  k: string;
  s: string;
}

const initialState: EquipmentState = {
  items: new Map(),
  itemTemplates: new Map(),
  armorZones: new Map(),
  purse: {
    d: '0',
    h: '0',
    k: '0',
    s: '0',
  }
};

export function equipment(state: EquipmentState = initialState, action: Action): EquipmentState {
  switch (action.type) {
    case ActionTypes.CREATE_HERO:
      return clear(state);

    case ActionTypes.SET_DUCATES:
      return { ...state, purse: { ...state.purse, d: action.payload.value } };

    case ActionTypes.SET_SILVERTHALERS:
      return { ...state, purse: { ...state.purse, s: action.payload.value } };

    case ActionTypes.SET_HELLERS:
      return { ...state, purse: { ...state.purse, h: action.payload.value } };

    case ActionTypes.SET_KREUTZERS:
      return { ...state, purse: { ...state.purse, k: action.payload.value } };

    case ActionTypes.ADD_ITEM: {
      if (state.itemEditor !== undefined) {
        const { newId } = action.payload;
        return {
          ...state,
          items: setListItem(state.items, newId, { ...convertToSave(state.itemEditor), id: newId }),
          itemEditor: undefined,
          isItemCreation: undefined
        };
      }
      return state;
    }

    case ActionTypes.ADD_ITEM_TEMPLATE: {
      const { id, newId } = action.payload;
      const template = state.itemTemplates.get(id);
      if (template !== undefined) {
        return {
          ...state,
          items: setListItem(state.items, newId, { ...template, id: newId })
        };
      }
      return state;
    }

    case ActionTypes.CREATE_ITEM: {
      return {
        ...state,
        itemEditor: {
          movMod: '',
          iniMod: '',
          stabilityMod: '',
          amount: '',
          at: '',
          damageBonus: {
            threshold: ''
          },
          damageDiceNumber: '',
          damageFlat: '',
          enc: '',
          gr: 0,
          id: '',
          isParryingWeapon: false,
          isTemplateLocked: false,
          isTwoHandedWeapon: false,
          length: '',
          name: '',
          pa: '',
          price: '',
          pro: '',
          range: ['', '', ''],
          reloadTime: '',
          stp: '',
          weight: '',
          where: '',
        },
        isItemCreation: true
      };
    }

    case ActionTypes.SAVE_ITEM: {
      if (state.itemEditor && state.itemEditor.id) {
        const id = state.itemEditor.id;
        return {
          ...state,
          items: setListItem(state.items, id, convertToSave(state.itemEditor)),
          itemEditor: undefined,
          isItemCreation: undefined
        };
      }
      return state;
    }

    case ActionTypes.EDIT_ITEM: {
      const item = state.items.get(action.payload.id);
      if (item) {
        if (item.template !== undefined && item.isTemplateLocked === true) {
          const template = state.itemTemplates.get(item.template);
          const { id, where, loss, amount } = item;
          if (template !== undefined) {
            return {
              ...state,
              itemEditor: convertToEdit({
                ...template,
                id,
                where,
                loss,
                amount
              }),
              isItemCreation: false
            };
          }
        }
        return {
          ...state,
          itemEditor: convertToEdit(item),
          isItemCreation: false
        };
      }
      return state;
    }

    case ActionTypes.CLOSE_ITEM_EDITOR: {
      return {
        ...state,
        itemEditor: undefined,
        isItemCreation: undefined
      };
    }

    case ActionTypes.REMOVE_ITEM: {
      const { id } = action.payload;
      return {
        ...state,
        items: removeListItem(state.items, id),
        armorZones: mergeIntoList(state.armorZones, new Map([...state.armorZones].filter(([_, obj]) => {
          return obj.head === id || obj.torso === id || obj.leftArm === id || obj.rightArm === id || obj.leftLeg === id || obj.rightLeg === id;
        }).map(([key, obj]): [string, ArmorZonesInstance] => {
          if (obj.head === id) {
            obj.head = undefined;
          }
          if (obj.torso === id) {
            obj.torso = undefined;
          }
          if (obj.leftArm === id) {
            obj.leftArm = undefined;
          }
          if (obj.rightArm === id) {
            obj.rightArm = undefined;
          }
          if (obj.leftLeg === id) {
            obj.leftLeg = undefined;
          }
          if (obj.rightLeg === id) {
            obj.rightLeg = undefined;
          }
          return [key, obj];
        })))
      };
    }

    case ActionTypes.SET_ITEM_NAME: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            name: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_PRICE: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            price: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_WEIGHT: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            weight: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_AMOUNT: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            amount: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_WHERE: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            where: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_GROUP: {
      const { gr } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            gr
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_TEMPLATE: {
      const { template } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            template
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_COMBAT_TECHNIQUE: {
      const { id } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            combatTechnique: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            damageDiceNumber: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            damageDiceSides: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_DAMAGE_FLAT: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            damageFlat: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE: {
      const { primary } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            damageBonus: {
              primary,
              threshold: Array.isArray(state.itemEditor.damageBonus.threshold) ? '' : state.itemEditor.damageBonus.threshold
            }
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_DAMAGE_THRESHOLD: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            damageBonus: {
              ...state.itemEditor.damageBonus,
              threshold: value
            }
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD:
    case ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD: {
      const { value } = action.payload;
      if (state.itemEditor) {
        const threshold = [...state.itemEditor.damageBonus.threshold] as string[];
        threshold[action.type === ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD ? 0 : 1] = value;
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            damageBonus: {
              ...state.itemEditor.damageBonus,
              threshold
            }
          }
        };
      }
      return state;
    }

    case ActionTypes.SWITCH_IS_ITEM_DAMAGE_THRESHOLD_SEPARATED: {
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            damageBonus: {
              ...state.itemEditor.damageBonus,
              threshold: Array.isArray(state.itemEditor.damageBonus.threshold) ? '' : ['', '']
            }
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_ATTACK: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            at: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_PARRY: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            pa: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_REACH: {
      const { id } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            reach: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_LENGTH: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            length: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_STRUCTURE_POINTS: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            stp: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_RANGE: {
      const { index, value } = action.payload;
      if (state.itemEditor) {
        const previous = [...state.itemEditor.range] as [string, string, string];
        previous[index - 1] = value;
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            range: previous
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_RELOAD_TIME: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            reloadTime: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_AMMUNITION: {
      const { id } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            ammunition: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_PROTECTION: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            pro: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_ENCUMBRANCE: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            enc: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_MOVEMENT_MODIFIER: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            movMod: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_INITIATIVE_MODIFIER: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            iniMod: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_STABILITY_MODIFIER: {
      const { value } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            stabilityMod: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON: {
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            isParryingWeapon: !state.itemEditor.isParryingWeapon
          }
        };
      }
      return state;
    }

    case ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON: {
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            isTwoHandedWeapon: !state.itemEditor.isTwoHandedWeapon
          }
        };
      }
      return state;
    }

    case ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON: {
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            improvisedWeaponGroup: typeof state.itemEditor.improvisedWeaponGroup === 'number' ? undefined : 0
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP: {
      const { gr } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            improvisedWeaponGroup: gr
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_LOSS: {
      const { id } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            loss: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY: {
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            forArmorZoneOnly: !state.itemEditor.forArmorZoneOnly
          }
        };
      }
      return state;
    }

    case ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES: {
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            addPenalties: !state.itemEditor.addPenalties
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ITEM_ARMOR_TYPE: {
      const { id } = action.payload;
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            armorType: id
          }
        };
      }
      return state;
    }

    case ActionTypes.APPLY_ITEM_TEMPLATE:
    case ActionTypes.LOCK_ITEM_TEMPLATE: {
      if (state.itemEditor && typeof state.itemEditor.template === 'string') {
        const template = state.itemTemplates.get(state.itemEditor.template);
        const { id, where, loss, amount } = state.itemEditor;
        if (template !== undefined) {
          return {
            ...state,
            itemEditor: {
              ...convertToEdit(template),
              id,
              where,
              loss,
              amount,
              isTemplateLocked: action.type === ActionTypes.LOCK_ITEM_TEMPLATE
            }
          };
        }
      }
      return state;
    }

    case ActionTypes.UNLOCK_ITEM_TEMPLATE: {
      if (state.itemEditor) {
        return {
          ...state,
          itemEditor: {
            ...state.itemEditor,
            isTemplateLocked: false
          }
        };
      }
      return state;
    }

    case ActionTypes.ADD_ARMOR_ZONES: {
      if (state.armorZoneEditor !== undefined) {
        const { newId } = action.payload;
        return {
          ...state,
          armorZones: setListItem(state.armorZones, newId, { ...state.armorZoneEditor, id: newId }),
          armorZoneEditor: undefined,
          isArmorZonesCreation: undefined
        };
      }
      return state;
    }

    case ActionTypes.REMOVE_ARMOR_ZONES: {
      return {
        ...state,
        armorZones: removeListItem(state.armorZones, action.payload.id)
      };
    }

    case ActionTypes.CREATE_ARMOR_ZONES: {
      return {
        ...state,
        armorZoneEditor: {
          name: ''
        },
        isArmorZonesCreation: true
      };
    }

    case ActionTypes.SAVE_ARMOR_ZONES: {
      if (state.armorZoneEditor && state.armorZoneEditor.id) {
        const id = state.armorZoneEditor.id;
        return {
          ...state,
          armorZones: setListItem(state.armorZones, id, { ...state.armorZoneEditor, id }),
          armorZoneEditor: undefined,
          isArmorZonesCreation: undefined
        };
      }
      return state;
    }

    case ActionTypes.EDIT_ARMOR_ZONES: {
      const armorZone = state.armorZones.get(action.payload.id);
      if (armorZone) {
        return {
          ...state,
          armorZoneEditor: armorZone,
          isArmorZonesCreation: false
        };
      }
      return state;
    }

    case ActionTypes.CLOSE_ARMOR_ZONES_EDITOR: {
      return {
        ...state,
        armorZoneEditor: undefined,
        isArmorZonesCreation: undefined
      };
    }

    case ActionTypes.SET_ARMOR_ZONES_NAME: {
      const { value } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            name: value
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_HEAD: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            head: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            headLoss: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            leftArm: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            leftArmLoss: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            leftLeg: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            leftLegLoss: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_TORSO: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            torso: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            torsoLoss: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            rightArm: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            rightArmLoss: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            rightLeg: id
          }
        };
      }
      return state;
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS: {
      const { id } = action.payload;
      if (state.armorZoneEditor) {
        return {
          ...state,
          armorZoneEditor: {
            ...state.armorZoneEditor,
            rightLegLoss: id
          }
        };
      }
      return state;
    }

    case ActionTypes.LOAD_HERO:
      const { belongings: { items, purse, armorZones } } = action.payload.data;
      const itemsMap = new Map<string, ItemInstance>();
      const armorZonesMap = new Map<string, ArmorZonesInstance>();
      for (const id in items) {
        if (items.hasOwnProperty(id)) {
          itemsMap.set(id, items[id]);
        }
      }
      for (const id in armorZones) {
        if (armorZones.hasOwnProperty(id)) {
          armorZonesMap.set(id, armorZones[id]);
        }
      }
      return {
        ...state,
        items: itemsMap,
        armorZones: armorZonesMap,
        purse
      };

    default:
      return state;
  }
}

function clear(state: EquipmentState): EquipmentState {
  return {
    ...state,
    items: new Map(),
    armorZones: new Map(),
    purse: {
      d: '0',
      h: '0',
      k: '0',
      s: '0'
    }
  };
}
