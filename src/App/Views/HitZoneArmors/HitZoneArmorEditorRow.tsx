import * as React from "react";
import { translate } from "../../Utilities/I18n";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";

export type HitZoneNames =
  "zonearmoreditor.options.head"
  | "zonearmoreditor.options.torso"
  | "zonearmoreditor.options.leftarm"
  | "zonearmoreditor.options.rightarm"
  | "zonearmoreditor.options.leftleg"
  | "zonearmoreditor.options.rightleg"

export interface ArmorZonesEditorProps {
  armorList: List<Record<DropdownOption>>
  component: Maybe<string>
  componentLoss: Maybe<number>
  locale: UIMessagesObject
  lossLevels: List<Record<DropdownOption>>
  name: HitZoneNames
  setComponent (value: Maybe<string>): void
  setComponentLoss (id: Maybe<number>): void
}

export function HitZoneArmorEditorRow (props: ArmorZonesEditorProps) {
  const {
    armorList,
    component,
    componentLoss,
    locale,
    lossLevels,
    name,
    setComponent,
    setComponentLoss,
  } = props

  return (
    <div className="row">
      <Dropdown
        className="armor"
        label={translate (locale, name)}
        value={component}
        options={armorList}
        onChange={setComponent}
        />
      <Dropdown
        className="loss"
        label={translate (locale, "zonearmoreditor.options.loss")}
        value={componentLoss}
        options={lossLevels}
        onChange={setComponentLoss}
        />
    </div>
  )
}
