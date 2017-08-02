import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { MeleeWeapon, UIMessages } from '../../types/view.d';
import { _localizeNumber, _localizeWeight, _translate } from '../../utils/I18n';
import { getRoman, signNull } from '../../utils/NumberUtils';

export interface CombatSheetMeleeWeaponsProps {
	locale: UIMessages;
	meleeWeapons: MeleeWeapon[];
}

export function CombatSheetMeleeWeapons(props: CombatSheetMeleeWeaponsProps) {
	const { locale, meleeWeapons } = props;
	const list = ([undefined, undefined, undefined, undefined] as Array<MeleeWeapon | undefined>);
	list.splice(0, Math.min(meleeWeapons.length, 4), ...meleeWeapons);

	return (
		<TextBox label={_translate(locale, 'charactersheet.combat.closecombatweapons.title')} className="melee-weapons">
			<table>
				<thead>
					<tr>
						<th className="name">{_translate(locale, 'charactersheet.combat.headers.weapon')}</th>
						<th className="combat-technique">{_translate(locale, 'charactersheet.combat.headers.combattechnique')}</th>
						<th className="damage-bonus">{_translate(locale, 'charactersheet.combat.headers.damagebonus')}</th>
						<th className="damage">{_translate(locale, 'charactersheet.combat.headers.dp')}</th>
						<th className="mod" colSpan={2}>{_translate(locale, 'charactersheet.combat.headers.atpamod')}</th>
						<th className="reach">{_translate(locale, 'charactersheet.combat.headers.reach')}</th>
						<th className="bf">{_translate(locale, 'charactersheet.combat.headers.bf')}</th>
						<th className="loss">{_translate(locale, 'charactersheet.combat.headers.loss')}</th>
						<th className="at">{_translate(locale, 'charactersheet.combat.headers.at')}</th>
						<th className="pa">{_translate(locale, 'charactersheet.combat.headers.pa')}</th>
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
										<td className="damage-bonus">{e.primary.join('/')} {e.primaryBonus}</td>
										<td className="damage">{e.damageDiceNumber}{_translate(locale, 'charactersheet.combat.content.dice')}{e.damageDiceSides}{signNull(e.damageFlat)}</td>
										<td className="at-mod mod">{e.atMod}</td>
										<td className="pa-mod mod">{e.paMod}</td>
										<td className="reach">{e.reach && _translate(locale, 'charactersheet.combat.headers.reachlabels')[e.reach - 1]}</td>
										<td className="bf">{e.bf}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="at">{e.at}</td>
										<td className="pa">{e.pa}</td>
										<td className="weight">{_localizeNumber(_localizeWeight(e.weight, locale.id), locale.id)} {_translate(locale, 'charactersheet.combat.headers.weightunit')}</td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="combat-technique"></td>
										<td className="damage-bonus"></td>
										<td className="damage"></td>
										<td className="at-mod mod"></td>
										<td className="pa-mod mod"></td>
										<td className="reach"></td>
										<td className="bf"></td>
										<td className="loss"></td>
										<td className="at"></td>
										<td className="pa"></td>
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
