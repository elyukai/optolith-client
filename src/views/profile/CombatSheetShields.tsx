import * as React from 'react';
import InventoryStore from '../../stores/InventoryStore';
import TextBox from '../../components/TextBox';

export default () => {
	const items = InventoryStore.getAll().filter(e => e.gr === 1 && (e.combatTechnique === 'CT_10' || e.isParryingWeapon));
	const list = ([undefined,undefined,undefined,undefined] as (ItemInstance | undefined)[]);
	list.splice(0, Math.min(items.length, 4), ...items);
	return (
		<TextBox label="Schild/Parierwaffe" className="shields">
			<table>
				<thead>
					<td className="name">Schild/Parierwaffe</td>
					<td className="stp">Strukturp.</td>
					<td className="mod">AT/PA Mod.</td>
					<td className="weight">Gewicht</td>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="stp">{e.stp}</td>
										<td className="mod">{e.at > 0 && '+'}{e.at}/{e.pa > 0 && '+'}{e.pa}</td>
										<td className="weight">{e.weight} Stn</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="stp"></td>
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
};
