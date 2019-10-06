import * as React from "react";
import { equals } from "../../../Data/Eq";
import { find, List } from "../../../Data/List";
import { bindF, Maybe, maybeRNull } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Pair } from "../../../Data/Tuple";
import { DCId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { PersonalData } from "../../Models/Hero/PersonalData";
import { Pet } from "../../Models/Hero/Pet";
import { Purse } from "../../Models/Hero/Purse";
import { Rules } from "../../Models/Hero/Rules";
import { NumIdName } from "../../Models/NumIdName";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { Armor } from "../../Models/View/Armor";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { BlessingCombined } from "../../Models/View/BlessingCombined";
import { CantripCombined } from "../../Models/View/CantripCombined";
import { CombatTechniqueWithAttackParryBase } from "../../Models/View/CombatTechniqueWithAttackParryBase";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { HitZoneArmorForView } from "../../Models/View/HitZoneArmorForView";
import { ItemForView } from "../../Models/View/ItemForView";
import { LiturgicalChantWithRequirements } from "../../Models/View/LiturgicalChantWithRequirements";
import { MeleeWeapon } from "../../Models/View/MeleeWeapon";
import { RangedWeapon } from "../../Models/View/RangedWeapon";
import { ShieldOrParryingWeapon } from "../../Models/View/ShieldOrParryingWeapon";
import { SkillCombined } from "../../Models/View/SkillCombined";
import { SpellWithRequirements } from "../../Models/View/SpellWithRequirements";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Culture } from "../../Models/Wiki/Culture";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Race } from "../../Models/Wiki/Race";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModel } from "../../Models/Wiki/WikiModel";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { isBookEnabled } from "../../Utilities/RulesUtils";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { BelongingsSheet } from "./BelongingsSheet/BelongingsSheet";
import { CombatSheet } from "./CombatSheet/CombatSheet";
import { CombatSheetZones } from "./CombatSheet/CombatSheetZones";
import { LiturgicalChantsSheet } from "./LiturgicalChantsSheet/LiturgicalChantsSheet";
import { MainSheet } from "./MainSheet/MainSheet";
import { SkillsSheet } from "./SkillsSheet/SkillsSheet";
import { SpellsSheet } from "./SpellsSheet/SpellsSheet";

export interface SheetsOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface SheetsStateProps {
  advantagesActive: Maybe<List<Record<ActiveActivatable<Advantage>>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  armors: Maybe<List<Record<Armor>>>
  armorZones: Maybe<List<Record<HitZoneArmorForView>>>
  attributes: List<Record<AttributeCombined>>
  avatar: Maybe<string>
  checkAttributeValueVisibility: boolean
  combatSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>
  culture: Maybe<Record<Culture>>
  derivedCharacteristics: List<Record<DerivedCharacteristic>>
  disadvantagesActive: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  el: Maybe<Record<ExperienceLevel>>
  fatePointsModifier: number
  generalsaActive: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>
  name: Maybe<string>
  professionName: Maybe<string>
  // profession: Maybe<Record<Profession>>
  // professionVariant: Maybe<Record<ProfessionVariant>>
  profile: Maybe<Record<PersonalData>>
  race: Maybe<Record<Race>>
  rangedWeapons: Maybe<List<Record<RangedWeapon>>>
  sex: Maybe<Sex>
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>
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
  conditions: List<Record<NumIdName>>
  states: List<Record<NumIdName>>
  books: WikiModel["books"]
  skillGroupPages: OrderedMap<number, Pair<number, number>>
  skillsByGroup: Maybe<OrderedMap<number, List<Record<SkillCombined>>>>
}

export interface SheetsDispatchProps {
  printToPDF (): void
  switchAttributeValueVisibility (): void
}

export type SheetsProps = SheetsStateProps & SheetsDispatchProps & SheetsOwnProps

const HA = HeroModel.A
const RA = Rules.A

export function Sheets (props: SheetsProps) {
  const {
    derivedCharacteristics,
    books,
    hero,

    advantagesActive,
    ap,
    attributes,
    avatar,
    culture,
    disadvantagesActive,
    el,
    fatePointsModifier,
    generalsaActive,
    l10n,
    name,
    professionName,
    profile,
    race,
    sex,
    printToPDF,

    checkAttributeValueVisibility,
    languagesStateEntry,
    languagesWikiEntry,
    scriptsStateEntry,
    scriptsWikiEntry,
    skillsByGroup,
    skillGroupPages,
    switchAttributeValueVisibility,

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
  } = props

  const maybeArcaneEnergy = find (pipe (DerivedCharacteristic.A.id, equals<DCId> (DCId.AE)))
                                 (derivedCharacteristics)

  const maybeKarmaPoints = find (pipe (DerivedCharacteristic.A.id, equals<DCId> (DCId.KP)))
                                (derivedCharacteristics)

  return (
    <Page id="sheets">
      <Scroll className="sheet-wrapper">
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
          l10n={l10n}
          name={name}
          professionName={professionName}
          profile={profile}
          race={race}
          sex={sex}
          printToPDF={printToPDF}
          />
        <SkillsSheet
          attributes={attributes}
          checkAttributeValueVisibility={checkAttributeValueVisibility}
          languagesStateEntry={languagesStateEntry}
          languagesWikiEntry={languagesWikiEntry}
          l10n={l10n}
          scriptsStateEntry={scriptsStateEntry}
          scriptsWikiEntry={scriptsWikiEntry}
          skillsByGroup={skillsByGroup}
          skillGroupPages={skillGroupPages}
          switchAttributeValueVisibility={switchAttributeValueVisibility}
          />
        <CombatSheet
          armors={armors}
          attributes={attributes}
          combatSpecialAbilities={combatSpecialAbilities}
          combatTechniques={combatTechniques}
          derivedCharacteristics={derivedCharacteristics}
          l10n={l10n}
          meleeWeapons={meleeWeapons}
          rangedWeapons={rangedWeapons}
          shieldsAndParryingWeapons={shieldsAndParryingWeapons}
          conditions={conditions}
          states={states}
          />
        {isBookEnabled (books)
                       (RA.enabledRuleBooks (HA.rules (hero)))
                       (RA.enableAllRuleBooks (HA.rules (hero)))
                       ("US25208")
          ? (
            <CombatSheetZones
              armorZones={armorZones}
              attributes={attributes}
              combatSpecialAbilities={combatSpecialAbilities}
              combatTechniques={combatTechniques}
              derivedCharacteristics={derivedCharacteristics}
              l10n={l10n}
              meleeWeapons={meleeWeapons}
              rangedWeapons={rangedWeapons}
              shieldsAndParryingWeapons={shieldsAndParryingWeapons}
              conditions={conditions}
              states={states}
              />
          )
          : null}
        <BelongingsSheet
          attributes={attributes}
          items={items}
          l10n={l10n}
          pet={pet}
          purse={purse}
          totalPrice={totalPrice}
          totalWeight={totalWeight}
          />
        {pipe_ (
          maybeArcaneEnergy,
          bindF (DerivedCharacteristic.A.value),
          maybeRNull (() => (
                       <SpellsSheet
                         attributes={attributes}
                         cantrips={cantrips}
                         checkAttributeValueVisibility={checkAttributeValueVisibility}
                         derivedCharacteristics={derivedCharacteristics}
                         l10n={l10n}
                         magicalPrimary={magicalPrimary}
                         magicalSpecialAbilities={magicalSpecialAbilities}
                         magicalTradition={magicalTradition}
                         properties={properties}
                         spells={spells}
                         switchAttributeValueVisibility={switchAttributeValueVisibility}
                         />
                     ))
        )}
        {pipe_ (
          maybeKarmaPoints,
          bindF (DerivedCharacteristic.A.value),
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
                         l10n={l10n}
                         switchAttributeValueVisibility={switchAttributeValueVisibility}
                         />
                     ))
        )}
      </Scroll>
    </Page>
  )
}
