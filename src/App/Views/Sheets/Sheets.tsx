import * as React from "react"
import { DerivedCharacteristicId } from "../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { equals } from "../../../Data/Eq"
import { fmapF } from "../../../Data/Functor"
import { find, List } from "../../../Data/List"
import {
  bindF,
  Just,
  Maybe,
  maybeRNull,
} from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { DCId } from "../../Constants/Ids"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { Sex } from "../../Models/Hero/heroTypeHelpers"
import { PersonalData } from "../../Models/Hero/PersonalData"
import { Pet } from "../../Models/Hero/Pet"
import { Purse } from "../../Models/Hero/Purse"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { Armor } from "../../Models/View/Armor"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { BlessingCombined } from "../../Models/View/BlessingCombined"
import { CantripCombined } from "../../Models/View/CantripCombined"
import { CombatTechniqueWithAttackParryBase } from "../../Models/View/CombatTechniqueWithAttackParryBase"
import { DerivedCharacteristicValues } from "../../Models/View/DerivedCharacteristicCombined"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { HitZoneArmorForView } from "../../Models/View/HitZoneArmorForView"
import { ItemForView } from "../../Models/View/ItemForView"
import { LiturgicalChantWithRequirements } from "../../Models/View/LiturgicalChantWithRequirements"
import { MeleeWeapon } from "../../Models/View/MeleeWeapon"
import { RangedWeapon } from "../../Models/View/RangedWeapon"
import { ShieldOrParryingWeapon } from "../../Models/View/ShieldOrParryingWeapon"
import { SkillCombined } from "../../Models/View/SkillCombined"
import { SpellWithRequirements } from "../../Models/View/SpellWithRequirements"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Condition } from "../../Models/Wiki/Condition"
import { Culture } from "../../Models/Wiki/Culture"
import { DerivedCharacteristic } from "../../Models/Wiki/DerivedCharacteristic"
import { Disadvantage } from "../../Models/Wiki/Disadvantage"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { Race } from "../../Models/Wiki/Race"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { State } from "../../Models/Wiki/State"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import {
  DCPair,
  getCustomRules,
} from "../../Selectors/derivedCharacteristicsSelectors"
import { classListMaybe } from "../../Utilities/CSS"
import { translate } from "../../Utilities/I18n"
import { Maybe as NewMaybe } from "../../Utilities/Maybe"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { BelongingsSheet } from "./BelongingsSheet/BelongingsSheet"
import { CombatSheet } from "./CombatSheet/CombatSheet"
import { CombatSheetZones } from "./CombatSheet/CombatSheetZones"
import { RulesSheet } from "./RulesSheet/RulesSheet"
import { LiturgicalChantsSheet } from "./LiturgicalChantsSheet/LiturgicalChantsSheet"
import { MainSheet } from "./MainSheet/MainSheet"
import { SkillsSheet } from "./SkillsSheet/SkillsSheet"
import { SpellsSheet } from "./SpellsSheet/SpellsSheet"

export interface SheetsOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface SheetsStateProps {
  advantagesActive: Maybe<List<Record<ActiveActivatable<Advantage>>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  armors: Maybe<Record<Armor>[]>
  armorZones: NewMaybe<Record<HitZoneArmorForView>[]>
  attributes: List<Record<AttributeCombined>>
  avatar: Maybe<string>
  checkAttributeValueVisibility: boolean
  combatSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>
  culture: Maybe<Record<Culture>>
  derivedCharacteristics: List<DCPair>
  disadvantagesActive: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  el: Maybe<Record<ExperienceLevel>>
  fatePointsModifier: number
  generalsaActive: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  meleeWeapons: Maybe<Record<MeleeWeapon>[]>
  name: Maybe<string>
  professionName: Maybe<string>
  useParchment: boolean
  showRules: boolean
  zoomFactor: number

  // profession: Maybe<Record<Profession>>
  // professionVariant: Maybe<Record<ProfessionVariant>>
  profile: Record<PersonalData>
  race: Maybe<Record<Race>>
  rangedWeapons: Maybe<Record<RangedWeapon>[]>
  sex: Maybe<Sex>
  shieldsAndParryingWeapons: Maybe<Record<ShieldOrParryingWeapon>[]>
  skills: Maybe<List<Record<SkillCombined>>>
  items: Maybe<List<Record<ItemForView>>>
  pet: Maybe<Record<Pet>>
  purse: Maybe<Record<Purse>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  languagesWikiEntry: Maybe<Record<SpecialAbility>>
  languagesStateEntry: Maybe<Record<ActivatableDependent>>
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>
  cantrips: Maybe<List<Record<CantripCombined>>>
  magicalPrimary: List<string>
  magicalSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  magicalTradition: string
  properties: Maybe<string>
  spells: Maybe<List<Record<SpellWithRequirements>>>
  aspects: Maybe<string>
  blessedPrimary: Maybe<string>
  blessedSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  blessedTradition: Maybe<string>
  blessings: Maybe<List<Record<BlessingCombined>>>
  liturgicalChants: Maybe<List<Record<LiturgicalChantWithRequirements>>>
  conditions: List<Record<Condition>>
  states: List<Record<State>>
  books: StaticData["books"]
  skillGroupPages: OrderedMap<number, Pair<number, number>>
  skillsByGroup: Maybe<OrderedMap<number, List<Record<SkillCombined>>>>
}

export interface SheetsDispatchProps {
  printToPDF (): void
  exportAsRptok (): void
  switchAttributeValueVisibility (): void
  switchUseParchment (): void
  switchShowRules (): void
  setSheetZoomFactor (zoomFactor: number): void
}

type Props = SheetsStateProps & SheetsDispatchProps & SheetsOwnProps

export const Sheets: React.FC<Props> = props => {
  const {
    derivedCharacteristics,

    advantagesActive,
    ap,
    attributes,
    avatar,
    culture,
    disadvantagesActive,
    el,
    fatePointsModifier,
    generalsaActive,
    staticData,
    name,
    professionName,
    profile,
    race,
    sex,
    printToPDF,
    exportAsRptok,

    checkAttributeValueVisibility,
    languagesStateEntry,
    languagesWikiEntry,
    scriptsStateEntry,
    scriptsWikiEntry,
    skillsByGroup,
    skillGroupPages,
    switchAttributeValueVisibility,
    switchUseParchment,
    setSheetZoomFactor,
    useParchment,
    zoomFactor,

    armors,
    combatSpecialAbilities,
    combatTechniques,
    meleeWeapons,
    rangedWeapons,
    shieldsAndParryingWeapons,
    conditions,
    states,

    armorZones,

    items,
    pet,
    purse,
    totalPrice,
    totalWeight,

    cantrips,
    magicalPrimary,
    magicalSpecialAbilities,
    magicalTradition,
    properties,
    spells,

    aspects,
    blessedPrimary,
    blessedSpecialAbilities,
    blessedTradition,
    blessings,
    liturgicalChants,
    showRules,
    switchShowRules,
  } = props

  const maybeArcaneEnergy =
    find<DCPair> (pipe (fst, DerivedCharacteristic.A.id, equals<DerivedCharacteristicId> (DCId.AE)))
                 (derivedCharacteristics)

  const maybeKarmaPoints =
    find<DCPair> (pipe (fst, DerivedCharacteristic.A.id, equals<DerivedCharacteristicId> (DCId.KP)))
                 (derivedCharacteristics)

  const nArmorZones = armorZones.map (xs => xs.length).sum ()
  const nArmors = Maybe.sum (fmapF (armors) (xs => xs.length))

  const customRules = getCustomRules (
    advantagesActive,
    disadvantagesActive,
    generalsaActive,
    combatSpecialAbilities
  )
  const hasRules = customRules.total > 0
  const displayRulePage = hasRules && showRules

  return (
    <Page id="sheets">
      <Options>
        <BorderButton
          className="print-document"
          label={translate (staticData) ("sheets.printtopdfbtn")}
          onClick={printToPDF}
          />
        <BorderButton
          className="export-rptok"
          label={translate (staticData) ("sheets.exportasrptokbtn")}
          onClick={exportAsRptok}
          />
        <p className="maptool-hint">
          <a href="https://www.youtube.com/watch?v=1GhtRMBgSWY" target="_blank" rel="noreferrer">
            {translate (staticData) ("sheets.maptool.whatisthis")}
          </a>
          {" — "}
          {/* eslint-disable-next-line max-len */}
          <a href="https://www.orkenspalter.de/filebase/index.php?file/2736-dsa5-regelsatz-f%C3%BCr-maptool/" target="_blank" rel="noreferrer">
            {translate (staticData) ("sheets.maptool.download")}
          </a>
        </p>
        <Checkbox
          checked={useParchment}
          onClick={switchUseParchment}
          >
          {translate (staticData) ("sheets.useparchment")}
        </Checkbox>
        <Checkbox
          checked={checkAttributeValueVisibility}
          onClick={switchAttributeValueVisibility}
          >
          {translate (staticData) ("sheets.showattributevalues")}
        </Checkbox>
        <Checkbox
          checked={showRules}
          onClick={switchShowRules}
          disabled={!hasRules}
          >
          {translate (staticData) ("sheets.usecustomrules")}
        </Checkbox>
        <Dropdown
          label={translate (staticData) ("sheets.zoomfactor")}
          value={Just (zoomFactor)}
          onChangeJust={setSheetZoomFactor}
          options={List (
            DropdownOption ({
              id: Just (100),
              name: "100%",
            }),
            DropdownOption ({
              id: Just (125),
              name: "125%",
            }),
            DropdownOption ({
              id: Just (150),
              name: "150%",
            }),
            DropdownOption ({
              id: Just (175),
              name: "175%",
            }),
            DropdownOption ({
              id: Just (200),
              name: "200%",
            }),
          )}
          fullWidth
          />
      </Options>
      <Scroll className={classListMaybe (List (
                  Just ("sheet-wrapper"),
                  Just (`zoom-${zoomFactor}`)
                ))}
              >
        <MainSheet
          advantagesActive={advantagesActive}
          ap={ap}
          attributes={attributes}
          avatar={avatar}
          culture={culture}
          derivedCharacteristics={derivedCharacteristics}
          disadvantagesActive={disadvantagesActive}
          el={el}
          fatePointsModifier={fatePointsModifier}
          generalsaActive={generalsaActive}
          staticData={staticData}
          name={name}
          professionName={professionName}
          profile={profile}
          race={race}
          sex={sex}
          useParchment={useParchment}
          />
        <SkillsSheet
          attributes={attributes}
          checkAttributeValueVisibility={checkAttributeValueVisibility}
          languagesStateEntry={languagesStateEntry}
          languagesWikiEntry={languagesWikiEntry}
          staticData={staticData}
          scriptsStateEntry={scriptsStateEntry}
          scriptsWikiEntry={scriptsWikiEntry}
          skillsByGroup={skillsByGroup}
          skillGroupPages={skillGroupPages}
          useParchment={useParchment}
          />
        {
          (nArmorZones === 0 || nArmors > 0)
          ? (
            <CombatSheet
              armors={armors}
              attributes={attributes}
              combatSpecialAbilities={combatSpecialAbilities}
              combatTechniques={combatTechniques}
              derivedCharacteristics={derivedCharacteristics}
              staticData={staticData}
              meleeWeapons={meleeWeapons}
              rangedWeapons={rangedWeapons}
              shieldsAndParryingWeapons={shieldsAndParryingWeapons}
              conditions={conditions}
              states={states}
              useParchment={useParchment}
              />
              )
          : null
        }
        {
          nArmorZones > 0
          ? (
            <CombatSheetZones
              armorZones={armorZones}
              attributes={attributes}
              combatSpecialAbilities={combatSpecialAbilities}
              combatTechniques={combatTechniques}
              derivedCharacteristics={derivedCharacteristics}
              staticData={staticData}
              meleeWeapons={meleeWeapons}
              rangedWeapons={rangedWeapons}
              shieldsAndParryingWeapons={shieldsAndParryingWeapons}
              conditions={conditions}
              states={states}
              useParchment={useParchment}
              />
          )
          : null
        }
        <BelongingsSheet
          attributes={attributes}
          items={items}
          staticData={staticData}
          pet={pet}
          purse={purse}
          totalPrice={totalPrice}
          totalWeight={totalWeight}
          useParchment={useParchment}
          />
        {pipe_ (
          maybeArcaneEnergy,
          bindF (pipe (snd, DerivedCharacteristicValues.A.value)),
          maybeRNull (() => (
                       <SpellsSheet
                         attributes={attributes}
                         cantrips={cantrips}
                         checkAttributeValueVisibility={checkAttributeValueVisibility}
                         derivedCharacteristics={derivedCharacteristics}
                         staticData={staticData}
                         magicalPrimary={magicalPrimary}
                         magicalSpecialAbilities={magicalSpecialAbilities}
                         magicalTradition={magicalTradition}
                         properties={properties}
                         spells={spells}
                         switchAttributeValueVisibility={switchAttributeValueVisibility}
                         useParchment={useParchment}
                         />
                     ))
        )}
        {pipe_ (
          maybeKarmaPoints,
          bindF (pipe (snd, DerivedCharacteristicValues.A.value)),
          maybeRNull (() => (
                       <LiturgicalChantsSheet
                         aspects={aspects}
                         attributes={attributes}
                         blessedPrimary={blessedPrimary}
                         blessedSpecialAbilities={blessedSpecialAbilities}
                         blessedTradition={blessedTradition}
                         blessings={blessings}
                         checkAttributeValueVisibility={checkAttributeValueVisibility}
                         derivedCharacteristics={derivedCharacteristics}
                         liturgicalChants={liturgicalChants}
                         staticData={staticData}
                         useParchment={useParchment}
                         />
                     ))
        )}
      {
        displayRulePage
        ? (
          <RulesSheet
            attributes={attributes}
            staticData={staticData}
            useParchment={useParchment}
            rules={customRules}
            />
          )
        : null
      }
      </Scroll>
    </Page>
  )
}
