/* TypeScript file generated from Static_Profession.re by genType. */
/* eslint-disable import/first */


import {activatable as Static_Prerequisites_activatable} from './Static_Prerequisites.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {tProfession as Static_Prerequisites_tProfession} from './Static_Prerequisites.gen';

import {t as Ley_IntMap_t} from '../../../src/Data/Ley_IntMap.gen';

import {t as OneOrMany_t} from '../../../src/App/Utilities/OneOrMany.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type nameBySex = { readonly m: string; readonly f: string };
export type NameBySex = nameBySex;

// tslint:disable-next-line:interface-over-type-literal
export type name = 
    { tag: "Const"; value: string }
  | { tag: "BySex"; value: nameBySex };
export type ProfessionName = name;

// tslint:disable-next-line:interface-over-type-literal
export type variantOverride<a> = "Remove" | { tag: "Override"; value: a };
export type VariantOverride<a> = variantOverride<a>;

// tslint:disable-next-line:interface-over-type-literal
export type skillSpecializationOption = OneOrMany_t<number>;
export type SkillSpecializationOption = skillSpecializationOption;

// tslint:disable-next-line:interface-over-type-literal
export type variantSkillSpecializationOption = variantOverride<skillSpecializationOption>;
export type VariantSkillSpecializationOption = variantSkillSpecializationOption;

// tslint:disable-next-line:interface-over-type-literal
export type languageAndScriptOption = number;
export type LanguageAndScriptOption = languageAndScriptOption;

// tslint:disable-next-line:interface-over-type-literal
export type variantLanguageAndScriptOption = variantOverride<languageAndScriptOption>;
export type VariantLanguageAndScriptOption = variantLanguageAndScriptOption;

// tslint:disable-next-line:interface-over-type-literal
export type combatTechniqueSecondOption = { readonly amount: number; readonly value: number };
export type CombatTechniqueSecondOption = combatTechniqueSecondOption;

// tslint:disable-next-line:interface-over-type-literal
export type combatTechniqueOption = {
  readonly amount: number; 
  readonly value: number; 
  readonly second?: combatTechniqueSecondOption; 
  readonly sid: list<number>
};
export type CombatTechniqueOption = combatTechniqueOption;

// tslint:disable-next-line:interface-over-type-literal
export type variantCombatTechniqueOption = variantOverride<combatTechniqueOption>;
export type VariantCombatTechniqueOption = variantCombatTechniqueOption;

// tslint:disable-next-line:interface-over-type-literal
export type cantripOption = { readonly amount: number; readonly sid: list<number> };
export type CantripOption = cantripOption;

// tslint:disable-next-line:interface-over-type-literal
export type curseOption = number;
export type CurseOption = curseOption;

// tslint:disable-next-line:interface-over-type-literal
export type terrainKnowledgeOption = list<number>;
export type TerrainKnowledgeOption = terrainKnowledgeOption;

// tslint:disable-next-line:interface-over-type-literal
export type skillOption = { readonly gr?: number; readonly value: number };
export type SkillOption = skillOption;

// tslint:disable-next-line:interface-over-type-literal
export type options = {
  readonly skillSpecialization?: skillSpecializationOption; 
  readonly languageScript?: languageAndScriptOption; 
  readonly combatTechnique?: combatTechniqueOption; 
  readonly cantrip?: cantripOption; 
  readonly curse?: curseOption; 
  readonly terrainKnowledge?: terrainKnowledgeOption; 
  readonly skill?: skillOption; 
  readonly guildMageUnfamiliarSpell: boolean
};
export type ProfessionOptions = options;

// tslint:disable-next-line:interface-over-type-literal
export type variantOptions = {
  readonly skillSpecialization?: variantSkillSpecializationOption; 
  readonly languageScript?: variantLanguageAndScriptOption; 
  readonly combatTechnique?: variantCombatTechniqueOption; 
  readonly cantrip?: cantripOption; 
  readonly curse?: curseOption; 
  readonly terrainKnowledge?: terrainKnowledgeOption; 
  readonly skill?: skillOption; 
  readonly guildMageUnfamiliarSpell: boolean
};
export type ProfessionVariantOptions = variantOptions;

// tslint:disable-next-line:interface-over-type-literal
export type variant = {
  readonly id: number; 
  readonly name: name; 
  readonly cost: number; 
  readonly prerequisites: Static_Prerequisites_tProfession; 
  readonly options: variantOptions; 
  readonly specialAbilities: list<Static_Prerequisites_activatable>; 
  readonly combatTechniques: Ley_IntMap_t<number>; 
  readonly skills: Ley_IntMap_t<number>; 
  readonly spells: Ley_IntMap_t<OneOrMany_t<number>>; 
  readonly liturgicalChants: Ley_IntMap_t<OneOrMany_t<number>>; 
  readonly blessings: list<number>; 
  readonly precedingText?: string; 
  readonly fullText?: string; 
  readonly concludingText?: string; 
  readonly errata: list<Static_Erratum_t>
};
export type ProfessionVariant = variant;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: name; 
  readonly subname?: name; 
  readonly cost: number; 
  readonly prerequisites: Static_Prerequisites_tProfession; 
  readonly prerequisitesStart?: string; 
  readonly options: options; 
  readonly specialAbilities: list<Static_Prerequisites_activatable>; 
  readonly combatTechniques: Ley_IntMap_t<number>; 
  readonly skills: Ley_IntMap_t<number>; 
  readonly spells: Ley_IntMap_t<OneOrMany_t<number>>; 
  readonly liturgicalChants: Ley_IntMap_t<OneOrMany_t<number>>; 
  readonly blessings: list<number>; 
  readonly suggestedAdvantages: list<number>; 
  readonly suggestedAdvantagesText?: string; 
  readonly suggestedDisadvantages: list<number>; 
  readonly suggestedDisadvantagesText?: string; 
  readonly unsuitableAdvantages: list<number>; 
  readonly unsuitableAdvantagesText?: string; 
  readonly unsuitableDisadvantages: list<number>; 
  readonly unsuitableDisadvantagesText?: string; 
  readonly variants: Ley_IntMap_t<variant>; 
  readonly isVariantRequired: boolean; 
  readonly gr: number; 
  readonly sgr: number; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type Profession = t;
