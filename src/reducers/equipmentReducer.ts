import * as EquipmentActions from '../actions/EquipmentActions';
import * as Data from '../App/Models/Hero/heroTypeHelpers';
import { convertToEdit, convertToSave } from '../App/Utils/ItemUtils';
import { ActionTypes } from '../constants/ActionTypes';
import { Just, List, Maybe, Record } from '../utils/dataUtils';

type Action =
  EquipmentActions.AddItemAction |
  EquipmentActions.AddItemTemplateAction |
  EquipmentActions.CreateItemAction |
  EquipmentActions.EditItemAction |
  EquipmentActions.RemoveItemAction |
  EquipmentActions.SaveItemAction |
  EquipmentActions.SetDucatesAction |
  EquipmentActions.SetSilverthalersAction |
  EquipmentActions.SetHellersAction |
  EquipmentActions.SetKreutzersAction |
  EquipmentActions.AddArmorZonesAction |
  EquipmentActions.RemoveArmorZonesAction |
  EquipmentActions.SetAmmunitionAction |
  EquipmentActions.SetAmountAction |
  EquipmentActions.SetArmorTypeAction |
  EquipmentActions.SetAttackAction |
  EquipmentActions.SetCombatTechniqueAction |
  EquipmentActions.SetDamageDiceNumberAction |
  EquipmentActions.SetDamageDiceSidesAction |
  EquipmentActions.SetDamageFlatAction |
  EquipmentActions.SetDamageThresholdAction |
  EquipmentActions.SetEncumbranceAction |
  EquipmentActions.SetFirstDamageThresholdAction |
  EquipmentActions.SetGroupAction |
  EquipmentActions.SetImprovisedWeaponGroupAction |
  EquipmentActions.SetInitiativeModifierAction |
  EquipmentActions.SetItemsSortOrderAction |
  EquipmentActions.SetLengthAction |
  EquipmentActions.SetLossAction |
  EquipmentActions.SetMovementModifierAction |
  EquipmentActions.SetNameAction |
  EquipmentActions.SetParryAction |
  EquipmentActions.SetPriceAction |
  EquipmentActions.SetPrimaryAttributeAction |
  EquipmentActions.SetProtectionAction |
  EquipmentActions.SetRangeAction |
  EquipmentActions.SetReachAction |
  EquipmentActions.SetReloadTimeAction |
  EquipmentActions.SetSecondDamageThresholdAction |
  EquipmentActions.SetStabilityModifierAction |
  EquipmentActions.SetStructurePointsAction |
  EquipmentActions.SetTemplateAction |
  EquipmentActions.SetWeightAction |
  EquipmentActions.SetWhereAction |
  EquipmentActions.SwitchHasAdditionalPenaltiesAction |
  EquipmentActions.SwitchIsDamageThresholdSeparatedAction |
  EquipmentActions.SwitchIsForArmorZonesOnlyAction |
  EquipmentActions.SwitchIsImprovisedWeaponAction |
  EquipmentActions.SwitchIsParryingWeaponAction |
  EquipmentActions.SwitchIsTwoHandedWeaponAction |
  EquipmentActions.ApplyItemTemplateAction |
  EquipmentActions.LockItemTemplateAction |
  EquipmentActions.UnlockItemTemplateAction |
  EquipmentActions.CloseItemEditorAction |
  EquipmentActions.SetArmorZonesHeadAction |
  EquipmentActions.SetArmorZonesHeadLossAction |
  EquipmentActions.SetArmorZonesLeftArmAction |
  EquipmentActions.SetArmorZonesLeftArmLossAction |
  EquipmentActions.SetArmorZonesLeftLegAction |
  EquipmentActions.SetArmorZonesLeftLegLossAction |
  EquipmentActions.SetArmorZonesNameAction |
  EquipmentActions.SetArmorZonesRightArmAction |
  EquipmentActions.SetArmorZonesRightArmLossAction |
  EquipmentActions.SetArmorZonesRightLegAction |
  EquipmentActions.SetArmorZonesRightLegLossAction |
  EquipmentActions.SetArmorZonesTorsoAction |
  EquipmentActions.SetArmorZonesTorsoLossAction |
  EquipmentActions.CloseArmorZonesEditorAction |
  EquipmentActions.SaveArmorZonesAction |
  EquipmentActions.EditArmorZonesAction |
  EquipmentActions.CreateArmorZonesAction;

function purseReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_DUCATES:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'purse'> (
          purse => purse.insert ('d') (action.payload.value)
        ) ('purse')
      ) ('belongings');

    case ActionTypes.SET_SILVERTHALERS:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'purse'> (
          purse => purse.insert ('s') (action.payload.value)
        ) ('purse')
      ) ('belongings');

    case ActionTypes.SET_HELLERS:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'purse'> (
          purse => purse.insert ('h') (action.payload.value)
        ) ('purse')
      ) ('belongings');

    case ActionTypes.SET_KREUTZERS:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'purse'> (
          purse => purse.insert ('k') (action.payload.value)
        ) ('purse')
      ) ('belongings');

    default:
      return state;
  }
}

function equipmentManagingReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_ITEM: {
      const { newId } = action.payload;

      return Maybe.fromMaybe (state) (
        state.get ('belongings').lookup ('itemInEditor')
          .fmap (
            itemInEditor => state.modify<'belongings'> (
              belongings => belongings
                .modify<'items'> (
                  items => items.insert (newId) (convertToSave (newId) (itemInEditor))
                ) ('items')
                .delete ('itemInEditor') as Record<Data.Belongings>
            ) ('belongings')
          )
      );
    }

    case ActionTypes.ADD_ITEM_TEMPLATE: {
      const { template, newId } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'items'> (
          items => items.insert (newId) (
            template.insert ('id') (newId) as Record<Data.ItemInstance>
          )
        ) ('items')
      ) ('belongings');
    }

    case ActionTypes.CREATE_ITEM: {
      return state.modify<'belongings'> (
        belongings => belongings
          .insert ('itemInEditor') (
            Record.of<Data.ItemEditorInstance> ({
              movMod: '',
              iniMod: '',
              stabilityMod: '',
              amount: '',
              at: '',
              damageBonus: Record.of<Data.EditPrimaryAttributeDamageThreshold> ({
                threshold: '',
              }),
              damageDiceNumber: '',
              damageFlat: '',
              enc: '',
              gr: 1,
              isParryingWeapon: false,
              isTemplateLocked: false,
              isTwoHandedWeapon: false,
              length: '',
              name: '',
              pa: '',
              price: '',
              pro: '',
              range: List.of ('', '', ''),
              reloadTime: '',
              stp: '',
              weight: '',
              where: '',
            })
          )
          .insert ('isInItemCreation') (true)
      ) ('belongings');
    }

    case ActionTypes.SAVE_ITEM: {
      return Maybe.fromMaybe (state) (
        state.get ('belongings').lookup ('itemInEditor')
          .bind (Maybe.ensure (itemInEditor => itemInEditor .member ('id')))
          .fmap (
            itemInEditor => state.modify<'belongings'> (
              belongings => belongings
                .modify<'items'> (
                  items => {
                    const id =
                      (itemInEditor as Record<Data.ItemEditorInstance & { id: string }>)
                        .get ('id');

                    return items.insert
                      (id)
                      (
                        convertToSave (id) (itemInEditor)
                        // TODO: does not handle locked templated anymore
                      );
                  }
                ) ('items')
                .delete ('itemInEditor') as Record<Data.Belongings>
            ) ('belongings')
          )
      );
    }

    case ActionTypes.EDIT_ITEM: {
      return state.modify<'belongings'> (
        belongings => belongings
          .insert ('itemInEditor') (convertToEdit (action.payload.item))
          .insert ('isInItemCreation') (false)
      ) ('belongings');
    }

    case ActionTypes.CLOSE_ITEM_EDITOR: {
      return state.modify<'belongings'> (
        belongings => belongings
          .delete ('itemInEditor')
          .insert ('isInItemCreation') (false) as Record<Data.Belongings>
      ) ('belongings');
    }

    case ActionTypes.REMOVE_ITEM: {
      const { id } = action.payload;

      const ensureNotId = Maybe.ensure<string> (x => x !== id);

      return state.modify<'belongings'> (
        belongings => belongings
          .modify<'items'> (items => items.delete (id)) ('items')
          .modify<'armorZones'> (
            armorZones => armorZones.map (
              obj => obj
                // Remove zone from armor if zone is removed item
                .alter<'head'> (zone => zone.bind (ensureNotId)) ('head')
                .alter<'torso'> (zone => zone.bind (ensureNotId)) ('torso')
                .alter<'leftArm'> (zone => zone.bind (ensureNotId)) ('leftArm')
                .alter<'rightArm'> (zone => zone.bind (ensureNotId)) ('rightArm')
                .alter<'leftLeg'> (zone => zone.bind (ensureNotId)) ('leftLeg')
                .alter<'rightLeg'> (zone => zone.bind (ensureNotId)) ('rightLeg')
            )
          ) ('armorZones')
      ) ('belongings');
    }

    default:
      return state;
  }
}

function itemGeneralReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_ITEM_NAME:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('name') (action.payload.value)
        ) ('itemInEditor')
      ) ('belongings');

    case ActionTypes.SET_ITEM_PRICE:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('price') (action.payload.value)
        ) ('itemInEditor')
      ) ('belongings');

    case ActionTypes.SET_ITEM_WEIGHT:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('weight') (action.payload.value)
        ) ('itemInEditor')
      ) ('belongings');

    case ActionTypes.SET_ITEM_AMOUNT:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('amount') (action.payload.value)
        ) ('itemInEditor')
      ) ('belongings');

    case ActionTypes.SET_ITEM_WHERE:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('where') (action.payload.value)
        ) ('itemInEditor')
      ) ('belongings');

    case ActionTypes.SET_ITEM_GROUP:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('gr') (action.payload.gr)
        ) ('itemInEditor')
      ) ('belongings');

    case ActionTypes.SET_ITEM_TEMPLATE:
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('template') (action.payload.template)
        ) ('itemInEditor')
      ) ('belongings');

    default:
      return state;
  }
}

function itemDetailsReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_ITEM_COMBAT_TECHNIQUE: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => {
            if (id === 'CT_7') {
              return itemInEditor
                .insert ('at') ('')
                .insert ('pa') ('')
                .insert ('damageBonus') (
                  Record.of<Data.EditPrimaryAttributeDamageThreshold> ({ threshold: '' })
                )
                .delete ('reach')
                .insert ('combatTechnique') (id) as Record<Data.ItemEditorInstance>;
            }
            else {
              return itemInEditor.insert ('combatTechnique') (id);
            }
          }
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('damageDiceNumber') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('damageDiceSides') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_DAMAGE_FLAT: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('damageFlat') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE: {
      const { primary } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify<'damageBonus'> (
            damageBonus => damageBonus
              .insertMaybe ('primary') (primary)
              .modify<'threshold'> (
                threshold => threshold instanceof List ? '' : threshold
              ) ('threshold')
          ) ('damageBonus')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_DAMAGE_THRESHOLD: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify<'damageBonus'> (
            damageBonus => damageBonus.insert ('threshold') (value)
          ) ('damageBonus')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD:
    case ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD: {
      const { value } = action.payload;
      const isFirst = action.type === ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD;
      const index = isFirst ? 0 : 1;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify<'damageBonus'> (
            damageBonus => damageBonus.modify<'threshold'> (
              threshold => threshold instanceof List
                ? threshold.insertAt (index, value)
                : threshold
            ) ('threshold')
          ) ('damageBonus')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_ATTACK: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('at') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_PARRY: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('pa') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_REACH: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('reach') (id)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_LENGTH: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('length') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_STRUCTURE_POINTS: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('stp') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_RANGE: {
      const { index, value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify<'range'> (
            list => list.insertAt (index - 1, value)
          ) ('range')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_RELOAD_TIME: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('reloadTime') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_AMMUNITION: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('ammunition') (id)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_STABILITY_MODIFIER: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('stabilityMod') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }
    case ActionTypes.SET_ITEM_LOSS: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insertMaybe ('loss') (id)
        ) ('itemInEditor')
      ) ('belongings');
    }

    default:
      return state;
  }
}

function itemOptionsReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SWITCH_IS_ITEM_DAMAGE_THRESHOLD_SEPARATED: {
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify<'damageBonus'> (
            damageBonus => damageBonus.modify<'threshold'> (
              threshold => threshold instanceof List ? '' : List.of ('', '')
            ) ('threshold')
          ) ('damageBonus')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON: {
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify (x => !x) ('isParryingWeapon')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON: {
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify (x => !x) ('isTwoHandedWeapon')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON: {
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.alter<'improvisedWeaponGroup'> (
            x => x.then (Just (0))
          ) ('improvisedWeaponGroup')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP: {
      const { gr } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('improvisedWeaponGroup') (gr)
        ) ('itemInEditor')
      ) ('belongings');
    }

    default:
      return state;
  }
}

function armorReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_ITEM_PROTECTION: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('pro') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_ENCUMBRANCE: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('enc') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_MOVEMENT_MODIFIER: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('movMod') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_INITIATIVE_MODIFIER: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('iniMod') (value)
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY: {
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify (x => !x) ('forArmorZoneOnly')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES: {
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.modify (x => !x) ('addPenalties')
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ITEM_ARMOR_TYPE: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('armorType') (id)
        ) ('itemInEditor')
      ) ('belongings');
    }

    default:
      return state;
  }
}

function itemTemplateReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.APPLY_ITEM_TEMPLATE:
    case ActionTypes.LOCK_ITEM_TEMPLATE: {
      const { template } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => {
            const { id, where, loss, amount } = itemInEditor.toObject ();

            return convertToEdit (template as Record<Data.ItemInstance>).merge (Record.of ({
              id,
              where,
              loss,
              amount,
              isTemplateLocked: action.type === ActionTypes.LOCK_ITEM_TEMPLATE,
            })) as Record<Data.ItemEditorInstance>
          }
        ) ('itemInEditor')
      ) ('belongings');
    }

    case ActionTypes.UNLOCK_ITEM_TEMPLATE: {
      return state.modify<'belongings'> (
        belongings => belongings.modify<'itemInEditor'> (
          itemInEditor => itemInEditor.insert ('isTemplateLocked') (false)
        ) ('itemInEditor')
      ) ('belongings');
    }

    default:
      return state;
  }
}

function armorZonesReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_ARMOR_ZONES: {
      const { newId } = action.payload;

      return Maybe.fromMaybe (state) (
        state.get ('belongings').lookup ('zoneArmorInEditor')
          .fmap (
            zoneArmorInEditor => state.modify<'belongings'> (
              belongings => belongings
                .modify<'armorZones'> (
                  armorZones => armorZones.insert (newId) (
                    zoneArmorInEditor.insert ('id') (newId) as Record<Data.ArmorZonesInstance>
                  )
                ) ('armorZones')
                .delete ('zoneArmorInEditor') as Record<Data.Belongings>
            ) ('belongings')
          )
      );
    }

    case ActionTypes.REMOVE_ARMOR_ZONES: {
      return state.modify<'belongings'> (
        belongings => belongings
          .modify<'armorZones'> (armorZones => armorZones.delete (action.payload.id)) ('armorZones')
      ) ('belongings');
    }

    case ActionTypes.CREATE_ARMOR_ZONES: {
      return state.modify<'belongings'> (
        belongings => belongings
          .insert ('zoneArmorInEditor') (Record.of<Data.ArmorZonesEditorInstance> ({
            name: '',
          }))
          .insert ('isInZoneArmorCreation') (true)
      ) ('belongings');
    }

    case ActionTypes.SAVE_ARMOR_ZONES: {
      return Maybe.fromMaybe (state) (
        state.get ('belongings').lookup ('zoneArmorInEditor')
          .bind (Maybe.ensure (
            zoneArmorInEditor => Maybe.isJust (
              zoneArmorInEditor.lookup ('id').bind (
                Maybe.ensure (id => id.length > 0)
              )
            )
          ))
          .fmap (
            zoneArmorInEditor => state.modify<'belongings'> (
              belongings => belongings
                .modify<'armorZones'> (
                  armorZones => armorZones.insert (
                    (zoneArmorInEditor as Record<Data.ArmorZonesInstance>).get ('id')
                  ) (zoneArmorInEditor as Record<Data.ArmorZonesInstance>)
                ) ('armorZones')
                .delete ('zoneArmorInEditor') as Record<Data.Belongings>
            ) ('belongings')
          )
      );
    }

    case ActionTypes.EDIT_ARMOR_ZONES: {
      return Maybe.fromMaybe (state) (
        state.get ('belongings').get ('armorZones').lookup (action.payload.id)
          .fmap (
            zoneArmor => state.modify<'belongings'> (
              belongings => belongings
                .insert ('zoneArmorInEditor') (zoneArmor as Record<Data.ArmorZonesEditorInstance>)
                .insert ('isInZoneArmorCreation') (false)
            ) ('belongings')
          )
      );
    }

    case ActionTypes.CLOSE_ARMOR_ZONES_EDITOR: {
      return state.modify<'belongings'> (
        belongings => belongings.delete ('zoneArmorInEditor') as Record<Data.Belongings>
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_NAME: {
      const { value } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insert ('name') (value)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_HEAD: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('head') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('headLoss') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('leftArm') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('leftArmLoss') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('leftLeg') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('leftLegLoss') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_TORSO: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('torso') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('torsoLoss') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('rightArm') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('rightArmLoss') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('rightLeg') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    case ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS: {
      const { id } = action.payload;

      return state.modify<'belongings'> (
        belongings => belongings.modify<'zoneArmorInEditor'> (
          zoneArmorInEditor => zoneArmorInEditor.insertMaybe ('rightLegLoss') (id)
        ) ('zoneArmorInEditor')
      ) ('belongings');
    }

    default:
      return state;
  }
}

export function equipmentReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_DUCATES:
    case ActionTypes.SET_SILVERTHALERS:
    case ActionTypes.SET_HELLERS:
    case ActionTypes.SET_KREUTZERS:
      return purseReducer (state, action);

    case ActionTypes.ADD_ITEM:
    case ActionTypes.ADD_ITEM_TEMPLATE:
    case ActionTypes.CREATE_ITEM:
    case ActionTypes.SAVE_ITEM:
    case ActionTypes.EDIT_ITEM:
    case ActionTypes.CLOSE_ITEM_EDITOR:
    case ActionTypes.REMOVE_ITEM:
      return equipmentManagingReducer (state, action);

    case ActionTypes.SET_ITEM_NAME:
    case ActionTypes.SET_ITEM_PRICE:
    case ActionTypes.SET_ITEM_WEIGHT:
    case ActionTypes.SET_ITEM_AMOUNT:
    case ActionTypes.SET_ITEM_WHERE:
    case ActionTypes.SET_ITEM_GROUP:
    case ActionTypes.SET_ITEM_TEMPLATE:
      return itemGeneralReducer (state, action);

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
      return itemDetailsReducer (state, action);

    case ActionTypes.SWITCH_IS_ITEM_DAMAGE_THRESHOLD_SEPARATED:
    case ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON:
    case ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON:
    case ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON:
    case ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP:
      return itemOptionsReducer (state, action);

    case ActionTypes.SET_ITEM_PROTECTION:
    case ActionTypes.SET_ITEM_ENCUMBRANCE:
    case ActionTypes.SET_ITEM_MOVEMENT_MODIFIER:
    case ActionTypes.SET_ITEM_INITIATIVE_MODIFIER:
    case ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY:
    case ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES:
    case ActionTypes.SET_ITEM_ARMOR_TYPE:
      return armorReducer (state, action);

    case ActionTypes.APPLY_ITEM_TEMPLATE:
    case ActionTypes.LOCK_ITEM_TEMPLATE:
    case ActionTypes.UNLOCK_ITEM_TEMPLATE:
      return itemTemplateReducer (state, action);

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
      return armorZonesReducer (state, action);

    default:
      return state;
  }
}
