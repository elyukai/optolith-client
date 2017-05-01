import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { CombatTechniqueInstance, ItemInstance } from '../../types/data.d';
import { getRoman } from '../../utils/roman';

export function CombatSheetShields() {
	const items = EquipmentStore.getAll().filter(e => e.gr === 1 && (e.combatTechnique === 'CT_10' || e.isParryingWeapon));
	const list = ([undefined, undefined, undefined, undefined] as Array<ItemInstance | undefined>);
	list.splice(0, Math.min(items.length, 4), ...items);
	return (
		<TextBox label="Schild/Parierwaffe" className="shields">
			<table>
				<thead>
					<tr>
						<th className="name">Schild/Parierwaffe</th>
						<th className="str">Str.</th>
						<th className="bf">BF</th>
						<th className="loss">V.</th>
						<th className="mod">AT/PA Mod.</th>
						<th className="weight">Gewicht</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const combatTechnique = get(e.combatTechnique!) as CombatTechniqueInstance;
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="str">{e.stp}</td>
										<td className="bf">{combatTechnique.bf + (e.stabilityMod || 0)}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="mod">{e.at && e.at > 0 && '+'}{e.at}/{e.pa && e.pa > 0 && '+'}{e.pa}</td>
										<td className="weight">{e.weight} Stn</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="str"></td>
										<td className="bf"></td>
										<td className="loss"></td>
										<td className="mod"></td>
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
