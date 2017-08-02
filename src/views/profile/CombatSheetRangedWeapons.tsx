import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { RangedWeapon, UIMessages } from '../../types/view.d';
import { _localizeNumber, _localizeWeight, _translate } from '../../utils/I18n';
import { getRoman, signNull } from '../../utils/NumberUtils';

export interface CombatSheetRangedWeaponProps {
	locale: UIMessages;
	rangedWeapons: RangedWeapon[];
}

export function CombatSheetRangedWeapons(props: CombatSheetRangedWeaponProps) {
	const { locale, rangedWeapons } = props;
	const list = ([undefined, undefined, undefined, undefined] as Array<RangedWeapon | undefined>);
	list.splice(0, Math.min(rangedWeapons.length, 4), ...rangedWeapons);
	return (
		<TextBox label={_translate(locale, 'charactersheet.combat.rangedcombatweapons.title')} className="melee-weapons">
			<table>
				<thead>
					<tr>
						<th className="name">{_translate(locale, 'charactersheet.combat.headers.weapon')}</th>
						<th className="combat-technique">{_translate(locale, 'charactersheet.combat.headers.combattechnique')}</th>
						<th className="reload-time">{_translate(locale, 'charactersheet.combat.headers.reloadtime')}</th>
						<th className="damage">{_translate(locale, 'charactersheet.combat.headers.dp')}</th>
						<th className="ammunition">{_translate(locale, 'charactersheet.combat.headers.ammunition')}</th>
						<th className="range">{_translate(locale, 'charactersheet.combat.headers.rangebrackets')}</th>
						<th className="bf">{_translate(locale, 'charactersheet.combat.headers.bf')}</th>
						<th className="loss">{_translate(locale, 'charactersheet.combat.headers.loss')}</th>
						<th className="ranged">{_translate(locale, 'charactersheet.combat.headers.rangedcombat')}</th>
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
										<td className="combat-technique">{e.combatTechnique}</td>
										<td className="reload-time">{e.reloadTime} {_translate(locale, 'charactersheet.combat.content.actions')}</td>
										<td className="damage">{e.damageDiceNumber}{_translate(locale, 'charactersheet.combat.content.dice')}{e.damageDiceSides}{e.damageFlat && signNull(e.damageFlat)}</td>
										<td className="ammunition">{e.ammunition}</td>
										<td className="range">{e.range && e.range.join('/')}</td>
										<td className="bf">{e.bf}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="ranged">{e.at}</td>
										<td className="weight">{_localizeNumber(_localizeWeight(e.weight, locale.id), locale.id)} {_translate(locale, 'charactersheet.combat.headers.weightunit')}</td>
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
