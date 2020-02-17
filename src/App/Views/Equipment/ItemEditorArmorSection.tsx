import * as React from "react"
import { map } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { elems } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { EditItem } from "../../Models/Hero/EditItem"
import { NumIdName } from "../../Models/NumIdName"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { ItemEditorInputValidation } from "../../Utilities/itemEditorInputValidationUtils"
import { getLossLevelElements } from "../../Utilities/ItemUtils"
import { pipe_ } from "../../Utilities/pipe"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"
import { Hr } from "../Universal/Hr"
import { TextField } from "../Universal/TextField"

export interface ItemEditorArmorSectionProps {
  item: Record<EditItem>
  staticData: StaticDataRecord
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

export const ItemEditorArmorSection: React.FC<ItemEditorArmorSectionProps> = props => {
  const {
    item,
    staticData,
    inputValidation,
    setProtection,
    setEncumbrance,
    setMovementModifier,
    setInitiativeModifier,
    setStabilityModifier,
    setLoss,
    switchIsForArmorZonesOnly,
    setHasAdditionalPenalties,
    setArmorType,
  } = props

  const gr = EIA.gr (item)
  const locked = EIA.isTemplateLocked (item)

  const armorTypes = React.useMemo (
    () => pipe_ (
            staticData,
            StaticData.A.armorTypes,
            elems,
            map (e => DropdownOption ({
                         id: Just (NumIdName.A.id (e)),
                         name: NumIdName.A.name (e),
                      }))
          ),
    [ staticData ]
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
                label={translate (staticData) ("equipment.dialogs.addedit.protection")}
                value={EIA.pro (item)}
                onChange={setProtection}
                disabled={locked}
                valid={IEIVA.pro (inputValidation)}
                />
              <TextField
                className="enc"
                label={translate (staticData) ("equipment.dialogs.addedit.encumbrance")}
                value={EIA.enc (item)}
                onChange={setEncumbrance}
                disabled={locked}
                valid={IEIVA.enc (inputValidation)}
                />
            </div>
            <Dropdown
              className="armor-type"
              label={translate (staticData) ("equipment.dialogs.addedit.armortype")}
              hint={translate (staticData) ("general.none")}
              value={EIA.armorType (item)}
              options={armorTypes}
              onChangeJust={setArmorType}
              disabled={locked}
              required
              />
          </div>
          <div className="row">
            <div className="container armor-loss-container">
              <TextField
                className="stabilitymod"
                label={translate (staticData) ("equipment.dialogs.addedit.sturdinessmodifier")}
                value={EIA.stabilityMod (item)}
                onChange={setStabilityModifier}
                disabled={locked}
                valid={IEIVA.stabilityMod (inputValidation)}
                />
              <Dropdown
                className="weapon-loss"
                label={translate (staticData) ("equipment.dialogs.addedit.wear")}
                value={EIA.loss (item)}
                options={getLossLevelElements ()}
                onChange={setLoss}
                />
            </div>
            <Checkbox
              className="only-zones"
              label={translate (staticData) ("equipment.dialogs.addedit.hitzonearmoronly")}
              checked={EIA.forArmorZoneOnly (item)}
              onClick={switchIsForArmorZonesOnly}
              disabled={locked}
              />
          </div>
          <div className="row">
            <div className="container">
              <TextField
                className="mov"
                label={translate (staticData) ("equipment.dialogs.addedit.movementmodifier")}
                value={EIA.movMod (item)}
                onChange={setMovementModifier}
                disabled={locked}
                valid={IEIVA.mov (inputValidation)}
                />
              <TextField
                className="ini"
                label={translate (staticData) ("equipment.dialogs.addedit.initiativemodifier")}
                value={EIA.iniMod (item)}
                onChange={setInitiativeModifier}
                disabled={locked}
                valid={IEIVA.ini (inputValidation)}
                />
            </div>
            <Checkbox
              className="add-penalties"
              label={translate (staticData) ("equipment.dialogs.addedit.additionalpenalties")}
              checked={EIA.addPenalties (item)}
              onClick={setHasAdditionalPenalties}
              disabled={locked}
              />
          </div>
        </div>
      </>
    )
    : null
}
