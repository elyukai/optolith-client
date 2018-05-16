import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../components/TextBox';
import { ShieldOrParryingWeapon, UIMessages } from '../../types/view.d';
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';
import { getRoman, sign } from '../../utils/NumberUtils';

export interface CombatSheetShieldsProps {
	locale: UIMessages;
	shieldsAndParryingWeapons: ShieldOrParryingWeapon[];
}

export function CombatSheetShields(props: CombatSheetShieldsProps) {
	const { locale, shieldsAndParryingWeapons } = props;
	const list = ([undefined, undefined, undefined, undefined] as Array<ShieldOrParryingWeapon | undefined>);
	list.splice(0, Math.min(shieldsAndParryingWeapons.length, 4), ...shieldsAndParryingWeapons);
	return (
		<TextBox label={translate(locale, 'charactersheet.combat.shieldparryingweapon.title')} className="shields">
			<table>
				<thead>
					<tr>
						<th className="name">{translate(locale, 'charactersheet.combat.headers.shieldparryingweapon')}</th>
						<th className="str">{translate(locale, 'charactersheet.combat.headers.structurepoints')}</th>
						<th className="bf">{translate(locale, 'charactersheet.combat.headers.bf')}</th>
						<th className="loss">{translate(locale, 'charactersheet.combat.headers.loss')}</th>
						<th className="mod">{translate(locale, 'charactersheet.combat.headers.atpamod')}</th>
						<th className="weight">{translate(locale, 'charactersheet.combat.headers.weight')}</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								return (
									<tr key={e.id}>
										<td className="name">
											<Textfit max={11} min={7} mode="single">{e.name}</Textfit>
										</td>
										<td className="str">{e.stp}</td>
										<td className="bf">{e.bf}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="mod">{e.atMod && sign(e.atMod)}/{e.paMod && sign(e.paMod)}</td>
										<td className="weight">{localizeNumber(localizeWeight(e.weight, locale.id), locale.id)} {translate(locale, 'charactersheet.combat.headers.weightunit')}</td>
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
