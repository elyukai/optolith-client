import * as React from "react";
import { imap } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { EditItem } from "../../Models/Hero/EditItem";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { ItemEditorInputValidation } from "../../Utilities/itemEditorInputValidationUtils";
import { getLossLevelElements } from "../../Utilities/ItemUtils";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Hr } from "../Universal/Hr";
import { TextField } from "../Universal/TextField";

export interface ItemEditorArmorSectionProps {
  item: Record<EditItem>
  l10n: L10nRecord
  inputValidation: Record<ItemEditorInputValidation>
  setProtection (value: string): void
  setEncumbrance (value: string): void
  setMovementModifier (value: string): void
  setInitiativeModifier (value: string): void
  setStabilityModifier (value: string): void
  setLoss (id: Maybe<number>): void
  switchIsForArmorZonesOnly (): void
  setHasAdditionalPenalties (): void
  setArmorType (id: number): void
}

const EIA = EditItem.A
const IEIVA = ItemEditorInputValidation.A

export function ItemEditorArmorSection (props: ItemEditorArmorSectionProps) {
  const { inputValidation, item, l10n } = props

  const gr = EIA.gr (item)
  const locked = EIA.isTemplateLocked (item)

  const armorTypes =
    sortRecordsByName (L10n.A.id (l10n))
                      (imap (index => (e: string) => DropdownOption ({
                                                                       id: Just (index + 1),
                                                                       name: e,
                                                                    }))
                            (translate (l10n) ("armortypes")))

  return gr === 4
    ? (
      <>
        <Hr className="vertical" />
        <div className="armor">
          <div className="row">
            <div className="container">
              <TextField
                className="pro"
                label={translate (l10n) ("protection.short")}
                value={EIA.pro (item)}
                onChange={props.setProtection}
                disabled={locked}
                valid={IEIVA.pro (inputValidation)}
                />
              <TextField
                className="enc"
                label={translate (l10n) ("encumbrance.short")}
                value={EIA.enc (item)}
                onChange={props.setEncumbrance}
                disabled={locked}
                valid={IEIVA.enc (inputValidation)}
                />
            </div>
            <Dropdown
              className="armor-type"
              label={translate (l10n) ("armortype")}
              hint={translate (l10n) ("none")}
              value={EIA.armorType (item)}
              options={armorTypes}
              onChangeJust={props.setArmorType}
              disabled={locked}
              required
              />
          </div>
          <div className="row">
            <div className="container armor-loss-container">
              <TextField
                className="stabilitymod"
                label={translate (l10n) ("sturdinessmodifier.short")}
                value={EIA.stabilityMod (item)}
                onChange={props.setStabilityModifier}
                disabled={locked}
                valid={IEIVA.stabilityMod (inputValidation)}
                />
              <Dropdown
                className="weapon-loss"
                label={translate (l10n) ("wear")}
                value={EIA.loss (item)}
                options={getLossLevelElements ()}
                onChange={props.setLoss}
                />
            </div>
            <Checkbox
              className="only-zones"
              label={translate (l10n) ("hitzonearmoronly")}
              checked={EIA.forArmorZoneOnly (item)}
              onClick={props.switchIsForArmorZonesOnly}
              disabled={locked}
              />
          </div>
          <div className="row">
            <div className="container">
              <TextField
                className="mov"
                label={translate (l10n) ("movementmodifier.short")}
                value={EIA.movMod (item)}
                onChange={props.setMovementModifier}
                disabled={locked}
                valid={IEIVA.mov (inputValidation)}
                />
              <TextField
                className="ini"
                label={translate (l10n) ("initiativemodifier.short")}
                value={EIA.iniMod (item)}
                onChange={props.setInitiativeModifier}
                disabled={locked}
                valid={IEIVA.ini (inputValidation)}
                />
            </div>
            <Checkbox
              className="add-penalties"
              label={translate (l10n) ("additionalpenalties")}
              checked={EIA.addPenalties (item)}
              onClick={props.setHasAdditionalPenalties}
              disabled={locked}
              />
          </div>
        </div>
    </>
  )
  : null
}
