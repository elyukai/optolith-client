import * as React from 'react';
import { translate } from '../../utils/I18n';
import { sort } from '../../utils/ListUtils';

export function CombatSheetStates() {
	const conditions = sort([
		{id: 1, name: translate('charactersheet.combat.conditionsstates.conditions.animosity')},
		{id: 2, name: translate('charactersheet.combat.conditionsstates.conditions.encumbrance')},
		{id: 3, name: translate('charactersheet.combat.conditionsstates.conditions.intoxicated')},
		{id: 4, name: translate('charactersheet.combat.conditionsstates.conditions.stupor')},
		{id: 5, name: translate('charactersheet.combat.conditionsstates.conditions.rapture')},
		{id: 6, name: translate('charactersheet.combat.conditionsstates.conditions.fear')},
		{id: 7, name: translate('charactersheet.combat.conditionsstates.conditions.paralysis')},
		{id: 8, name: translate('charactersheet.combat.conditionsstates.conditions.pain')},
		{id: 9, name: translate('charactersheet.combat.conditionsstates.conditions.confusion')}
	]);
	const statesSecond = sort([
		{id: 1, name: translate('charactersheet.combat.conditionsstates.states.immobilized')},
		{id: 2, name: translate('charactersheet.combat.conditionsstates.states.unconscious')},
		{id: 3, name: translate('charactersheet.combat.conditionsstates.states.blind')},
		{id: 4, name: translate('charactersheet.combat.conditionsstates.states.bloodlust')},
		{id: 5, name: translate('charactersheet.combat.conditionsstates.states.burning')},
		{id: 6, name: translate('charactersheet.combat.conditionsstates.states.cramped')},
		{id: 7, name: translate('charactersheet.combat.conditionsstates.states.bound')},
		{id: 8, name: translate('charactersheet.combat.conditionsstates.states.incapacitated')},
		{id: 9, name: translate('charactersheet.combat.conditionsstates.states.diseased')},
		{id: 10, name: translate('charactersheet.combat.conditionsstates.states.prone')},
		{id: 11, name: translate('charactersheet.combat.conditionsstates.states.misfortune')},
		{id: 12, name: translate('charactersheet.combat.conditionsstates.states.rage')},
		{id: 13, name: translate('charactersheet.combat.conditionsstates.states.mute')},
		{id: 14, name: translate('charactersheet.combat.conditionsstates.states.deaf')},
		{id: 15, name: translate('charactersheet.combat.conditionsstates.states.surprised')},
		{id: 16, name: translate('charactersheet.combat.conditionsstates.states.badsmell')},
		{id: 17, name: translate('charactersheet.combat.conditionsstates.states.invisible')},
		{id: 18, name: translate('charactersheet.combat.conditionsstates.states.poisoned')},
		{id: 19, name: translate('charactersheet.combat.conditionsstates.states.petrified')}
	]);
	const statesFirst = statesSecond.splice(0, 9);
	return (
		<div className="status">
			<div className="status-tiers">
				<header><h4>{translate('charactersheet.combat.conditionsstates.conditions')}</h4><div>I</div><div>II</div><div>III</div><div>IV</div></header>
				{conditions.map(e => {
					return (
						<div key={e.id}><span>{e.name}</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
					);
				})}
			</div>
			<div className="status-effects">
				<header><h4>{translate('charactersheet.combat.conditionsstates.states')}</h4></header>
				{statesFirst.map(e => {
					return (
						<div key={e.id}><span>{e.name}</span><div><div></div></div></div>
					);
				})}
			</div>
			<div className="status-effects">
				{statesSecond.map(e => {
					return (
						<div key={e.id}><span>{e.name}</span><div><div></div></div></div>
					);
				})}
			</div>
		</div>
	);
}
