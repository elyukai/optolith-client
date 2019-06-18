import * as React from "react";
import { equals } from "../../../Data/Eq";
import { find, List } from "../../../Data/List";
import { bindF, Maybe, maybeRNull } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Pair } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { PersonalData } from "../../Models/Hero/PersonalData";
import { Pet } from "../../Models/Hero/Pet";
import { Purse } from "../../Models/Hero/Purse";
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
import { SpellCombined } from "../../Models/View/SpellCombined";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Culture } from "../../Models/Wiki/Culture";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Race } from "../../Models/Wiki/Race";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModel } from "../../Models/Wiki/WikiModel";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
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
  magicalPrimary: Maybe<string>
  magicalSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  magicalTradition: string
  properties: Maybe<string>
  spells: Maybe<List<Record<SpellCombined>>>
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

export function Sheets (props: SheetsProps) {
  const maybeArcaneEnergy = find (pipe (DerivedCharacteristic.A.id, equals<DCIds> ("AE")))
                                 (props.derivedCharacteristics)

  const maybeKarmaPoints = find (pipe (DerivedCharacteristic.A.id, equals<DCIds> ("KP")))
                                (props.derivedCharacteristics)

  return (
    <Page id="sheets">
      <Scroll className="sheet-wrapper">
        <MainSheet {...props} />
        <SkillsSheet {...props} />
        <CombatSheet {...props} />
        {isBookEnabled (Pair (props.books, HeroModel.A.rules (props.hero))) ("US25208")
          ? <CombatSheetZones {...props} />
          : null}
        <BelongingsSheet {...props} />
        {pipe_ (
          maybeArcaneEnergy,
          bindF (DerivedCharacteristic.A.value),
          maybeRNull (() => <SpellsSheet {...props} />)
        )}
        {pipe_ (
          maybeKarmaPoints,
          bindF (DerivedCharacteristic.A.value),
          maybeRNull (() => <LiturgicalChantsSheet {...props} />)
        )}
      </Scroll>
    </Page>
  )
}
