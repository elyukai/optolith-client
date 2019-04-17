import * as React from "react";
import * as Data from "../../Models/Hero/heroTypeHelpers";
import * as View from "../../Models/View/viewTypeHelpers";
import * as Wiki from "../../Models/Wiki/wikiTypeHelpers";
import { AdventurePointsObject } from "../../Selectors/adventurePointsSelectors";
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
  locale: UIMessagesObject
}

export interface SheetsStateProps {
  advantagesActive: Maybe<List<Record<Data.ActiveViewObject<Wiki.Advantage>>>>
  ap: Record<AdventurePointsObject>
  armors: Maybe<List<Record<View.Armor>>>
  armorZones: Maybe<List<Record<View.ArmorZone>>>
  attributes: List<Record<View.AttributeCombined>>
  avatar: Maybe<string>
  checkAttributeValueVisibility: boolean
  combatSpecialAbilities: Maybe<List<Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>
  combatTechniques: Maybe<List<Record<View.CombatTechniqueWithAttackParryBase>>>
  culture: Maybe<Record<Wiki.Culture>>
  derivedCharacteristics: List<Record<Data.SecondaryAttribute>>
  disadvantagesActive: Maybe<List<Record<Data.ActiveViewObject<Wiki.Disadvantage>>>>
  el: Maybe<Record<Wiki.ExperienceLevel>>
  fatePointsModifier: number
  generalsaActive: Maybe<List<string | Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>
  meleeWeapons: Maybe<List<Record<View.MeleeWeapon>>>
  name: Maybe<string>
  professionName: Maybe<string>
  // profession: Maybe<Record<Wiki.Profession>>
  // professionVariant: Maybe<Record<Wiki.ProfessionVariant>>
  profile: Maybe<Record<Data.PersonalData>>
  race: Maybe<Record<Wiki.Race>>
  rangedWeapons: Maybe<List<Record<View.RangedWeapon>>>
  sex: Maybe<Data.Sex>
  shieldsAndParryingWeapons: Maybe<List<Record<View.ShieldOrParryingWeapon>>>
  skills: List<Record<View.SkillCombined>>
  items: Maybe<List<Record<View.Item>>>
  pet: Maybe<Record<Data.PetInstance>>
  purse: Maybe<Record<Data.Purse>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  languagesWikiEntry: Maybe<Record<Wiki.SpecialAbility>>
  languagesStateEntry: Maybe<Record<Data.ActivatableDependent>>
  scriptsWikiEntry: Maybe<Record<Wiki.SpecialAbility>>
  scriptsStateEntry: Maybe<Record<Data.ActivatableDependent>>
  cantrips: Maybe<List<Record<View.CantripCombined>>>
  magicalPrimary: Maybe<string>
  magicalSpecialAbilities: Maybe<List<Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>
  magicalTradition: Maybe<string>
  properties: Maybe<List<string>>
  spells: Maybe<List<Record<View.SpellCombined>>>
  aspects: Maybe<List<string>>
  blessedPrimary: Maybe<string>
  blessedSpecialAbilities: Maybe<List<Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>
  blessedTradition: Maybe<string>
  blessings: Maybe<List<Record<View.BlessingCombined>>>
  liturgicalChants: Maybe<List<Record<View.LiturgicalChantWithRequirements>>>
}

export interface SheetsDispatchProps {
  printToPDF (): void
  switchAttributeValueVisibility (): void
}

export type SheetsProps = SheetsStateProps & SheetsDispatchProps & SheetsOwnProps

export function Sheets (props: SheetsProps) {
  const maybeArcaneEnergy = props.derivedCharacteristics.find (e => e.get ("id") === "AE")

  const maybeKarmaPoints = props.derivedCharacteristics.find (e => e.get ("id") === "KP")

  return (
    <Page id="sheets">
      <Scroll className="sheet-wrapper">
        <MainSheet {...props} />
        <SkillsSheet {...props} />
        <CombatSheet {...props} />
        {props.locale.get ("id") === "de-DE" && <CombatSheetZones {...props} />}
        <BelongingsSheet {...props} />
        {Maybe.maybeToReactNode (
          maybeArcaneEnergy
            .bind (arcaneEnergy => arcaneEnergy.lookup ("value"))
            .then (Just (<SpellsSheet {...props} />))
        )}
        {Maybe.maybeToReactNode (
          maybeKarmaPoints
            .bind (karmaPoints => karmaPoints.lookup ("value"))
            .then (Just (<LiturgicalChantsSheet {...props} />))
        )}
      </Scroll>
    </Page>
  )
}
