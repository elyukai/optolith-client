import * as React from "react"
import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { consF, List, map, subscript } from "../../../Data/List"
import { ensure, Just, mapMaybe, Maybe, maybeToUndefined } from "../../../Data/Maybe"
import { elems, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { EditItem } from "../../Models/Hero/EditItem"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { ItemEditorInputValidation } from "../../Utilities/itemEditorInputValidationUtils"
import { getLossLevelElements } from "../../Utilities/ItemUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Dropdown } from "../Universal/Dropdown"
import { Hr } from "../Universal/Hr"
import { Label } from "../Universal/Label"
import { TextField } from "../Universal/TextField"

export interface ItemEditorRangedSectionProps {
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  item: Record<EditItem>
  staticData: StaticDataRecord
  templates: List<Record<ItemTemplate>>
  inputValidation: Record<ItemEditorInputValidation>
  setCombatTechnique (id: string): void
  setDamageDiceNumber (value: string): void
  setDamageDiceSides (value: number): void
  setDamageFlat (value: string): void
  setLength (value: string): void
  setRange (index: 1 | 2 | 3): (value: string) => void
  setReloadTime (value: string): void
  setAmmunition (id: string): void
  setStabilityModifier (value: string): void
  setLoss (id: Maybe<number>): void
}

const EIA = EditItem.A
const ITA = ItemTemplate.A
const CTA = CombatTechnique.A
const IEIVA = ItemEditorInputValidation.A

export function ItemEditorRangedSection (props: ItemEditorRangedSectionProps) {
  const {
    combatTechniques,
    item,
    staticData,
    templates,
    inputValidation,
    setCombatTechnique,
    setDamageDiceNumber,
    setDamageDiceSides,
    setDamageFlat,
    setLength,
    setRange,
    setReloadTime,
    setAmmunition,
    setStabilityModifier,
    setLoss,
  } = props

  const dice =
    map ((id: number) => DropdownOption ({
                                           id: Just (id),
                                           name: `${translate (staticData) ("general.dice")}${id}`,
                                        }))
        (List (2, 3, 6))

  const gr = EIA.gr (item)
  const locked = EIA.isTemplateLocked (item)
  const combatTechnique = EIA.combatTechnique (item)

  const AMMUNITION =
    pipe_ (
      templates,
      mapMaybe (pipe (
        ensure (pipe (ITA.gr, equals (3))),
        fmap (x => DropdownOption ({ id: Just (ITA.id (x)), name: ITA.name (x) }))
      )),
      consF (DropdownOption ({ name: translate (staticData) ("general.none") }))
    )

  return (gr === 2 || (Maybe.elem (2) (EIA.improvisedWeaponGroup (item)) && gr > 4))
    ? (
      <>
        <Hr className="vertical" />
        <div className="ranged">
          <div className="row">
            <Dropdown
              className="combattechnique"
              label={translate (staticData) ("equipment.dialogs.addedit.combattechnique")}
              hint={translate (staticData) ("general.none")}
              value={combatTechnique}
              options={pipe_ (
                combatTechniques,
                elems,
                mapMaybe (pipe (
                  ensure (pipe (CTA.gr, equals (2))),
                  fmap (x => DropdownOption ({ id: Just (CTA.id (x)), name: CTA.name (x) }))
                ))
              )}
              onChangeJust={setCombatTechnique}
              disabled={locked}
              required
              />
            <TextField
              className="reloadtime"
              label={translate (staticData) ("equipment.dialogs.addedit.reloadtime")}
              value={EIA.reloadTime (item)}
              onChange={setReloadTime}
              disabled={locked}
              />
          </div>
          <div className="row">
            <div className="container">
              <Label
                text={translate (staticData) ("equipment.dialogs.addedit.damage")}
                disabled={locked}
                />
              <TextField
                className="damage-dice-number"
                value={EIA.damageDiceNumber (item)}
                onChange={setDamageDiceNumber}
                disabled={locked}
                valid={IEIVA.damageDiceNumber (inputValidation)}
                />
              <Dropdown
                className="damage-dice-sides"
                hint={translate (staticData) ("general.dice")}
                value={EIA.damageDiceSides (item)}
                options={dice}
                onChangeJust={setDamageDiceSides}
                disabled={locked}
                />
              <TextField
                className="damage-flat"
                value={EIA.damageFlat (item)}
                onChange={setDamageFlat}
                disabled={locked}
                valid={IEIVA.damageFlat (inputValidation)}
                />
            </div>
            <TextField
              className="stabilitymod"
              label={
                translate (staticData) ("equipment.dialogs.addedit.breakingpointratingmodifier")
              }
              value={EIA.stabilityMod (item)}
              onChange={setStabilityModifier}
              disabled={locked}
              valid={IEIVA.stabilityMod (inputValidation)}
              />
            <Dropdown
              className="weapon-loss"
              label={translate (staticData) ("equipment.dialogs.addedit.damaged")}
              value={EIA.loss (item)}
              options={getLossLevelElements ()}
              onChange={setLoss}
              />
          </div>
          <div className="row">
            <div className="container">
              <TextField
                className="range1"
                label={translate (staticData) ("equipment.dialogs.addedit.rangeclose")}
                value={maybeToUndefined (subscript (EIA.range (item)) (0))}
                onChange={setRange (1)}
                disabled={locked}
                valid={IEIVA.range1 (inputValidation)}
                />
              <TextField
                className="range2"
                label={translate (staticData) ("equipment.dialogs.addedit.rangemedium")}
                value={maybeToUndefined (subscript (EIA.range (item)) (1))}
                onChange={setRange (2)}
                disabled={locked}
                valid={IEIVA.range2 (inputValidation)}
                />
              <TextField
                className="range3"
                label={translate (staticData) ("equipment.dialogs.addedit.rangefar")}
                value={maybeToUndefined (subscript (EIA.range (item)) (2))}
                onChange={setRange (3)}
                disabled={locked}
                valid={IEIVA.range3 (inputValidation)}
                />
            </div>
            <Dropdown
              className="ammunition"
              label={translate (staticData) ("equipment.dialogs.addedit.ammunition")}
              hint={translate (staticData) ("general.none")}
              value={EIA.ammunition (item)}
              options={AMMUNITION}
              onChangeJust={setAmmunition}
              disabled={locked}
              />
            <TextField
              className="length"
              label={translate (staticData) ("equipment.dialogs.addedit.lengthwithunit")}
              value={EIA.length (item)}
              onChange={setLength}
              disabled={locked}
              valid={IEIVA.length (inputValidation)}
              />
          </div>
        </div>
      </>
    )
    : null
}
