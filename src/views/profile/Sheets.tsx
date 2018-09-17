import * as React from 'react';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';
import * as Data from '../../types/data';
import { UIMessagesObject } from '../../types/ui';
import * as View from '../../types/view';
import * as Wiki from '../../types/wiki';
import { Just, List, Maybe, Record } from '../../utils/dataUtils';
import { BelongingsSheet } from './BelongingsSheet';
import { CombatSheet } from './CombatSheet';
import { CombatSheetZones } from './CombatSheetZones';
import { LiturgiesSheet } from './LiturgiesSheet';
import { MainSheet } from './MainSheet';
import { SkillsSheet } from './SkillsSheet';
import { SpellsSheet } from './SpellsSheet';

export interface SheetsOwnProps {
  locale: UIMessagesObject;
}

export interface SheetsStateProps {
  advantagesActive: Maybe<List<Record<Data.ActiveViewObject<Wiki.Advantage>>>>;
  ap: Record<AdventurePointsObject>;
  armors: Maybe<List<Record<View.Armor>>>;
  armorZones: Maybe<List<Record<View.ArmorZone>>>;
  attributes: List<Record<View.AttributeCombined>>;
  avatar: Maybe<string>;
  checkAttributeValueVisibility: boolean;
  combatSpecialAbilities: Maybe<List<Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>;
  combatTechniques: Maybe<List<Record<View.CombatTechniqueWithAttackParryBase>>>;
  culture: Maybe<Record<Wiki.Culture>>;
  derivedCharacteristics: List<Record<Data.SecondaryAttribute>>;
  disadvantagesActive: Maybe<List<Record<Data.ActiveViewObject<Wiki.Disadvantage>>>>;
  el: Maybe<Record<Wiki.ExperienceLevel>>;
  fatePointsModifier: number;
  generalsaActive: Maybe<List<string | Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>;
  meleeWeapons: Maybe<List<Record<View.MeleeWeapon>>>;
  name: Maybe<string>;
  professionName: Maybe<string>;
  // profession: Maybe<Record<Wiki.Profession>>;
  // professionVariant: Maybe<Record<Wiki.ProfessionVariant>>;
  profile: Maybe<Record<Data.PersonalData>>;
  race: Maybe<Record<Wiki.Race>>;
  rangedWeapons: Maybe<List<Record<View.RangedWeapon>>>;
  sex: Maybe<Data.Sex>;
  shieldsAndParryingWeapons: Maybe<List<Record<View.ShieldOrParryingWeapon>>>;
  skills: List<Record<View.SkillCombined>>;
  items: Maybe<List<Record<View.Item>>>;
  pet: Maybe<Record<Data.PetInstance>>;
  purse: Maybe<Record<Data.Purse>>;
  totalPrice: Maybe<number>;
  totalWeight: Maybe<number>;
  languagesWikiEntry: Maybe<Record<Wiki.SpecialAbility>>;
  languagesStateEntry: Maybe<Record<Data.ActivatableDependent>>;
  scriptsWikiEntry: Maybe<Record<Wiki.SpecialAbility>>;
  scriptsStateEntry: Maybe<Record<Data.ActivatableDependent>>;
  cantrips: List<Record<Wiki.Cantrip>>;
  magicalPrimary: Maybe<string>;
  magicalSpecialAbilities: Maybe<List<Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>;
  magicalTradition: Maybe<string>;
  properties: Maybe<List<string>>;
  spells: Maybe<List<Record<View.SpellCombined>>>;
  aspects: Maybe<List<string>>;
  blessedPrimary: Maybe<string>;
  blessedSpecialAbilities: Maybe<List<Record<Data.ActiveViewObject<Wiki.SpecialAbility>>>>;
  blessedTradition: Maybe<string>;
  blessings: List<Record<Wiki.Blessing>>;
  liturgicalChants: List<Record<View.LiturgicalChantWithRequirements>>;
}

export interface SheetsDispatchProps {
  printToPDF (): void;
  switchAttributeValueVisibility (): void;
}

export type SheetsProps = SheetsStateProps & SheetsDispatchProps & SheetsOwnProps;

export const Sheets = (props: SheetsProps) => {
  const maybeArcaneEnergy = props.derivedCharacteristics.find (e => e.get ('id') === 'AE');

  const maybeKarmaPoints = props.derivedCharacteristics.find (e => e.get ('id') === 'KP');

  return (
    <Page id="sheets">
      <Scroll className="sheet-wrapper">
        <MainSheet {...props} />
        <SkillsSheet {...props} />
        <CombatSheet {...props} />
        {props.locale.get ('id') === 'de-DE' && <CombatSheetZones {...props} />}
        <BelongingsSheet {...props} />
        {Maybe.fromMaybe
          (<></>)
          (maybeArcaneEnergy
            .bind (arcaneEnergy => arcaneEnergy.lookup ('value'))
            .then (Just (<SpellsSheet {...props} />)))}
        {Maybe.fromMaybe
          (<></>)
          (maybeKarmaPoints
            .bind (karmaPoints => karmaPoints.lookup ('value'))
            .then (Just (<LiturgiesSheet {...props} />)))}
      </Scroll>
    </Page>
  );
};
