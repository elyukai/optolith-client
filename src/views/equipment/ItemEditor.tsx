import * as React from 'react';
import { Dialog } from '../../components/DialogNew';
import { ItemEditorInstance } from '../../types/data';
import { Attribute, CombatTechnique, ItemTemplate } from '../../types/wiki';
import { List, Maybe, OrderedMap, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { validateItemEditorInput } from '../../utils/ItemUtils';
import { ItemEditorArmorSection } from './ItemEditorArmorSection';
import { ItemEditorCommonSection } from './ItemEditorCommonSection';
import { ItemEditorMeleeSection } from './ItemEditorMeleeSection';
import { ItemEditorRangedSection } from './ItemEditorRangedSection';

export interface ItemEditorOwnProps {
  locale: UIMessagesObject;
}

export interface ItemEditorStateProps {
  attributes: OrderedMap<string, Record<Attribute>>;
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>;
  isInCreation: Maybe<boolean>;
  item: Maybe<Record<ItemEditorInstance>>;
  templates: List<Record<ItemTemplate>>;
}

export interface ItemEditorDispatchProps {
  closeEditor (): void;
  addToList (): void;
  saveItem (): void;
  setName (value: string): void;
  setPrice (value: string): void;
  setWeight (value: string): void;
  setAmount (value: string): void;
  setWhere (value: string): void;
  setGroup (gr: number): void;
  setTemplate (template: string): void;
  setCombatTechnique (id: string): void;
  setDamageDiceNumber (value: string): void;
  setDamageDiceSides (value: number): void;
  setDamageFlat (value: string): void;
  setPrimaryAttribute (primary: Maybe<string>): void;
  setDamageThreshold (value: string): void;
  setFirstDamageThreshold (value: string): void;
  setSecondDamageThreshold (value: string): void;
  switchIsDamageThresholdSeparated (): void;
  setAttack (value: string): void;
  setParry (value: string): void;
  setReach (id: number): void;
  setLength (value: string): void;
  setStructurePoints (value: string): void;
  setRange (index: 1 | 2 | 3): (value: string) => void;
  setReloadTime (value: string): void;
  setAmmunition (id: string): void;
  setProtection (value: string): void;
  setEncumbrance (value: string): void;
  setMovementModifier (value: string): void;
  setInitiativeModifier (value: string): void;
  setStabilityModifier (value: string): void;
  switchIsParryingWeapon (): void;
  switchIsTwoHandedWeapon (): void;
  switchIsImprovisedWeapon (): void;
  setImprovisedWeaponGroup (gr: number): void;
  setLoss (id: Maybe<number>): void;
  switchIsForArmorZonesOnly (): void;
  setHasAdditionalPenalties (): void;
  setArmorType (id: number): void;
  applyTemplate (): void;
  lockTemplate (): void;
  unlockTemplate (): void;
}

export type ItemEditorProps = ItemEditorStateProps & ItemEditorDispatchProps & ItemEditorOwnProps;

export function ItemEditor (props: ItemEditorProps) {
  const {
    closeEditor,
    isInCreation,
    item: maybeItem,
    locale,
  } = props;

  if (Maybe.isJust (maybeItem)) {
    const item = Maybe.fromJust (maybeItem);

    const inputValidation = validateItemEditorInput (item);

    const gr = item .get ('gr');
    const locked = item .get ('isTemplateLocked');

    return (
      <Dialog
        id="item-editor"
        title={
          isInCreation
            ? translate (locale, 'itemeditor.titlecreate')
            : translate (locale, 'itemeditor.titleedit')
        }
        close={closeEditor}
        isOpened
        buttons={[
          {
            autoWidth: true,
            disabled: !inputValidation .get ('amount')
              || !locked && (
                typeof gr !== 'number'
                || gr === 1 && !inputValidation .get ('melee')
                || gr === 2 && !inputValidation .get ('ranged')
                || gr === 4 && !inputValidation .get ('armor')
                || !inputValidation .get ('other')
              ),
            label: translate (locale, 'actions.save'),
            onClick: isInCreation ? props.addToList : props.saveItem,
          },
        ]}>
        <ItemEditorCommonSection {...props} item={item} inputValidation={inputValidation} />
        <ItemEditorMeleeSection {...props} item={item} inputValidation={inputValidation} />
        <ItemEditorRangedSection {...props} item={item} inputValidation={inputValidation} />
        <ItemEditorArmorSection {...props} item={item} inputValidation={inputValidation} />
      </Dialog>
    );
  }

  return null;
}
