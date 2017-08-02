import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ArmorZone, UIMessages } from '../../types/view.d';
import { _localizeNumber, _localizeWeight, _translate } from '../../utils/I18n';

export interface CombatSheetArmorZonesProps {
	armorZones: ArmorZone[];
	locale: UIMessages;
}

export function CombatSheetArmorZones(props: CombatSheetArmorZonesProps) {
	const { armorZones, locale } = props;
	const list = ([undefined, undefined, undefined, undefined] as Array<ArmorZone | undefined>);
	list.splice(0, Math.min(armorZones.length, 4), ...armorZones);
	return (
		<TextBox label={_translate(locale, 'charactersheet.combat.armor.title')} className="armor armor-zones">
			<table>
				<thead>
					<tr>
						<th className="name">{_translate(locale, 'charactersheet.combat.headers.armor')}</th>
						<th className="zone">{_translate(locale, 'charactersheet.combat.headers.head')}</th>
						<th className="zone">{_translate(locale, 'charactersheet.combat.headers.torso')}</th>
						<th className="zone">{_translate(locale, 'charactersheet.combat.headers.leftarm')}</th>
						<th className="zone">{_translate(locale, 'charactersheet.combat.headers.rightarm')}</th>
						<th className="zone">{_translate(locale, 'charactersheet.combat.headers.leftleg')}</th>
						<th className="zone">{_translate(locale, 'charactersheet.combat.headers.rightleg')}</th>
						<th className="enc">{_translate(locale, 'charactersheet.combat.headers.enc')}</th>
						<th className="add-penalties">{_translate(locale, 'charactersheet.combat.headers.addpenalties')}</th>
						<th className="weight">{_translate(locale, 'charactersheet.combat.headers.weight')}</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="zone">{e.head}</td>
										<td className="zone">{e.torso}</td>
										<td className="zone">{e.leftArm}</td>
										<td className="zone">{e.rightArm}</td>
										<td className="zone">{e.leftLeg}</td>
										<td className="zone">{e.rightLeg}</td>
										<td className="enc">{e.enc}</td>
										<td className="add-penalties">{e.addPenalties ? '-1/-1' : '-'}</td>
										<td className="weight">{_localizeNumber(_localizeWeight(e.weight, locale.id), locale.id)} {_translate(locale, 'charactersheet.combat.headers.weightunit')}</td>
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
