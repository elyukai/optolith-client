import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { RulesStore } from '../../stores/RulesStore';
import { AttributeInstance, CombatTechniqueInstance, ItemInstance } from '../../types/data.d';
import { getAt, getPa } from '../../utils/CombatTechniqueUtils';
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';
import { getRoman } from '../../utils/roman';

export function CombatSheetMeleeWeapons() {
	const items = EquipmentStore.getAll().filter(e => e.gr === 1 && e.combatTechnique !== 'CT_10');
	const list = ([undefined, undefined, undefined, undefined] as Array<ItemInstance | undefined>);
	list.splice(0, Math.min(items.length, 4), ...items);
	const paradeBonus = RulesStore.getAll().higherParadeValues;

	return (
		<TextBox label={translate('charactersheet.combat.closecombatweapons.title')} className="melee-weapons">
			<table>
				<thead>
					<tr>
						<th className="name">{translate('charactersheet.combat.headers.weapon')}</th>
						<th className="combat-technique">{translate('charactersheet.combat.headers.combattechnique')}</th>
						<th className="damage-bonus">{translate('charactersheet.combat.headers.damagebonus')}</th>
						<th className="damage">{translate('charactersheet.combat.headers.dp')}</th>
						<th className="mod" colSpan={2}>{translate('charactersheet.combat.headers.atpamod')}</th>
						<th className="reach">{translate('charactersheet.combat.headers.reach')}</th>
						<th className="bf">{translate('charactersheet.combat.headers.bf')}</th>
						<th className="loss">{translate('charactersheet.combat.headers.loss')}</th>
						<th className="at">{translate('charactersheet.combat.headers.at')}</th>
						<th className="pa">{translate('charactersheet.combat.headers.pa')}</th>
						<th className="weight">{translate('charactersheet.combat.headers.weight')}</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const combatTechnique = get(e.combatTechnique!) as CombatTechniqueInstance;
								let damageFlatBonus = Math.max(...combatTechnique.primary.map(attr => (get(attr) as AttributeInstance).value)) - (e.damageBonus || 0);
								damageFlatBonus = damageFlatBonus > 0 ? damageFlatBonus : 0;
								const damageFlat = e.damageFlat! + damageFlatBonus;
								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className="combat-technique">{combatTechnique.name}</td>
										<td className="damage-bonus">{combatTechnique.primary.map(attr => (get(attr) as AttributeInstance).short).join('/')} {e.damageBonus}</td>
										<td className="damage">{e.damageDiceNumber}W{e.damageDiceSides}{damageFlat > 0 && '+'}{e.damageFlat !== 0 && e.damageFlat}</td>
										<td className="at-mod mod">{e.at && e.at > 0 && '+'}{e.at}</td>
										<td className="pa-mod mod">{e.pa && e.pa > 0 && '+'}{e.pa}</td>
										<td className="reach">{e.reach && translate('charactersheet.combat.headers.reachlabels')[e.reach - 1]}</td>
										<td className="bf">{combatTechnique.bf + (e.stabilityMod || 0)}</td>
										<td className="loss">{e.loss && getRoman(e.loss)}</td>
										<td className="at">{getAt(combatTechnique) + (e.at || 0)}</td>
										<td className="pa">{(getPa(combatTechnique) as number) + (e.pa || 0) + paradeBonus}</td>
										<td className="weight">{localizeNumber(localizeWeight(e.weight))} {translate('charactersheet.combat.headers.weightunit')}</td>
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
