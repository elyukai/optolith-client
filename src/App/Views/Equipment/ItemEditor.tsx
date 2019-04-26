import * as React from "react";
import { List } from "../../../Data/List";
import { fromJust, isJust, Maybe, or } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { EditItem } from "../../Models/Hero/EditItem";
import { Attribute } from "../../Models/Wiki/Attribute";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { ItemEditorInputValidation, validateItemEditorInput } from "../../Utilities/itemEditorInputValidationUtils";
import { Dialog } from "../Universal/DialogNew";
import { ItemEditorArmorSection } from "./ItemEditorArmorSection";
import { ItemEditorCommonSection } from "./ItemEditorCommonSection";
import { ItemEditorMeleeSection } from "./ItemEditorMeleeSection";
import { ItemEditorRangedSection } from "./ItemEditorRangedSection";

export interface ItemEditorOwnProps {
  l10n: L10nRecord
}

export interface ItemEditorStateProps {
  attributes: OrderedMap<string, Record<Attribute>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  isInCreation: Maybe<boolean>
  item: Maybe<Record<EditItem>>
  templates: List<Record<ItemTemplate>>
}

export interface ItemEditorDispatchProps {
  closeEditor (): void
  addToList (): void
  saveItem (): void
  setName (value: string): void
  setPrice (value: string): void
  setWeight (value: string): void
  setAmount (value: string): void
  setWhere (value: string): void
  setGroup (gr: number): void
  setTemplate (template: string): void
  setCombatTechnique (id: string): void
  setDamageDiceNumber (value: string): void
  setDamageDiceSides (value: number): void
  setDamageFlat (value: string): void
  setPrimaryAttribute (primary: Maybe<string>): void
  setDamageThreshold (value: string): void
  setFirstDamageThreshold (value: string): void
  setSecondDamageThreshold (value: string): void
  switchIsDamageThresholdSeparated (): void
  setAttack (value: string): void
  setParry (value: string): void
  setReach (id: number): void
  setLength (value: string): void
  setStructurePoints (value: string): void
  setRange (index: 1 | 2 | 3): (value: string) => void
  setReloadTime (value: string): void
  setAmmunition (id: string): void
  setProtection (value: string): void
  setEncumbrance (value: string): void
  setMovementModifier (value: string): void
  setInitiativeModifier (value: string): void
  setStabilityModifier (value: string): void
  switchIsParryingWeapon (): void
  switchIsTwoHandedWeapon (): void
  switchIsImprovisedWeapon (): void
  setImprovisedWeaponGroup (gr: number): void
  setLoss (id: Maybe<number>): void
  switchIsForArmorZonesOnly (): void
  setHasAdditionalPenalties (): void
  setArmorType (id: number): void
  applyTemplate (): void
  lockTemplate (): void
  unlockTemplate (): void
}

export type ItemEditorProps = ItemEditorStateProps & ItemEditorDispatchProps & ItemEditorOwnProps

const EIA = EditItem.A
const IEIVA = ItemEditorInputValidation.A

export function ItemEditor (props: ItemEditorProps) {
  const {
    closeEditor,
    isInCreation,
    item: mitem,
    l10n,
  } = props

  if (isJust (mitem)) {
    const item = fromJust (mitem)

    const inputValidation = validateItemEditorInput (item)

    const gr = EIA.gr (item)
    const locked = EIA.isTemplateLocked (item)

    return (
      <Dialog
        id="item-editor"
        title={or (isInCreation) ? translate (l10n) ("createitem") : translate (l10n) ("edititem")}
        close={closeEditor}
        isOpened
        buttons={[
          {
            autoWidth: true,
            disabled: !IEIVA.amount (inputValidation)
              || !locked && (
                typeof gr !== "number"
                || gr === 1 && !IEIVA.melee (inputValidation)
                || gr === 2 && !IEIVA.ranged (inputValidation)
                || gr === 4 && !IEIVA.armor (inputValidation)
                || !IEIVA.other (inputValidation)
              ),
            label: translate (l10n) ("save"),
            onClick: or (isInCreation) ? props.addToList : props.saveItem,
          },
        ]}>
        <ItemEditorCommonSection {...props} item={item} inputValidation={inputValidation} />
        <ItemEditorMeleeSection {...props} item={item} inputValidation={inputValidation} />
        <ItemEditorRangedSection {...props} item={item} inputValidation={inputValidation} />
        <ItemEditorArmorSection {...props} item={item} inputValidation={inputValidation} />
      </Dialog>
    )
  }

  return null
}
