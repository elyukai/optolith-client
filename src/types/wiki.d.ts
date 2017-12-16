import * as Reusable from './reusable.d';
import * as Categories from '../constants/Categories';
import { AllRequirementTypes } from './reusable.d';

export interface WikiEntryByCategory {
	'ADVANTAGES': Advantage;
	'ATTRIBUTES': Attribute;
	'BLESSINGS': Blessing;
	'CANTRIPS': Cantrip;
	'COMBAT_TECHNIQUES': CombatTechnique;
	'CULTURES': Culture;
	'DISADVANTAGES': Disadvantage;
	'LITURGIES': LiturgicalChant;
	'PROFESSIONS': Profession;
	'PROFESSION_VARIANTS': ProfessionVariant;
	'RACES': Race;
	'RACE_VARIANTS': RaceVariant;
	'SPECIAL_ABILITIES': SpecialAbility;
	'SPELLS': Spell;
	'TALENTS': Skill;
}

export type WikiEntriesWithGroups = CombatTechnique | LiturgicalChant | SpecialAbility | Spell | Skill;

export type SkillishEntry = Spell | LiturgicalChant | Skill | CombatTechnique;

export interface Book {
	readonly id: string;
	readonly short: string;
	readonly name: string;
}

export interface SourceLink {
	readonly id: string;
	readonly page: number;
}

export interface ExperienceLevel {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly maxAttributeValue: number;
	readonly maxSkillRating: number;
	readonly maxCombatTechniqueRating: number;
	readonly maxTotalAttributeValues: number;
	readonly maxSpellsLiturgies: number;
	readonly maxUnfamiliarSpells: number;
}

export interface Race {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly lp: number;
	readonly spi: number;
	readonly tou: number;
	readonly mov: number;
	readonly attributeAdjustments: [number, string][];
	readonly attributeAdjustmentsSelection: [number, string[]];
	readonly attributeAdjustmentsText: string;
	readonly commonCultures: string[];
	readonly automaticAdvantages: string[];
	readonly automaticAdvantagesCost: [number, number, number];
	readonly automaticAdvantagesText: string;
	readonly stronglyRecommendedAdvantages: string[];
	readonly stronglyRecommendedAdvantagesText: string;
	readonly stronglyRecommendedDisadvantages: string[];
	readonly stronglyRecommendedDisadvantagesText: string;
	readonly commonAdvantages: string[];
	readonly commonAdvantagesText?: string;
	readonly commonDisadvantages: string[];
	readonly commonDisadvantagesText?: string;
	readonly uncommonAdvantages: string[];
	readonly uncommonAdvantagesText?: string;
	readonly uncommonDisadvantages: string[];
	readonly uncommonDisadvantagesText?: string;
	readonly hairColors?: number[];
	readonly eyeColors?: number[];
	readonly sizeBase?: number;
	readonly sizeRandom?: Die[];
	readonly weightBase: number;
	readonly weightRandom: Die[];
	readonly variants: string[];
	readonly category: Categories.RACES;
	readonly src: SourceLink[];
}

export interface Die {
	readonly sides: number;
	readonly amount: number;
}

export interface RaceVariant {
	readonly id: string;
	readonly name: string;
	readonly commonCultures: string[];
	readonly commonAdvantages: string[];
	readonly commonAdvantagesText?: string;
	readonly commonDisadvantages: string[];
	readonly commonDisadvantagesText?: string;
	readonly uncommonAdvantages: string[];
	readonly uncommonAdvantagesText?: string;
	readonly uncommonDisadvantages: string[];
	readonly uncommonDisadvantagesText?: string;
	readonly hairColors?: number[];
	readonly eyeColors?: number[];
	readonly sizeBase?: number;
	readonly sizeRandom?: Die[];
	readonly category: Categories.RACE_VARIANTS;
}

export interface Culture {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly socialTiers: number[];
	readonly areaKnowledge: string;
	readonly areaKnowledgeShort: string;
	readonly commonProfessions: CommonProfession[];
	readonly commonMundaneProfessions?: string;
	readonly commonMagicProfessions?: string;
	readonly commonBlessedProfessions?: string;
	readonly commonAdvantages: string[];
	readonly commonAdvantagesText?: string;
	readonly commonDisadvantages: string[];
	readonly commonDisadvantagesText?: string;
	readonly uncommonAdvantages: string[];
	readonly uncommonAdvantagesText?: string;
	readonly uncommonDisadvantages: string[];
	readonly uncommonDisadvantagesText?: string;
	readonly commonSkills: string[];
	readonly uncommonSkills: string[];
	readonly skills: IncreaseSkill[];
	readonly category: Categories.CULTURES;
	readonly src: SourceLink[];
	/**
	 * Markdown supported.
	 */
	readonly commonNames: string;
}

export type CommonProfession = boolean | CommonProfessionObject;

export interface CommonProfessionObject {
	readonly list: (string | number)[];
	readonly reverse: boolean;
}

export interface SpecialisationSelection {
	readonly id: 'SPECIALISATION';
	readonly sid: string | string[];
	readonly active?: boolean;
}

export interface RemoveSpecialisationSelection {
	readonly id: 'SPECIALISATION';
	readonly active: boolean;
}

export type VariantSpecialisationSelection = SpecialisationSelection | RemoveSpecialisationSelection;

export interface LanguagesScriptsSelection {
	readonly id: 'LANGUAGES_SCRIPTS';
	readonly value: number;
}

export interface CombatTechniquesSelection {
	readonly id: 'COMBAT_TECHNIQUES';
	readonly amount: number;
	readonly value: number;
	readonly sid: string[];
}

export interface RemoveCombatTechniquesSelection {
	readonly id: 'COMBAT_TECHNIQUES';
	readonly active: boolean;
}

export type VariantCombatTechniquesSelection = CombatTechniquesSelection | RemoveCombatTechniquesSelection;

export interface CombatTechniquesSecondSelection {
	readonly id: 'COMBAT_TECHNIQUES_SECOND';
	readonly amount: number;
	readonly value: number;
	readonly sid: string[];
}

export interface RemoveCombatTechniquesSecondSelection {
	readonly id: 'COMBAT_TECHNIQUES_SECOND';
	readonly active: boolean;
}

export type VariantCombatTechniquesSecondSelection = CombatTechniquesSecondSelection | RemoveCombatTechniquesSecondSelection;

export interface CantripsSelection {
	readonly id: 'CANTRIPS';
	readonly amount: number;
	readonly sid: string[];
}

export interface CursesSelection {
	readonly id: 'CURSES';
	readonly value: number;
}

export interface SkillsSelection {
	readonly id: 'SKILLS';
	/**
	 * If specified, only choose from skills of the specified group.
	 */
	readonly gr?: number;
	/**
	 * The AP value the user can spend.
	 */
	readonly value: number;
}

export type ProfessionSelectionIds = 'SPECIALISATION' | 'LANGUAGES_SCRIPTS' | 'COMBAT_TECHNIQUES' | 'COMBAT_TECHNIQUES_SECOND' | 'CANTRIPS' | 'CURSES' | 'SKILLS';
export type ProfessionSelection = SpecialisationSelection | LanguagesScriptsSelection | CombatTechniquesSelection | CombatTechniquesSecondSelection | CantripsSelection | CursesSelection | SkillsSelection;
export type ProfessionVariantSelection = VariantSpecialisationSelection | LanguagesScriptsSelection | VariantCombatTechniquesSelection | VariantCombatTechniquesSecondSelection | CantripsSelection | CursesSelection | SkillsSelection;
export type ProfessionSelections = ProfessionSelection[];
export type ProfessionVariantSelections = ProfessionVariantSelection[];

export interface ProfessionNameForSexes {
	readonly m: string;
	readonly f: string;
}

export interface Profession {
	readonly id: string;
	readonly name: string | ProfessionNameForSexes;
	readonly subname?: string | ProfessionNameForSexes;
	readonly ap: number;
	readonly apOfActivatables: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly prerequisites: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	readonly prerequisitesStart?: string;
	readonly prerequisitesEnd?: string;
	readonly selections: ProfessionSelections;
	readonly specialAbilities: Reusable.ProfessionRequiresActivatableObject[];
	readonly combatTechniques: IncreaseSkill[];
	readonly skills: IncreaseSkill[];
	readonly spells: IncreaseSkill[];
	readonly liturgicalChants: IncreaseSkill[];
	readonly blessings: string[];
	readonly suggestedAdvantages: string[];
	readonly suggestedAdvantagesText?: string;
	readonly suggestedDisadvantages: string[];
	readonly suggestedDisadvantagesText?: string;
	readonly unsuitableAdvantages: string[];
	readonly unsuitableAdvantagesText?: string;
	readonly unsuitableDisadvantages: string[];
	readonly unsuitableDisadvantagesText?: string;
	readonly isVariantRequired?: boolean;
	readonly variants: string[];
	readonly category: Categories.PROFESSIONS;
	readonly gr: number;
	/**
	 * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the Twelve Gods" or "Fighter".
	 */
	readonly subgr: number;
	readonly src: SourceLink[];
}

export interface ProfessionVariant {
	readonly id: string;
	readonly name: string | ProfessionNameForSexes;
	readonly ap: number;
	readonly apOfActivatables: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly prerequisites: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	readonly selections: ProfessionVariantSelections;
	readonly specialAbilities: Reusable.ProfessionRequiresActivatableObject[];
	readonly combatTechniques: IncreaseSkill[];
	readonly skills: IncreaseSkill[];
	readonly spells: IncreaseSkill[];
	readonly liturgicalChants: IncreaseSkill[];
	readonly precedingText?: string;
	readonly fullText?: string;
	readonly concludingText?: string;
	readonly category: Categories.PROFESSION_VARIANTS;
}

export interface IncreaseSkill {
	id: string;
	value: number;
}

export interface SelectionObject {
	id: string | number;
	name: string;
	cost?: number;
	req?: AllRequirementTypes[];
	prerequisites?: AllRequirementTypes[];
}

export type ProfessionDependencyObject = Reusable.SexRequirement | Reusable.RaceRequirement | Reusable.CultureRequirement;
export type AllRequirementObjects = Reusable.CultureRequirement | Reusable.RaceRequirement | Reusable.RequiresActivatableObject | Reusable.RequiresIncreasableObject | Reusable.RequiresPrimaryAttribute | Reusable.SexRequirement;
export type AllRequirements = 'RCP' | Reusable.CultureRequirement | Reusable.RaceRequirement | Reusable.RequiresActivatableObject | Reusable.RequiresIncreasableObject | Reusable.RequiresPrimaryAttribute | Reusable.SexRequirement;
export type ActivatablePrerequisites = ('RCP' | AllRequirementTypes)[];

interface ActivatableBase {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input?: string;
	readonly max?: number;
	readonly prerequisites: ActivatablePrerequisites | Map<number, ActivatablePrerequisites>;
	readonly prerequisitesText?: string;
	/**
	 * 0-based index as key!
	 */
	readonly prerequisitesTextIndex: Map<number, string | false>;
	readonly prerequisitesTextStart?: string;
	readonly prerequisitesTextEnd?: string;
	readonly tiers?: number;
	readonly select?: SelectionObject[];
	readonly gr?: number;
}

interface AdvantageDisadvantageBase extends ActivatableBase {
	readonly gr?: undefined;
	readonly rules: string;
	readonly range?: string;
	readonly actions?: string;
	readonly apValue?: string;
	readonly apValueAppend?: string;
	readonly src: SourceLink[];
}

export interface Advantage extends AdvantageDisadvantageBase {
	readonly category: Categories.ADVANTAGES;
}

export interface Disadvantage extends AdvantageDisadvantageBase {
	readonly category: Categories.DISADVANTAGES;
}

export interface SpecialAbility extends ActivatableBase {
	readonly category: Categories.SPECIAL_ABILITIES;
	readonly extended?: (string | string[])[];
	readonly nameInWiki?: string;
	readonly gr: number;
	readonly subgr?: number;
	readonly combatTechniques?: string;
	readonly rules?: string;
	readonly effect?: string;
	readonly volume?: string;
	readonly penalty?: string;
	readonly aeCost?: string;
	readonly protectiveCircle?: string;
	readonly wardingCircle?: string;
	readonly bindingCost?: string;
	readonly property?: number | string;
	readonly aspect?: number | string;
	readonly apValue?: string;
	readonly apValueAppend?: string;
	readonly src: SourceLink[];
}

export interface Attribute {
	readonly id: string;
	readonly name: string;
	readonly category: Categories.ATTRIBUTES;
	readonly short: string;
}

export interface CombatTechnique {
	readonly id: string;
	readonly name: string;
	readonly category: Categories.COMBAT_TECHNIQUES;
	readonly gr: number;
	readonly ic: number;
	readonly bf: number;
	readonly primary: string[];
	readonly special?: string;
	readonly src: SourceLink[];
}

export interface LiturgicalChant {
	readonly id: string;
	readonly name: string;
	readonly aspects: number[];
	readonly category: Categories.LITURGIES;
	readonly check: [string, string, string];
	readonly checkmod?: "SPI" | "TOU";
	readonly gr: number;
	readonly ic: number;
	readonly tradition: number[];
	readonly effect: string;
	readonly castingTime: string;
	readonly castingTimeShort: string;
	readonly cost: string;
	readonly costShort: string;
	readonly range: string;
	readonly rangeShort: string;
	readonly duration: string;
	readonly durationShort: string;
	readonly target: string;
	readonly src: SourceLink[];
}

export interface Blessing {
	readonly id: string;
	readonly name: string;
	readonly aspects: number[];
	readonly tradition: number[];
	readonly prerequisites: AllRequirementTypes[];
	readonly category: Categories.BLESSINGS;
	readonly effect: string;
	readonly range: string;
	readonly duration: string;
	readonly target: string;
	readonly src: SourceLink[];
}

export interface Spell {
	readonly id: string;
	readonly name: string;
	readonly category: Categories.SPELLS;
	readonly check: [string, string, string];
	readonly checkmod?: "SPI" | "TOU";
	readonly gr: number;
	readonly ic: number;
	readonly property: number;
	readonly tradition: number[];
	readonly subtradition: number[];
	readonly prerequisites: AllRequirementTypes[];
	readonly effect: string;
	readonly castingTime: string;
	readonly castingTimeShort: string;
	readonly cost: string;
	readonly costShort: string;
	readonly range: string;
	readonly rangeShort: string;
	readonly duration: string;
	readonly durationShort: string;
	readonly target: string;
	readonly src: SourceLink[];
}

export interface SkillExtension extends SelectionObject {
	readonly target: string;
	readonly tier: 1 | 2 | 3;
	readonly effect: string;
}

export interface Cantrip {
	readonly id: string;
	readonly name: string;
	readonly property: number;
	readonly tradition: number[];
	readonly prerequisites: AllRequirementTypes[];
	readonly category: Categories.CANTRIPS;
	readonly effect: string;
	readonly range: string;
	readonly duration: string;
	readonly target: string;
	readonly note?: string;
	readonly src: SourceLink[];
}

export interface Skill {
	readonly id: string;
	readonly name: string;
	readonly category: Categories.TALENTS;
	readonly check: string[];
	readonly encumbrance: string;
	readonly gr: number;
	readonly ic: number;
	readonly applications?: Application[];
	readonly applicationsInput?: string;
	readonly tools?: string;
	readonly quality?: string;
	readonly failed?: string;
	readonly critical?: string;
	readonly botch?: string;
	readonly src?: string;
}

export interface Application {
	readonly id: number;
	readonly name: string;
}

export interface ItemTemplate {
	readonly id: string;
	readonly name: string;
	readonly addPenalties?: boolean;
	readonly ammunition?: string;
	readonly amount?: number;
	readonly armorType?: number;
	readonly at?: number;
	readonly combatTechnique?: string;
	readonly damageBonus?: PrimaryAttributeDamageThreshold;
	readonly damageDiceNumber?: number;
	readonly damageDiceSides?: number;
	readonly damageFlat?: number;
	readonly enc?: number;
	readonly forArmorZoneOnly?: boolean;
	readonly gr: number;
	readonly improvisedWeaponGroup?: number;
	readonly iniMod?: number;
	readonly isParryingWeapon?: boolean;
	readonly isTemplateLocked: boolean;
	readonly isTwoHandedWeapon?: boolean;
	readonly length?: number;
	readonly loss?: number;
	readonly movMod?: number;
	readonly pa?: number;
	readonly price?: number;
	readonly pro?: number;
	readonly range?: [number, number, number];
	readonly reach?: number;
	readonly reloadTime?: number;
	readonly stabilityMod?: number;
	readonly stp?: number;
	readonly template?: string;
	readonly weight?: number;
	readonly where?: string;
	readonly note?: string;
	readonly rules?: string;
	readonly advantage?: string;
	readonly disadvantage?: string;
	readonly src?: SourceLink[];
}

export interface PrimaryAttributeDamageThreshold {
	readonly primary?: string;
	readonly threshold: number | number[];
}
