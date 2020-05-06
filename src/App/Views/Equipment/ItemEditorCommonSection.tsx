import * as React from "react"
import { consF, filter, List, map } from "../../../Data/List"
import { any, isJust, isNothing, Just, Maybe, maybeToUndefined, or } from "../../../Data/Maybe"
import { lt } from "../../../Data/Num"
import { elems } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { EditItem } from "../../Models/Hero/EditItem"
import { NumIdName } from "../../Models/NumIdName"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { ItemTemplate, itemTemplateToDropdown } from "../../Models/Wiki/ItemTemplate"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { ItemEditorInputValidation } from "../../Utilities/itemEditorInputValidationUtils"
import { pipe_ } from "../../Utilities/pipe"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"
import { Hr } from "../Universal/Hr"
import { IconButton } from "../Universal/IconButton"
import { TextField } from "../Universal/TextField"

export interface ItemEditorCommonSectionProps {
  isInCreation: Maybe<boolean>
  item: Record<EditItem>
  staticData: StaticDataRecord
  templates: List<Record<ItemTemplate>>
  inputValidation: Record<ItemEditorInputValidation>
  setName (value: string): void
  setPrice (value: string): void
  setWeight (value: string): void
  setAmount (value: string): void
  setWhere (value: string): void
  setGroup (gr: number): void
  setTemplate (template: string): void
  switchIsImprovisedWeapon (): void
  setImprovisedWeaponGroup (gr: number): void
  applyTemplate (): void
  lockTemplate (): void
  unlockTemplate (): void
}

const EIA = EditItem.A
const NINA = NumIdName.A
const IEIVA = ItemEditorInputValidation.A

export const ItemEditorCommonSection: React.FC<ItemEditorCommonSectionProps> = props => {
  const {
    isInCreation,
    item,
    staticData,
    templates,
    inputValidation,
    setName,
    setPrice,
    setWeight,
    setAmount,
    setWhere,
    setGroup,
    setTemplate,
    switchIsImprovisedWeapon,
    setImprovisedWeaponGroup,
    applyTemplate,
    lockTemplate,
    unlockTemplate,
  } = props

  const gr = EIA.gr (item)
  const locked = EIA.isTemplateLocked (item)

  const all_groups = React.useMemo (
    () => elems (StaticData.A.equipmentGroups (staticData)),
    [ staticData ]
  )

  const GROUPS_SELECTION = React.useMemo (
    () => pipe_ (
            all_groups,
            map (x => DropdownOption ({ id: Just (NINA.id (x)), name: NINA.name (x) }))
          ),
    [ all_groups ]
  )

  const IMP_GROUPS_SELECTION = React.useMemo (
    () => filter ((x: Record<DropdownOption<number>>) => any (lt (3)) (DropdownOption.A.id (x)))
                 (GROUPS_SELECTION),
    [ GROUPS_SELECTION ]
  )

  const TEMPLATES =
    pipe_ (
      templates,
      map (itemTemplateToDropdown),
      consF (
        DropdownOption ({ name: translate (staticData) ("general.none") })
      )
    )

  return (
    <>
      <div className="main">
        <div className="row">
          <TextField
            className="number"
            label={translate (staticData) ("equipment.dialogs.addedit.number")}
            value={EIA.amount (item)}
            onChange={setAmount}
            valid={IEIVA.amount (inputValidation)}
            />
          <TextField
            className="name"
            label={translate (staticData) ("equipment.dialogs.addedit.name")}
            value={EIA.name (item)}
            onChange={setName}
            autoFocus={or (isInCreation)}
            disabled={locked}
            valid={IEIVA.name (inputValidation)}
            />
        </div>
        <div className="row">
          <TextField
            className="price"
            label={translate (staticData) ("equipment.dialogs.addedit.price")}
            value={EIA.price (item)}
            onChange={setPrice}
            disabled={locked}
            valid={IEIVA.price (inputValidation)}
            />
          <TextField
            className="weight"
            label={translate (staticData) ("equipment.dialogs.addedit.weight")}
            value={EIA.weight (item)}
            onChange={setWeight}
            disabled={locked}
            valid={IEIVA.weight (inputValidation)}
            />
          <TextField
            className="where"
            label={translate (staticData) ("equipment.dialogs.addedit.carriedwhere")}
            value={maybeToUndefined (EIA.where (item))}
            onChange={setWhere}
            />
        </div>
        <div className="row">
          <Dropdown
            className="gr"
            label={translate (staticData) ("equipment.dialogs.addedit.itemgroup")}
            hint={translate (staticData) ("equipment.dialogs.addedit.itemgrouphint")}
            value={Just (gr)}
            options={GROUPS_SELECTION}
            onChangeJust={setGroup}
            disabled={locked}
            required
            />
        </div>
        {gr > 4
          ? (
            <div className="row">
              <Checkbox
                className="improvised-weapon"
                label={translate (staticData) ("equipment.dialogs.addedit.improvisedweapon")}
                checked={isJust (EIA.improvisedWeaponGroup (item))}
                onClick={switchIsImprovisedWeapon}
                disabled={locked}
                />
              <Dropdown
                className="gr imp-gr"
                hint={translate (staticData) ("equipment.dialogs.addedit.improvisedweapongroup")}
                value={EIA.improvisedWeaponGroup (item)}
                options={IMP_GROUPS_SELECTION}
                onChangeJust={setImprovisedWeaponGroup}
                disabled={locked || isNothing (EIA.improvisedWeaponGroup (item))}
                />
            </div>
          )
          : null}
        <Hr />
        <div className="row">
          <Dropdown
            className="template"
            label={translate (staticData) ("equipment.dialogs.addedit.template")}
            hint={translate (staticData) ("general.none")}
            value={EIA.template (item)}
            options={TEMPLATES}
            onChangeJust={setTemplate}
            disabled={locked}
            />
          <IconButton
            icon="&#xE90a;"
            onClick={applyTemplate}
            disabled={isNothing (EIA.template (item)) || locked}
            />
          {locked ? (
            <IconButton
              icon="&#xE918;"
              onClick={unlockTemplate}
              />
          ) : (
            <IconButton
              icon="&#xE917;"
              onClick={lockTemplate}
              disabled={isNothing (EIA.template (item))}
              />
          )}
        </div>
      </div>
    </>
  )
}
