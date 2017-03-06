import * as React from 'react';
import TextBox from '../../components/TextBox';
import EquipmentStore from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import RulesStore from '../../stores/RulesStore';
import { getAt, getPa } from '../../utils/CombatTechniqueUtils';

export default () => {
	const items = EquipmentStore.getAll().filter(e => e.gr === 1 && e.combatTechnique !== 'CT_10');
	const list = ([undefined, undefined, undefined, undefined] as Array<ItemInstance | undefined>);
	list.splice(0, Math.min(items.length, 4), ...items);
	const paradeBonus = RulesStore.getAll().higherParadeValues;

	return (
		<TextBox label="Nahkampfwaffen" className="melee-weapons">
			<table>
				<thead>
					<td className="name">Waffe</td>
					<td className="combat-technique">Kampftechnik</td>
					<td className="damage-bonus">Schadenb.</td>
					<td className="damage">TP</td>
					<td className="mod" colSpan={2}>AT/PA Mod.</td>
					<td className="reach">Reichweite</td>
					<td className="at">AT</td>
					<td className="pa">PA</td>
					<td className="weight">Gewicht</td>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const combatTechnique = get(e.combatTechnique) as CombatTechniqueInstance;
								let damageFlatBonus = Math.max(...combatTechnique.primary.map(attr => (get(attr) as AttributeInstance).value)) - e.damageBonus;
								damageFlatBonus = damageFlatBonus > 0 ? damageFlatBonus : 0;
								const damageFlat = e.damageFlat + damageFlatBonus;
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="combat-technique">{combatTechnique.name}</td>
										<td className="damage-bonus">{combatTechnique.primary.map(attr => (get(attr) as AttributeInstance).short).join('/')} {e.damageBonus}</td>
										<td className="damage">{e.damageDiceNumber}W{e.damageDiceSides}{damageFlat > 0 && '+'}{e.damageFlat !== 0 && e.damageFlat}</td>
										<td className="at-mod mod">{e.at > 0 && '+'}{e.at}</td>
										<td className="pa-mod mod">{e.pa > 0 && '+'}{e.pa}</td>
										<td className="reach">{['kurz', 'mittel', 'lang'][e.reach - 1]}</td>
										<td className="at">{getAt(combatTechnique) + e.at}</td>
										<td className="pa">{(getPa(combatTechnique) as number) + e.pa + paradeBonus}</td>
										<td className="weight">{e.weight} Stn</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="combat-technique"></td>
										<td className="damage-bonus"></td>
										<td className="damage"></td>
										<td className="at-mod mod"></td>
										<td className="pa-mod mod"></td>
										<td className="reach"></td>
										<td className="at"></td>
										<td className="pa"></td>
										<td className="weight"></td>
									</tr>
								);
							}
						})
					}
				</tbody>
			</table>
		</TextBox>
	);
};
