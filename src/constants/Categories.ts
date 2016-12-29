import keyMirror from 'keymirror';

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
