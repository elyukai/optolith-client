import * as React from "react";
import { consF, imap, List, map, take } from "../../../Data/List";
import { isJust, isNothing, Just, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { EditItem } from "../../Models/Hero/EditItem";
import { DropdownOption } from "../../Models/View/DropdownOption";
import { ItemTemplate, itemTemplateToDropdown } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { ItemEditorInputValidation } from "../../Utilities/itemEditorInputValidationUtils";
import { pipe_ } from "../../Utilities/pipe";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown } from "../Universal/Dropdown";
import { Hr } from "../Universal/Hr";
import { IconButton } from "../Universal/IconButton";
import { TextField } from "../Universal/TextField";

export interface ItemEditorCommonSectionProps {
  isInCreation: Maybe<boolean>
  item: Record<EditItem>
  l10n: L10nRecord
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
const IEIVA = ItemEditorInputValidation.A

export const ItemEditorCommonSection: React.FC<ItemEditorCommonSectionProps> = props => {
  const {
    isInCreation,
    item,
    l10n,
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

  const GROUPS_SELECTION =
    imap (index => (e: string) => DropdownOption ({ id: Just (index + 1), name: e }))
         (translate (l10n) ("itemgroups"))

  const IMP_GROUPS_SELECTION =
    imap (index => (e: string) => DropdownOption ({ id: Just (index + 1), name: e }))
         (take (2) (translate (l10n) ("itemgroups")))

  const TEMPLATES =
    pipe_ (
      templates,
      map (itemTemplateToDropdown),
      consF (
        DropdownOption ({ name: translate (l10n) ("none") })
      )
    )

  return (
    <>
      <div className="main">
        <div className="row">
          <TextField
            className="number"
            label={translate (l10n) ("number")}
            value={EIA.amount (item)}
            onChange={setAmount}
            valid={IEIVA.amount (inputValidation)}
            />
          <TextField
            className="name"
            label={translate (l10n) ("name")}
            value={EIA.name (item)}
            onChange={setName}
            autoFocus={isInCreation}
            disabled={locked}
            valid={IEIVA.name (inputValidation)}
            />
        </div>
        <div className="row">
          <TextField
            className="price"
            label={translate (l10n) ("price")}
            value={EIA.price (item)}
            onChange={setPrice}
            disabled={locked}
            valid={IEIVA.price (inputValidation)}
            />
          <TextField
            className="weight"
            label={translate (l10n) ("weight")}
            value={EIA.weight (item)}
            onChange={setWeight}
            disabled={locked}
            valid={IEIVA.weight (inputValidation)}
            />
          <TextField
            className="where"
            label={translate (l10n) ("carriedwhere")}
            value={EIA.where (item)}
            onChange={setWhere}
            />
        </div>
        <div className="row">
          <Dropdown
            className="gr"
            label={translate (l10n) ("itemgroup")}
            hint={translate (l10n) ("itemgrouphint")}
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
                label={translate (l10n) ("improvisedweapon")}
                checked={isJust (EIA.improvisedWeaponGroup (item))}
                onClick={switchIsImprovisedWeapon}
                disabled={locked}
                />
              <Dropdown
                className="gr imp-gr"
                hint={translate (l10n) ("improvisedweapongroup")}
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
            label={translate (l10n) ("template")}
            hint={translate (l10n) ("none")}
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
