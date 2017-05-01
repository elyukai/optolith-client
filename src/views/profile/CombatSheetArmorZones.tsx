import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { ArmorZonesInstance } from '../../types/data.d';

export function CombatSheetArmorZones() {
	const items = EquipmentStore.getAllArmorZones();
	const list = ([undefined, undefined, undefined, undefined] as Array<ArmorZonesInstance | undefined>);
	list.splice(0, Math.min(items.length, 4), ...items);
	return (
		<TextBox label="Rüstungen" className="armor armor-zones">
			<table>
				<thead>
					<tr>
						<th className="name">Rüstung</th>
						<th className="zone">Ko</th>
						<th className="zone">To</th>
						<th className="zone">lA</th>
						<th className="zone">rA</th>
						<th className="zone">lB</th>
						<th className="zone">rB</th>
						<th className="enc">BE</th>
						<th className="add-penalties">GS/INI</th>
						<th className="weight">Gewicht</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const { pro, weight } = EquipmentStore.getProtectionAndWeight(e);
								const protectionTier = Math.ceil(pro / 14);
								const enc = EquipmentStore.getEncumbranceZoneTiers()[protectionTier];
								const headArmor = EquipmentStore.getZoneArmor(e.head);
								const torsoArmor = EquipmentStore.getZoneArmor(e.torso);
								const leftArmArmor = EquipmentStore.getZoneArmor(e.leftArm);
								const rightArmArmor = EquipmentStore.getZoneArmor(e.rightArm);
								const leftLegArmor = EquipmentStore.getZoneArmor(e.leftLeg);
								const rightLegArmor = EquipmentStore.getZoneArmor(e.rightLeg);
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="zone">{headArmor && headArmor.pro}</td>
										<td className="zone">{torsoArmor && torsoArmor.pro}</td>
										<td className="zone">{leftArmArmor && leftArmArmor.pro}</td>
										<td className="zone">{rightArmArmor && rightArmArmor.pro}</td>
										<td className="zone">{leftLegArmor && leftLegArmor.pro}</td>
										<td className="zone">{rightLegArmor && rightLegArmor.pro}</td>
										<td className="enc">{enc}</td>
										<td className="add-penalties">{[1, 3, 5].includes(protectionTier) ? '-1/-1' : '-'}</td>
										<td className="weight">{Math.floor(weight * 100) / 100} Stn</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="zone"></td>
										<td className="zone"></td>
										<td className="zone"></td>
										<td className="zone"></td>
										<td className="zone"></td>
										<td className="zone"></td>
										<td className="enc"></td>
										<td className="add-penalties"></td>
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
