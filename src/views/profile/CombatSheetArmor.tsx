import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../components/TextBox';
import { Armor, UIMessages } from '../../types/view.d';
import { _localizeNumber, _localizeWeight, _translate } from '../../utils/I18n';
import { getRoman, sign } from '../../utils/NumberUtils';

export interface CombatSheetArmorProps {
	armors: Armor[];
	locale: UIMessages;
}

export function CombatSheetArmor(props: CombatSheetArmorProps) {
	const { armors, locale } = props;
	const list = ([undefined, undefined, undefined, undefined] as Array<Armor | undefined>);
	list.splice(0, Math.min(armors.length, 4), ...armors);
	return (
		<TextBox label={_translate(locale, 'charactersheet.combat.armor.title')} className="armor">
			<table>
				<thead>
					<tr>
						<th className="name">{_translate(locale, 'charactersheet.combat.headers.armor')}</th>
						<th className="st">{_translate(locale, 'charactersheet.combat.headers.st')}</th>
						<th className="loss">{_translate(locale, 'charactersheet.combat.headers.loss')}</th>
						<th className="pro">{_translate(locale, 'charactersheet.combat.headers.pro')}</th>
						<th className="enc">{_translate(locale, 'charactersheet.combat.headers.enc')}</th>
						<th className="add-penalties">{_translate(locale, 'charactersheet.combat.headers.addpenalties')}</th>
						<th className="weight">{_translate(locale, 'charactersheet.combat.headers.weight')}</th>
						<th className="where">{_translate(locale, 'charactersheet.combat.headers.where')}</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const addPenaltiesArr = [];

								if (e.mov !== 0) {
									addPenaltiesArr.push(`${sign(e.mov)} ${_translate(locale, 'secondaryattributes.mov.short')}`);
								}

								if (e.ini !== 0) {
									addPenaltiesArr.push(`${sign(e.ini)} ${_translate(locale, 'secondaryattributes.ini.short')}`);
								}

								return (
									<tr key={e.id}>
										<td className="name">
											<Textfit max={11} min={7} mode="single">{e.name}</Textfit>
										</td>
										<td className="st">{e.st}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="pro">{e.pro}</td>
										<td className="enc">{e.enc}</td>
										<td className="add-penalties">{addPenaltiesArr.length > 0 ? addPenaltiesArr.join(', ') : '-'}</td>
										<td className="weight">{_localizeNumber(_localizeWeight(e.weight, locale.id), locale.id)} {_translate(locale, 'charactersheet.combat.headers.weightunit')}</td>
										<td className="where">
											<Textfit max={11} min={7} mode="single">{e.where}</Textfit>
										</td>
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
