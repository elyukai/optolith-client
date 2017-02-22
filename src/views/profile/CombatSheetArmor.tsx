import * as React from 'react';
import EquipmentStore from '../../stores/EquipmentStore';
import TextBox from '../../components/TextBox';

export default () => {
	const items = EquipmentStore.getAll().filter(e => e.gr === 4 && e.combatTechnique !== 'CT_10');
	const list = ([undefined,undefined,undefined,undefined] as (ItemInstance | undefined)[]);
	list.splice(0, Math.min(items.length, 4), ...items);
	return (
		<TextBox label="Rüstungen" className="armor">
			<table>
				<thead>
					<td className="name">Rüstung</td>
					<td className="pro">RS</td>
					<td className="enc">BE</td>
					<td className="add-penalties">Zus. Abzüge</td>
					<td className="weight">Gewicht</td>
					<td className="where">Reise, Schlacht, ...</td>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="pro">{e.pro}</td>
										<td className="enc">{e.enc}</td>
										<td className="add-penalties">{e.addPenalties ? '-1 GS, -1 INI' : '-'}</td>
										<td className="weight">{e.weight} Stn</td>
										<td className="where">{e.where}</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="pro"></td>
										<td className="enc"></td>
										<td className="add-penalties"></td>
										<td className="weight"></td>
										<td className="where"></td>
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
