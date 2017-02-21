import { get } from '../../stores/ListStore';
import * as React from 'react';
import InventoryStore from '../../stores/InventoryStore';
import TextBox from '../../components/TextBox';

export default () => {
	const items = InventoryStore.getAll().filter(e => e.gr === 2);
	const list = ([undefined,undefined,undefined,undefined] as (ItemInstance | undefined)[]);
	list.splice(0, Math.min(items.length, 4), ...items);
	return (
		<TextBox label="Fernkampfwaffen" className="melee-weapons">
			<table>
				<thead>
					<td className="name">Waffe</td>
					<td className="combat-technique">Kampftechnik</td>
					<td className="reload-time">Ladezeiten</td>
					<td className="damage">TP</td>
					<td className="range">Reichweite</td>
					<td className="ranged">Fernkampf</td>
					<td className="ammunition">Munition</td>
					<td className="weight">Gewicht</td>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const combatTechnique = get(e.combatTechnique) as CombatTechniqueInstance;
								const ammunition = InventoryStore.get(e.ammunition!);
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="combat-technique">{combatTechnique.name}</td>
										<td className="reload-time">{e.reloadTime} Akt.</td>
										<td className="damage">{e.damageDiceNumber}W{e.damageDiceSides}{e.damageFlat > 0 && '+'}{e.damageFlat !== 0 && e.damageFlat}</td>
										<td className="range">{e.range.join('/')}</td>
										<td className="ranged">{combatTechnique.at}</td>
										<td className="ammunition">{ammunition && ammunition.name}</td>
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
										<td className="range"></td>
										<td className="ranged"></td>
										<td className="ammunition"></td>
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
