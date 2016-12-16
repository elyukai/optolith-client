export { default as Activatable } from './data/Activatable';
export { default as Advantage } from './data/Advantage';
export { default as Attribute } from './data/Attribute';
export { default as CombatTechnique } from './data/CombatTechnique';
export { default as Core } from './data/Core';
export { default as Culture } from './data/Culture';
export { default as Dependent } from './data/Dependent';
export { default as Disadvantage } from './data/Disadvantage';
export { default as Increasable } from './data/Increasable';
export { default as Item } from './data/Item';
export { default as Liturgy } from './data/Liturgy';
export { default as Profession } from './data/Profession';
export { default as ProfessionVariant } from './data/ProfessionVariant';
export { default as Race } from './data/Race';
export { default as Skill } from './data/Skill';
export { default as SpecialAbility } from './data/SpecialAbility';
export { default as Spell } from './data/Spell';
export { default as Talent } from './data/Talent';

export const fixIDs = (list, prefix, index = 0) => {
	return list.map(e => {
		e[index] = `${prefix}_${e[index]}`;
		return e;
	});
};
