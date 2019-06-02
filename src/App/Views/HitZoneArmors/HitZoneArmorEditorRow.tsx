import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";

export type HitZoneNames =
  "head"
  | "torso"
  | "leftarm"
  | "rightarm"
  | "leftleg"
  | "rightleg"

export interface ArmorZonesEditorProps {
  armorList: List<Record<DropdownOption>>
  component: Maybe<string>
  componentLoss: Maybe<number>
  l10n: L10nRecord
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
    l10n,
    lossLevels,
    name,
    setComponent,
    setComponentLoss,
  } = props

  return (
    <div className="row">
      <Dropdown
        className="armor"
        label={translate (l10n) (name)}
        value={component}
        options={armorList}
        onChange={setComponent}
        />
      <Dropdown
        className="loss"
        label={translate (l10n) ("wear")}
        value={componentLoss}
        options={lossLevels}
        onChange={setComponentLoss}
        />
    </div>
  )
}
