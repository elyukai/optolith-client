import * as React from "react"
import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { flength, intercalate, isList, List, map } from "../../../Data/List"
import { bindF, elem, ensure, fromJust, isJust, isNothing, Just, mapMaybe, Maybe, maybe, or } from "../../../Data/Maybe"
import { elems, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, isTuple, snd } from "../../../Data/Tuple"
import { AttrId, CombatTechniqueId } from "../../Constants/Ids"
import { EditItem } from "../../Models/Hero/EditItem"
import { EditPrimaryAttributeDamageThreshold } from "../../Models/Hero/EditPrimaryAttributeDamageThreshold"
import { NumIdName } from "../../Models/NumIdName"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { Attribute } from "../../Models/Wiki/Attribute"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { ItemEditorInputValidation } from "../../Utilities/itemEditorInputValidationUtils"
import { getLossLevelElements } from "../../Utilities/ItemUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { isString } from "../../Utilities/typeCheckUtils"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"
import { Hr } from "../Universal/Hr"
import { Label } from "../Universal/Label"
import { TextField } from "../Universal/TextField"

export interface ItemEditorMeleeSectionProps {
  attributes: OrderedMap<string, Record<Attribute>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  item: Record<EditItem>
  staticData: StaticDataRecord
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

const EIA = EditItem.A
const IEIVA = ItemEditorInputValidation.A
const EPADTA = EditPrimaryAttributeDamageThreshold.A
const CTA = CombatTechnique.A
const AA = Attribute.A

const shortOrEmpty =
  (attrs: OrderedMap<string, Record<Attribute>>) => pipe (lookupF (attrs), maybe ("") (AA.short))

export const ItemEditorMeleeSection: React.FC<ItemEditorMeleeSectionProps> = props => {
  const {
    attributes,
    combatTechniques,
    item,
    staticData,
    inputValidation,
    setCombatTechnique,
    setDamageDiceNumber,
    setDamageDiceSides,
    setDamageFlat,
    setPrimaryAttribute,
    setDamageThreshold,
    setFirstDamageThreshold,
    setSecondDamageThreshold,
    switchIsDamageThresholdSeparated,
    setAttack,
    setParry,
    setReach,
    setLength,
    setStructurePoints,
    setStabilityModifier,
    switchIsParryingWeapon,
    switchIsTwoHandedWeapon,
    setLoss,
  } = props

  const reach_labels = React.useMemo (
    () => pipe_ (
            staticData,
            StaticData.A.reaches,
            elems,
            map (x => DropdownOption ({
                        id: Just (NumIdName.A.id (x)),
                        name: NumIdName.A.name (x),
                      }))
          ),
    [ staticData ]
  )

  const dice =
    map ((id: number) => DropdownOption ({
                                           id: Just (id),
                                           name: `${translate (staticData) ("general.dice")}${id}`,
                                        }))
        (List (2, 3, 6))

  const gr = EIA.gr (item)
  const locked = EIA.isTemplateLocked (item)
  const combatTechnique = EIA.combatTechnique (item)
  const damageBonusThreshold = pipe_ (item, EIA.damageBonus, EPADTA.threshold)

  const lockedByNoCombatTechniqueOrLances =
    locked
    || !isJust (combatTechnique)
    || fromJust (combatTechnique) === CombatTechniqueId.Lances

  return (gr === 1 || (elem (1) (EIA.improvisedWeaponGroup (item)) && gr > 4))
    ? (
      <>
        <Hr className="vertical" />
        <div className="melee">
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
                  ensure (pipe (CTA.gr, equals (1))),
                  fmap (x => DropdownOption ({ id: Just (CTA.id (x)), name: CTA.name (x) }))
                ))
              )}
              onChangeJust={setCombatTechnique}
              disabled={locked}
              required
              />
          </div>
          <div className="row">
            <Dropdown
              className="primary-attribute-selection"
              label={translate (staticData) ("equipment.dialogs.addedit.primaryattribute")}
              value={pipe_ (
                item,
                EIA.damageBonus,
                EPADTA.primary,
                x => typeof x === "object" ? "ATTR_6_8" : x
              )}
              options={List (
                DropdownOption ({
                  name: `${translate (staticData) ("equipment.dialogs.addedit.primaryattribute.short")} (${
                    pipe_ (
                      combatTechnique,
                      bindF (lookupF (combatTechniques)),
                      maybe ("")
                            (pipe (
                              CTA.primary,
                              mapMaybe (pipe (lookupF (attributes), fmap (AA.short))),
                              intercalate ("/")
                            ))
                    )
                  })`,
                }),
                DropdownOption ({
                  id: Just (AttrId.Dexterity),
                  name: shortOrEmpty (attributes) (AttrId.Dexterity),
                }),
                DropdownOption ({
                  id: Just (AttrId.Agility),
                  name: shortOrEmpty (attributes) (AttrId.Agility),
                }),
                DropdownOption ({
                  id: Just ("ATTR_6_8"),
                  name: `${
                    shortOrEmpty (attributes) (AttrId.Agility)
                  }/${
                    shortOrEmpty (attributes) (AttrId.Strength)
                  }`,
                }),
                DropdownOption ({
                  id: Just (AttrId.Strength),
                  name: shortOrEmpty (attributes) (AttrId.Strength),
                })
              )}
              onChange={setPrimaryAttribute}
              disabled={lockedByNoCombatTechniqueOrLances}
              />
            {
              isTuple (damageBonusThreshold)
                ? (
                  <div className="container damage-threshold">
                    <Label
                      text={translate (staticData) ("equipment.dialogs.addedit.damagethreshold")}
                      disabled={lockedByNoCombatTechniqueOrLances}
                      />
                    <TextField
                      className="damage-threshold-part"
                      value={fst (damageBonusThreshold)}
                      onChange={setFirstDamageThreshold}
                      disabled={lockedByNoCombatTechniqueOrLances}
                      valid={IEIVA.firstDamageThreshold (inputValidation)}
                      />
                    <TextField
                      className="damage-threshold-part"
                      value={snd (damageBonusThreshold)}
                      onChange={setSecondDamageThreshold}
                      disabled={lockedByNoCombatTechniqueOrLances}
                      valid={IEIVA.secondDamageThreshold (inputValidation)}
                      />
                  </div>
                )
                : (
                  <TextField
                    className="damage-threshold"
                    label={translate (staticData) ("equipment.dialogs.addedit.damagethreshold")}
                    value={damageBonusThreshold}
                    onChange={setDamageThreshold}
                    disabled={lockedByNoCombatTechniqueOrLances}
                    valid={IEIVA.damageThreshold (inputValidation)}
                    />
                )
            }
          </div>
          <div className="row">
            <Checkbox
              className="damage-threshold-separated"
              label={translate (staticData) ("equipment.dialogs.addedit.separatedamagethresholds")}
              checked={isList (damageBonusThreshold)}
              onClick={switchIsDamageThresholdSeparated}
              disabled={
                locked
                || isNothing (combatTechnique)
                || !(
                  (isString (damageBonusThreshold) && damageBonusThreshold === "ATTR_6_8")
                  || pipe_ (
                      combatTechniques,
                      lookup (fromJust (combatTechnique)),
                      fmap (pipe (
                        CTA.primary,
                        flength,
                        equals (2)
                      )),
                      or
                    )
                )
                || fromJust (combatTechnique) === CombatTechniqueId.Lances
              }
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
            <Dropdown
              className="reach"
              label={translate (staticData) ("equipment.dialogs.addedit.reach")}
              hint={translate (staticData) ("general.none")}
              value={EIA.reach (item)}
              options={reach_labels}
              onChangeJust={setReach}
              disabled={locked || elem<string> (CombatTechniqueId.Lances) (combatTechnique)}
              required
              />
            <div className="container">
              <Label
                text={translate (staticData) ("equipment.dialogs.addedit.attackparrymodifier")}
                disabled={locked || elem<string> (CombatTechniqueId.Lances) (combatTechnique)}
                />
              <TextField
                className="at"
                value={EIA.at (item)}
                onChange={setAttack}
                disabled={locked || elem<string> (CombatTechniqueId.Lances) (combatTechnique)}
                valid={IEIVA.at (inputValidation)}
                />
              <TextField
                className="pa"
                value={EIA.pa (item)}
                onChange={setParry}
                disabled={
                  locked
                  || elem<string> (CombatTechniqueId.ChainWeapons) (combatTechnique)
                  || elem<string> (CombatTechniqueId.Lances) (combatTechnique)
                }
                valid={IEIVA.pa (inputValidation)}
                />
            </div>
          {
            elem<string> (CombatTechniqueId.Shields) (combatTechnique)
              ? (
                <TextField
                  className="stp"
                  label={translate (staticData) ("equipment.dialogs.addedit.structurepoints")}
                  value={EIA.stp (item)}
                  onChange={setStructurePoints}
                  disabled={locked}
                  />
              )
              : (
                <TextField
                  className="length"
                  label={translate (staticData) ("equipment.dialogs.addedit.lengthwithunit")}
                  value={EIA.length (item)}
                  onChange={setLength}
                  disabled={locked}
                  valid={IEIVA.length (inputValidation)}
                  />
              )
          }
          </div>
          <div className="row">
            <Checkbox
              className="parrying-weapon"
              label={translate (staticData) ("equipment.dialogs.addedit.parryingweapon")}
              checked={EIA.isParryingWeapon (item)}
              onClick={switchIsParryingWeapon}
              disabled={locked}
              />
            <Checkbox
              className="twohanded-weapon"
              label={translate (staticData) ("equipment.dialogs.addedit.twohandedweapon")}
              checked={EIA.isTwoHandedWeapon (item)}
              onClick={switchIsTwoHandedWeapon}
              disabled={locked}
              />
          </div>
        </div>
      </>
    )
    : null
}
