/* TypeScript file generated from Static.re by genType. */
/* eslint-disable import/first */


import {group as Static_Skill_group} from './Static_Skill.gen';

import {t as Ley_IntMap_t} from '../../../src/Data/Ley_IntMap.gen';

import {t as Ley_StrMap_t} from '../../../src/Data/Ley_StrMap.gen';

import {t as Static_Advantage_t} from './Static_Advantage.gen';

import {t as Static_AnimistForce_t} from './Static_AnimistForce.gen';

import {t as Static_Attribute_t} from './Static_Attribute.gen';

import {t as Static_BlessedTradition_t} from './Static_BlessedTradition.gen';

import {t as Static_Blessing_t} from './Static_Blessing.gen';

import {t as Static_Cantrip_t} from './Static_Cantrip.gen';

import {t as Static_CombatTechnique_t} from './Static_CombatTechnique.gen';

import {t as Static_Condition_t} from './Static_Condition.gen';

import {t as Static_Culture_t} from './Static_Culture.gen';

import {t as Static_Curse_t} from './Static_Curse.gen';

import {t as Static_DerivedCharacteristic_t} from './Static_DerivedCharacteristic.gen';

import {t as Static_Disadvantage_t} from './Static_Disadvantage.gen';

import {t as Static_DominationRitual_t} from './Static_DominationRitual.gen';

import {t as Static_ElvenMagicalSong_t} from './Static_ElvenMagicalSong.gen';

import {t as Static_EquipmentPackage_t} from './Static_EquipmentPackage.gen';

import {t as Static_ExperienceLevel_t} from './Static_ExperienceLevel.gen';

import {t as Static_FocusRule_t} from './Static_FocusRule.gen';

import {t as Static_GeodeRitual_t} from './Static_GeodeRitual.gen';

import {t as Static_Item_t} from './Static_Item.gen';

import {t as Static_LiturgicalChant_t} from './Static_LiturgicalChant.gen';

import {t as Static_MagicalDance_t} from './Static_MagicalDance.gen';

import {t as Static_MagicalMelody_t} from './Static_MagicalMelody.gen';

import {t as Static_MagicalTradition_t} from './Static_MagicalTradition.gen';

import {t as Static_Messages_t} from './Static_Messages.gen';

import {t as Static_OptionalRule_t} from './Static_OptionalRule.gen';

import {t as Static_Pact_t} from './Static_Pact.gen';

import {t as Static_Profession_t} from './Static_Profession.gen';

import {t as Static_Publication_t} from './Static_Publication.gen';

import {t as Static_Race_t} from './Static_Race.gen';

import {t as Static_RogueSpell_t} from './Static_RogueSpell.gen';

import {t as Static_SelectOption_t} from './Static_SelectOption.gen';

import {t as Static_Skill_t} from './Static_Skill.gen';

import {t as Static_SpecialAbility_t} from './Static_SpecialAbility.gen';

import {t as Static_Spell_t} from './Static_Spell.gen';

import {t as Static_State_t} from './Static_State.gen';

import {t as Static_ZibiljaRitual_t} from './Static_ZibiljaRitual.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly advantages: Ley_IntMap_t<Static_Advantage_t>; 
  readonly animistForces: Ley_IntMap_t<Static_AnimistForce_t>; 
  readonly arcaneBardTraditions: Ley_IntMap_t<string>; 
  readonly arcaneDancerTraditions: Ley_IntMap_t<string>; 
  readonly armorTypes: Ley_IntMap_t<string>; 
  readonly aspects: Ley_IntMap_t<string>; 
  readonly attributes: Ley_IntMap_t<Static_Attribute_t>; 
  readonly blessedTraditions: Ley_IntMap_t<Static_BlessedTradition_t>; 
  readonly blessings: Ley_IntMap_t<Static_Blessing_t>; 
  readonly brews: Ley_IntMap_t<string>; 
  readonly cantrips: Ley_IntMap_t<Static_Cantrip_t>; 
  readonly combatSpecialAbilityGroups: Ley_IntMap_t<string>; 
  readonly combatTechniqueGroups: Ley_IntMap_t<string>; 
  readonly combatTechniques: Ley_IntMap_t<Static_CombatTechnique_t>; 
  readonly conditions: Ley_IntMap_t<Static_Condition_t>; 
  readonly cultures: Ley_IntMap_t<Static_Culture_t>; 
  readonly curses: Ley_IntMap_t<Static_Curse_t>; 
  readonly derivedCharacteristics: Ley_StrMap_t<Static_DerivedCharacteristic_t>; 
  readonly disadvantages: Ley_IntMap_t<Static_Disadvantage_t>; 
  readonly dominationRituals: Ley_IntMap_t<Static_DominationRitual_t>; 
  readonly elvenMagicalSongs: Ley_IntMap_t<Static_ElvenMagicalSong_t>; 
  readonly items: Ley_IntMap_t<Static_Item_t>; 
  readonly equipmentGroups: Ley_IntMap_t<string>; 
  readonly equipmentPackages: Ley_IntMap_t<Static_EquipmentPackage_t>; 
  readonly experienceLevels: Ley_IntMap_t<Static_ExperienceLevel_t>; 
  readonly eyeColors: Ley_IntMap_t<string>; 
  readonly focusRules: Ley_IntMap_t<Static_FocusRule_t>; 
  readonly geodeRituals: Ley_IntMap_t<Static_GeodeRitual_t>; 
  readonly hairColors: Ley_IntMap_t<string>; 
  readonly liturgicalChantEnhancements: Ley_IntMap_t<Static_SelectOption_t>; 
  readonly liturgicalChantGroups: Ley_IntMap_t<string>; 
  readonly liturgicalChants: Ley_IntMap_t<Static_LiturgicalChant_t>; 
  readonly magicalDances: Ley_IntMap_t<Static_MagicalDance_t>; 
  readonly magicalMelodies: Ley_IntMap_t<Static_MagicalMelody_t>; 
  readonly magicalTraditions: Ley_IntMap_t<Static_MagicalTradition_t>; 
  readonly messages: Static_Messages_t; 
  readonly optionalRules: Ley_IntMap_t<Static_OptionalRule_t>; 
  readonly pacts: Ley_IntMap_t<Static_Pact_t>; 
  readonly professions: Ley_IntMap_t<Static_Profession_t>; 
  readonly properties: Ley_IntMap_t<string>; 
  readonly publications: Ley_StrMap_t<Static_Publication_t>; 
  readonly races: Ley_IntMap_t<Static_Race_t>; 
  readonly reaches: Ley_IntMap_t<string>; 
  readonly rogueSpells: Ley_IntMap_t<Static_RogueSpell_t>; 
  readonly skillGroups: Ley_IntMap_t<Static_Skill_group>; 
  readonly skills: Ley_IntMap_t<Static_Skill_t>; 
  readonly socialStatuses: Ley_IntMap_t<string>; 
  readonly specialAbilities: Ley_IntMap_t<Static_SpecialAbility_t>; 
  readonly specialAbilityGroups: Ley_IntMap_t<string>; 
  readonly spellEnhancements: Ley_IntMap_t<Static_SelectOption_t>; 
  readonly spellGroups: Ley_IntMap_t<string>; 
  readonly spells: Ley_IntMap_t<Static_Spell_t>; 
  readonly states: Ley_IntMap_t<Static_State_t>; 
  readonly subjects: Ley_IntMap_t<string>; 
  readonly tribes: Ley_IntMap_t<string>; 
  readonly zibiljaRituals: Ley_IntMap_t<Static_ZibiljaRitual_t>
};
export type Static = t;

// tslint:disable-next-line:interface-over-type-literal
export type activatable = 
    { tag: "Advantage"; value: Static_Advantage_t }
  | { tag: "Disadvantage"; value: Static_Disadvantage_t }
  | { tag: "SpecialAbility"; value: Static_SpecialAbility_t };
export type Activatable = activatable;
