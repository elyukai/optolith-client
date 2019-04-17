import * as React from "react";
import { translate } from "../../Utilities/I18n";
import { getAbbreviation } from "../../Utilities/Increasable/attributeUtils";
import { getLossLevelElements, ItemEditorInputValidation } from "../../Utilities/ItemUtils";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Hr } from "../Universal/Hr";
import { Label } from "../Universal/Label";
import { TextField } from "../Universal/TextField";

export interface ItemEditorMeleeSectionProps {
  attributes: OrderedMap<string, Record<Attribute>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  item: Record<ItemEditorInstance>
  locale: UIMessagesObject
  inputValidation: Record<ItemEditorInputValidation>
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
  setStabilityModifier (value: string): void
  switchIsParryingWeapon (): void
  switchIsTwoHandedWeapon (): void
  setLoss (id: Maybe<number>): void
}

export function ItemEditorMeleeSection (props: ItemEditorMeleeSectionProps) {
  const { attributes, combatTechniques, inputValidation, item, locale } = props

  const dice =
    List.zipWith<string, number, Record<DropdownOption>>
      (name => id => Record.of<DropdownOption> ({ id, name }))
      (translate (locale, "equipment.view.dice"))
      (List.of (2, 3, 6))

  const gr = item .get ("gr")
  const locked = item .get ("isTemplateLocked")
  const combatTechnique = item .lookup ("combatTechnique")
  const damageBonusThreshold = item .get ("damageBonus") .get ("threshold")

  const lockedByNoCombatTechniqueOrLances =
    locked
    || !Maybe.isJust (combatTechnique)
    || Maybe.fromJust (combatTechnique) === "CT_7"

  return (gr === 1 || Maybe.elem (1) (item .lookup ("improvisedWeaponGroup")))
    ? (
      <>
        <Hr className="vertical" />
        <div className="melee">
          <div className="row">
            <Dropdown
              className="combattechnique"
              label={translate (locale, "itemeditor.options.combattechnique")}
              hint={translate (locale, "options.none")}
              value={combatTechnique}
              options={
                combatTechniques
                  .elems ()
                  .filter (e => e .get ("gr") === 1) as unknown as List<Record<DropdownOption>>
              }
              onChangeJust={props.setCombatTechnique}
              disabled={locked}
              required
              />
          </div>
          <div className="row">
            <Dropdown
              className="primary-attribute-selection"
              label={translate (locale, "itemeditor.options.primaryattribute")}
              value={item .get ("damageBonus") .lookup ("primary")}
              options={List.of<Record<DropdownOption>> (
                Record.of ({
                  name: `${translate (locale, "itemeditor.options.primaryattributeshort")} (${
                    Maybe.fromMaybe
                      ("")
                      (combatTechnique
                        .bind (OrderedMap.lookup_ (combatTechniques))
                        .fmap (R.pipe (
                          Record.get<CombatTechnique, "primary"> ("primary"),
                          Maybe.mapMaybe (R.pipe (
                            OrderedMap.lookup_ (attributes),
                            Maybe.fmap (getAbbreviation)
                          )),
                          List.intercalate ("/")
                        )))
                  })`,
                }),
                Record.of<DropdownOption> ({
                  id: "ATTR_5",
                  name: Maybe.fromMaybe ("")
                                        (attributes .lookup ("ATTR_5") .fmap (getAbbreviation)),
                }),
                Record.of<DropdownOption> ({
                  id: "ATTR_6",
                  name: Maybe.fromMaybe ("")
                                        (attributes .lookup ("ATTR_6") .fmap (getAbbreviation)),
                }),
                Record.of<DropdownOption> ({
                  id: "ATTR_6_8",
                  name: `${
                    Maybe.fromMaybe ("")
                                        (attributes .lookup ("ATTR_6") .fmap (getAbbreviation))
                  }/${
                    Maybe.fromMaybe ("")
                                        (attributes .lookup ("ATTR_8") .fmap (getAbbreviation))
                  }`,
                }),
                Record.of<DropdownOption> ({
                  id: "ATTR_8",
                  name: Maybe.fromMaybe ("")
                                        (attributes .lookup ("ATTR_8") .fmap (getAbbreviation)),
                })
              )}
              onChange={props.setPrimaryAttribute}
              disabled={lockedByNoCombatTechniqueOrLances}
              />
            {
              damageBonusThreshold instanceof List
                ? (
                  <div className="container damage-threshold">
                    <Label
                      text={translate (locale, "itemeditor.options.damagethreshold")}
                      disabled={lockedByNoCombatTechniqueOrLances}
                      />
                    <TextField
                      className="damage-threshold-part"
                      value={Maybe.listToMaybe (damageBonusThreshold)}
                      onChangeString={props.setFirstDamageThreshold}
                      disabled={lockedByNoCombatTechniqueOrLances}
                      valid={inputValidation .get ("firstDamageThreshold")}
                      />
                    <TextField
                      className="damage-threshold-part"
                      value={List.last_ (damageBonusThreshold)}
                      onChangeString={props.setSecondDamageThreshold}
                      disabled={lockedByNoCombatTechniqueOrLances}
                      valid={inputValidation .get ("secondDamageThreshold")}
                      />
                  </div>
                )
                : (
                  <TextField
                    className="damage-threshold"
                    label={translate (locale, "itemeditor.options.damagethreshold")}
                    value={damageBonusThreshold}
                    onChangeString={props.setDamageThreshold}
                    disabled={lockedByNoCombatTechniqueOrLances}
                    valid={inputValidation .get ("damageThreshold")}
                    />
                )
            }
          </div>
          <div className="row">
            <Checkbox
              className="damage-threshold-separated"
              label={translate (locale, "itemeditor.options.damagethresholdseparated")}
              checked={damageBonusThreshold instanceof List}
              onClick={props.switchIsDamageThresholdSeparated}
              disabled={
                locked
                || !Maybe.isJust (combatTechnique)
                || !(
                  typeof damageBonusThreshold === "string"
                  && damageBonusThreshold === "ATTR_6_8"
                  || Maybe.elem
                    (true)
                    (combatTechniques
                      .lookup (Maybe.fromJust (combatTechnique))
                      .fmap (R.pipe (
                        Record.get<CombatTechnique, "primary"> ("primary"),
                        List.lengthL,
                        R.equals (2)
                      )))
                )
                || Maybe.fromJust (combatTechnique) === "CT_7"
              }
              />
          </div>
          <div className="row">
            <div className="container">
              <Label text={translate (locale, "itemeditor.options.damage")} disabled={locked} />
              <TextField
                className="damage-dice-number"
                value={item .get ("damageDiceNumber")}
                onChangeString={props.setDamageDiceNumber}
                disabled={locked}
                valid={inputValidation .get ("damageDiceNumber")}
                />
              <Dropdown
                className="damage-dice-sides"
                hint={translate (locale, "itemeditor.options.damagedice")}
                value={item .lookup ("damageDiceSides")}
                options={dice}
                onChangeJust={props.setDamageDiceSides}
                disabled={locked}
                />
              <TextField
                className="damage-flat"
                value={item .get ("damageFlat")}
                onChangeString={props.setDamageFlat}
                disabled={locked}
                valid={inputValidation .get ("damageFlat")}
                />
            </div>
            <TextField
              className="stabilitymod"
              label={translate (locale, "itemeditor.options.bfmod")}
              value={item .get ("stabilityMod")}
              onChangeString={props.setStabilityModifier}
              disabled={locked}
              valid={inputValidation .get ("stabilityMod")}
              />
            <Dropdown
              className="weapon-loss"
              label={translate (locale, "itemeditor.options.weaponloss")}
              value={item .lookup ("stabilityMod")}
              options={getLossLevelElements ()}
              onChange={props.setLoss}
              />
          </div>
          <div className="row">
            <Dropdown
              className="reach"
              label={translate (locale, "itemeditor.options.reach")}
              hint={translate (locale, "options.none")}
              value={item .lookup ("reach")}
              options={List.of<Record<DropdownOption>> (
                Record.of<DropdownOption> ({
                  id: 1,
                  name: translate (locale, "itemeditor.options.reachshort"),
                }),
                Record.of<DropdownOption> ({
                  id: 2,
                  name: translate (locale, "itemeditor.options.reachmedium"),
                }),
                Record.of<DropdownOption> ({
                  id: 3,
                  name: translate (locale, "itemeditor.options.reachlong"),
                })
              )}
              onChangeJust={props.setReach}
              disabled={locked || Maybe.elem ("CT_7") (combatTechnique)}
              required
              />
            <div className="container">
              <Label
                text={translate (locale, "itemeditor.options.atpamod")}
                disabled={locked || Maybe.elem ("CT_7") (combatTechnique)}
                />
              <TextField
                className="at"
                value={item .get ("at")}
                onChangeString={props.setAttack}
                disabled={locked || Maybe.elem ("CT_7") (combatTechnique)}
                valid={inputValidation .get ("at")}
              />
            <TextField
              className="pa"
              value={item .get ("pa")}
              onChangeString={props.setParry}
              disabled={
                locked
                || Maybe.elem ("CT_6") (combatTechnique)
                || Maybe.elem ("CT_7") (combatTechnique)
              }
              valid={inputValidation .get ("pa")}
              />
          </div>
          {
            Maybe.elem ("CT_10") (combatTechnique)
              ? (
                <TextField
                  className="stp"
                  label={translate (locale, "itemeditor.options.structurepoints")}
                  value={item .get ("stp")}
                  onChangeString={props.setStructurePoints}
                  disabled={locked}
                  valid={inputValidation .get ("structurePoints")}
                  />
              )
              : (
                <TextField
                  className="length"
                  label={translate (locale, "itemeditor.options.length")}
                  value={item .get ("length")}
                  onChangeString={props.setLength}
                  disabled={locked}
                  valid={inputValidation .get ("length")}
                  />
              )
          }
        </div>
        <div className="row">
          <Checkbox
            className="parrying-weapon"
            label={translate (locale, "itemeditor.options.parryingweapon")}
            checked={item .lookup ("isParryingWeapon")}
            onClick={props.switchIsParryingWeapon}
            disabled={locked}
            />
          <Checkbox
            className="twohanded-weapon"
            label={translate (locale, "itemeditor.options.twohandedweapon")}
            checked={!item .lookup ("isTwoHandedWeapon")}
            onClick={props.switchIsTwoHandedWeapon}
            disabled={locked}
            />
        </div>
      </div>
    </>
  )
  : null
}
