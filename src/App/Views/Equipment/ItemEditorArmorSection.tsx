import * as React from "react";
import { translate } from "../../Utilities/I18n";
import { getLossLevelElements, ItemEditorInputValidation } from "../../Utilities/ItemUtils";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Hr } from "../Universal/Hr";
import { TextField } from "../Universal/TextField";

export interface ItemEditorArmorSectionProps {
  item: Record<ItemEditorInstance>
  locale: UIMessagesObject
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

export function ItemEditorArmorSection (props: ItemEditorArmorSectionProps) {
  const { inputValidation, item, locale } = props

  const gr = item .get ("gr")
  const locked = item .get ("isTemplateLocked")

  const armorTypes =
    sortObjects (
      translate (locale, "equipment.view.armortypes")
        .imap (index => e => Record.of<DropdownOption> ({ id: index + 1, name: e })),
      locale .get ("id")
    )

  return gr === 4
    ? (
      <>
        <Hr className="vertical" />
        <div className="armor">
          <div className="row">
            <div className="container">
              <TextField
                className="pro"
                label={translate (locale, "itemeditor.options.pro")}
                value={item .get ("pro")}
                onChangeString={props.setProtection}
                disabled={locked}
                valid={inputValidation .get ("pro")}
                />
              <TextField
                className="enc"
                label={translate (locale, "itemeditor.options.enc")}
                value={item .get ("enc")}
                onChangeString={props.setEncumbrance}
                disabled={locked}
                valid={inputValidation .get ("enc")}
                />
            </div>
            <Dropdown
              className="armor-type"
              label={translate (locale, "itemeditor.options.armortype")}
              hint={translate (locale, "options.none")}
              value={item .lookup ("armorType")}
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
                label={translate (locale, "itemeditor.options.stabilitymod")}
                value={item .get ("stabilityMod")}
                onChangeString={props.setStabilityModifier}
                disabled={locked}
                valid={inputValidation .get ("stabilityMod")}
                />
              <Dropdown
                className="weapon-loss"
                label={translate (locale, "itemeditor.options.armorloss")}
                value={item .lookup ("stabilityMod")}
                options={getLossLevelElements ()}
                onChange={props.setLoss}
                />
            </div>
            <Checkbox
              className="only-zones"
              label={translate (locale, "itemeditor.options.zonesonly")}
              checked={item .lookup ("forArmorZoneOnly")}
              onClick={props.switchIsForArmorZonesOnly}
              disabled={locked}
              />
          </div>
          <div className="row">
            <div className="container">
              <TextField
                className="mov"
                label={translate (locale, "itemeditor.options.movmod")}
                value={item .get ("movMod")}
                onChangeString={props.setMovementModifier}
                disabled={locked}
                valid={inputValidation .get ("mov")}
                />
              <TextField
                className="ini"
                label={translate (locale, "itemeditor.options.inimod")}
                value={item .get ("iniMod")}
                onChangeString={props.setInitiativeModifier}
                disabled={locked}
                valid={inputValidation .get ("ini")}
                />
            </div>
            <Checkbox
              className="add-penalties"
              label={translate (locale, "itemeditor.options.additionalpenalties")}
              checked={item .lookup ("addPenalties")}
              onClick={props.setHasAdditionalPenalties}
              disabled={locked}
              />
          </div>
        </div>
    </>
  )
  : null
}
