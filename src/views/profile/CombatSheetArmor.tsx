import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { ItemInstance } from '../../types/data.d';
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';
import { getRoman } from '../../utils/roman';

export function CombatSheetArmor() {
	const items = EquipmentStore.getAll().filter(e => e.gr === 4 && e.combatTechnique !== 'CT_10');
	const list = ([undefined, undefined, undefined, undefined] as Array<ItemInstance | undefined>);
	list.splice(0, Math.min(items.length, 4), ...items);
	const stabilityByArmorType = [4, 5, 6, 8, 9, 13, 12, 11, 10];
	return (
		<TextBox label={translate('charactersheet.combat.armor.title')} className="armor">
			<table>
				<thead>
					<tr>
						<th className="name">{translate('charactersheet.combat.headers.armor')}</th>
						<th className="st">{translate('charactersheet.combat.headers.st')}</th>
						<th className="loss">{translate('charactersheet.combat.headers.loss')}</th>
						<th className="pro">{translate('charactersheet.combat.headers.pro')}</th>
						<th className="enc">{translate('charactersheet.combat.headers.enc')}</th>
						<th className="add-penalties">{translate('charactersheet.combat.headers.addpenalties')}</th>
						<th className="weight">{translate('charactersheet.combat.headers.weight')}</th>
						<th className="where">{translate('charactersheet.combat.headers.where')}</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const addPenaltiesArr = [];

								if (typeof e.movMod === 'number' && e.addPenalties === true) {
									addPenaltiesArr.push(`-${e.movMod} GS`);
								}

								if (typeof e.iniMod === 'number' && e.addPenalties === true) {
									addPenaltiesArr.push(`-${e.iniMod} INI`);
								}

								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="st">{e.armorType && stabilityByArmorType[e.armorType - 1] + (e.stabilityMod || 0)}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="pro">{e.pro}</td>
										<td className="enc">{e.enc}</td>
										<td className="add-penalties">{addPenaltiesArr.length > 0 ? addPenaltiesArr.join(', ') : '-'}</td>
										<td className="weight">{localizeNumber(localizeWeight(e.weight))} {translate('charactersheet.combat.headers.weightunit')}</td>
										<td className="where">{e.where}</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="st"></td>
										<td className="loss"></td>
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
}
