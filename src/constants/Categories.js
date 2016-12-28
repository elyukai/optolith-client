import keyMirror from 'keymirror';

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
}));
