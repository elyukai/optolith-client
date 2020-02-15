import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { Dropdown } from "../Universal/Dropdown"

export type HitZoneNames = "hitzonearmors.dialogs.addedit.head"
                         | "hitzonearmors.dialogs.addedit.torso"
                         | "hitzonearmors.dialogs.addedit.leftarm"
                         | "hitzonearmors.dialogs.addedit.rightarm"
                         | "hitzonearmors.dialogs.addedit.leftleg"
                         | "hitzonearmors.dialogs.addedit.rightleg"

export interface ArmorZonesEditorProps {
  armorList: List<Record<DropdownOption<string>>>
  component: Maybe<string>
  componentLoss: Maybe<number>
  staticData: StaticDataRecord
  lossLevels: List<Record<DropdownOption<number>>>
  name: HitZoneNames
  setComponent (value: Maybe<string>): void
  setComponentLoss (id: Maybe<number>): void
}

export const HitZoneArmorEditorRow: React.FC<ArmorZonesEditorProps> = props => {
  const {
    armorList,
    component,
    componentLoss,
    staticData,
    lossLevels,
    name,
    setComponent,
    setComponentLoss,
  } = props

  return (
    <div className="row">
      <Dropdown
        className="armor"
        label={translate (staticData) (name)}
        value={component}
        options={armorList}
        onChange={setComponent}
        />
      <Dropdown
        className="loss"
        label={translate (staticData) ("hitzonearmors.dialogs.addedit.wear")}
        value={componentLoss}
        options={lossLevels}
        onChange={setComponentLoss}
        />
    </div>
  )
}
