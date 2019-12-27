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
import { Dialog } from "../Universal/Dialog";
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

export const ItemEditor: React.FC<ItemEditorProps> = props => {
  const {
    l10n,
    attributes,
    combatTechniques,
    isInCreation,
    item: mitem,
    templates,
    closeEditor,
    addToList,
    saveItem,
    setName,
    setPrice,
    setWeight,
    setAmount,
    setWhere,
    setGroup,
    setTemplate,
    setCombatTechnique,
    setDamageDiceNumber,
    setDamageDiceSides,
    setDamageFlat,
    setPrimaryAttribute,
    setDamageThreshold,
    setFirstDamageThreshold,
    setSecondDamageThreshold,
    switchIsDamageThresholdSeparated,
    setAttack,
    setParry,
    setReach,
    setLength,
    setStructurePoints,
    setRange,
    setReloadTime,
    setAmmunition,
    setProtection,
    setEncumbrance,
    setMovementModifier,
    setInitiativeModifier,
    setStabilityModifier,
    switchIsParryingWeapon,
    switchIsTwoHandedWeapon,
    switchIsImprovisedWeapon,
    setImprovisedWeaponGroup,
    setLoss,
    switchIsForArmorZonesOnly,
    setHasAdditionalPenalties,
    setArmorType,
    applyTemplate,
    lockTemplate,
    unlockTemplate,
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
        isOpen
        buttons={[
          {
            autoWidth: true,
            disabled:
              !IEIVA.amount (inputValidation)
              || (
                !locked
                && (
                  typeof gr !== "number"
                  || (gr === 1 && !IEIVA.melee (inputValidation))
                  || (gr === 2 && !IEIVA.ranged (inputValidation))
                  || (gr === 4 && !IEIVA.armor (inputValidation))
                  || !IEIVA.other (inputValidation)
                )
              ),
            label: translate (l10n) ("save"),
            onClick: or (isInCreation) ? addToList : saveItem,
          },
        ]}
        >
        <ItemEditorCommonSection
          item={item}
          inputValidation={inputValidation}
          isInCreation={isInCreation}
          l10n={l10n}
          templates={templates}
          setName={setName}
          setPrice={setPrice}
          setWeight={setWeight}
          setAmount={setAmount}
          setWhere={setWhere}
          setGroup={setGroup}
          setTemplate={setTemplate}
          switchIsImprovisedWeapon={switchIsImprovisedWeapon}
          setImprovisedWeaponGroup={setImprovisedWeaponGroup}
          applyTemplate={applyTemplate}
          lockTemplate={lockTemplate}
          unlockTemplate={unlockTemplate}
          />
        <ItemEditorMeleeSection
          item={item}
          inputValidation={inputValidation}
          attributes={attributes}
          combatTechniques={combatTechniques}
          l10n={l10n}
          setCombatTechnique={setCombatTechnique}
          setDamageDiceNumber={setDamageDiceNumber}
          setDamageDiceSides={setDamageDiceSides}
          setDamageFlat={setDamageFlat}
          setPrimaryAttribute={setPrimaryAttribute}
          setDamageThreshold={setDamageThreshold}
          setFirstDamageThreshold={setFirstDamageThreshold}
          setSecondDamageThreshold={setSecondDamageThreshold}
          switchIsDamageThresholdSeparated={switchIsDamageThresholdSeparated}
          setAttack={setAttack}
          setParry={setParry}
          setReach={setReach}
          setLength={setLength}
          setStructurePoints={setStructurePoints}
          setStabilityModifier={setStabilityModifier}
          switchIsParryingWeapon={switchIsParryingWeapon}
          switchIsTwoHandedWeapon={switchIsTwoHandedWeapon}
          setLoss={setLoss}
          />
        <ItemEditorRangedSection
          item={item}
          inputValidation={inputValidation}
          combatTechniques={combatTechniques}
          l10n={l10n}
          templates={templates}
          setCombatTechnique={setCombatTechnique}
          setDamageDiceNumber={setDamageDiceNumber}
          setDamageDiceSides={setDamageDiceSides}
          setDamageFlat={setDamageFlat}
          setLength={setLength}
          setRange={setRange}
          setReloadTime={setReloadTime}
          setAmmunition={setAmmunition}
          setStabilityModifier={setStabilityModifier}
          setLoss={setLoss}
          />
        <ItemEditorArmorSection
          item={item}
          inputValidation={inputValidation}
          l10n={l10n}
          setProtection={setProtection}
          setEncumbrance={setEncumbrance}
          setMovementModifier={setMovementModifier}
          setInitiativeModifier={setInitiativeModifier}
          setStabilityModifier={setStabilityModifier}
          setLoss={setLoss}
          switchIsForArmorZonesOnly={switchIsForArmorZonesOnly}
          setHasAdditionalPenalties={setHasAdditionalPenalties}
          setArmorType={setArmorType}
          />
      </Dialog>
    )
  }

  return null
}
