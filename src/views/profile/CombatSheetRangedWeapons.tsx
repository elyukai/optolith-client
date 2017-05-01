import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { CombatTechniqueInstance, ItemInstance } from '../../types/data.d';
import { getAt } from '../../utils/CombatTechniqueUtils';
import { getRoman } from '../../utils/roman';

export function CombatSheetRangedWeapons() {
	const items = EquipmentStore.getAll().filter(e => e.gr === 2);
	const list = ([undefined, undefined, undefined, undefined] as Array<ItemInstance | undefined>);
	list.splice(0, Math.min(items.length, 4), ...items);
	return (
		<TextBox label="Fernkampfwaffen" className="melee-weapons">
			<table>
				<thead>
					<tr>
						<th className="name">Waffe</th>
						<th className="combat-technique">Kampftechnik</th>
						<th className="reload-time">Ladezeiten</th>
						<th className="damage">TP</th>
						<th className="ammunition">Munition</th>
						<th className="range">Reichweite</th>
						<th className="bf">BF</th>
						<th className="loss">V.</th>
						<th className="ranged">Fernkampf</th>
						<th className="weight">Gewicht</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const combatTechnique = get(e.combatTechnique!) as CombatTechniqueInstance;
								const ammunition = EquipmentStore.getTemplate(e.ammunition!);
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="combat-technique">{combatTechnique.name}</td>
										<td className="reload-time">{e.reloadTime} Akt.</td>
										<td className="damage">{e.damageDiceNumber}W{e.damageDiceSides}{e.damageFlat && e.damageFlat > 0 && '+'}{e.damageFlat !== 0 && e.damageFlat}</td>
										<td className="ammunition">{ammunition && ammunition.name}</td>
										<td className="range">{e.range && e.range.join('/')}</td>
										<td className="bf">{combatTechnique.bf + (e.stabilityMod || 0)}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="ranged">{getAt(combatTechnique)}</td>
										<td className="weight">{e.weight} Stn</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="combat-technique"></td>
										<td className="reload-time"></td>
										<td className="damage"></td>
										<td className="ammunition"></td>
										<td className="range"></td>
										<td className="bf"></td>
										<td className="loss"></td>
										<td className="ranged"></td>
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
}
