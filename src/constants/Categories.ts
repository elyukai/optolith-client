import keyMirror from 'keymirror';

export type Category = ADVANTAGES | ATTRIBUTES | COMBAT_TECHNIQUES | CULTURES | DISADVANTAGES | LITURGIES | PROFESSION_VARIANTS | PROFESSIONS | RACES | SPECIAL_ABILITIES | SPELLS | TALENTS;

export type ADVANTAGES = 'ADVANTAGES';
export const ADVANTAGES = 'ADVANTAGES';
export type ATTRIBUTES = 'ATTRIBUTES';
export const ATTRIBUTES = 'ATTRIBUTES';
export type CHANTS = 'CHANTS';
export const CHANTS = 'CHANTS';
export type COMBAT_TECHNIQUES = 'COMBAT_TECHNIQUES';
export const COMBAT_TECHNIQUES = 'COMBAT_TECHNIQUES';
export type CULTURES = 'CULTURES';
export const CULTURES = 'CULTURES';
export type DISADVANTAGES = 'DISADVANTAGES';
export const DISADVANTAGES = 'DISADVANTAGES';
export type LITURGIES = 'LITURGIES';
export const LITURGIES = 'LITURGIES';
export type PROFESSION_VARIANTS = 'PROFESSION_VARIANTS';
export const PROFESSION_VARIANTS = 'PROFESSION_VARIANTS';
export type PROFESSIONS = 'PROFESSIONS';
export const PROFESSIONS = 'PROFESSIONS';
export type RACES = 'RACES';
export const RACES = 'RACES';
export type SPECIAL_ABILITIES = 'SPECIAL_ABILITIES';
export const SPECIAL_ABILITIES = 'SPECIAL_ABILITIES';
export type SPELLS = 'SPELLS';
export const SPELLS = 'SPELLS';
export type TALENTS = 'TALENTS';
export const TALENTS = 'TALENTS';

interface Categories {
	ADVANTAGES: string;
	ATTRIBUTES: string;
	CHANTS: string;
	COMBAT_TECHNIQUES: string;
	CULTURES: string;
	DISADVANTAGES: string;
	PROFESSION_VARIANTS: string;
	PROFESSIONS: string;
	RACES: string;
	SPECIAL_ABILITIES: string;
	SPELLS: string;
	TALENTS: string;
}

export default Object.assign({}, {
	CHANTS: 'liturgies',
	COMBAT_TECHNIQUES: 'combattech',
	SPELLS: 'spells',
	TALENTS: 'talents'
}, keyMirror({
	ADVANTAGES: null,
	ATTRIBUTES: null,
	CULTURES: null,
	DISADVANTAGES: null,
	PROFESSIONS: null,
	PROFESSION_VARIANTS: null,
	RACES: null,
	SPECIAL_ABILITIES: null
})) as Categories;
