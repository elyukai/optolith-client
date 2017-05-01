import classNames from 'classnames';
import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { SpellsStore } from '../../stores/SpellsStore';
import { AttributeInstance, SpellInstance } from '../../types/data.d';
import { sort } from '../../utils/ListUtils';
import { get as getSec } from '../../utils/secondaryAttributes';
import { isOwnTradition } from '../../utils/SpellUtils';

interface Props {
	attributeValueVisibility: boolean;
}

export function SpellsSheetMain(props: Props) {
	const filtered = SpellsStore.getAll().filter(e => e.active);
	const spells = sort(filtered, SpellsStore.getSortOrder());
	const list = Array<SpellInstance | undefined>(21).fill(undefined);
	list.splice(0, Math.min(spells.length, 21), ...spells);
	const PROPERTIES = SpellsStore.getPropertyNames();
	const TRADITIONS = SpellsStore.getTraditionNames();

	return (
		<TextBox label="Zauber &amp; Rituale" className="skill-list">
			<table>
				<thead>
					<tr>
						<th className="name">Zauber/Ritual</th>
						<th className="check">Probe</th>
						<th className="value">Fw</th>
						<th className="cost">Kosten</th>
						<th className="cast-time">Zauber&shy;dauer</th>
						<th className="range">Reich&shy;weite</th>
						<th className="duration">Wirkungs&shy;dauer</th>
						<th className="property">Merkmal</th>
						<th className="ic">Sf.</th>
						<th className="effect">Wirkung</th>
						<th className="ref">S.</th>
					</tr>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const rawCheck = e.check;
								const checkmod = rawCheck.splice(3)[0] as 'SPI' | 'TOU' | undefined;
								const check = rawCheck.map(attr => {
									const attribute = get(attr) as AttributeInstance;
									if (props.attributeValueVisibility === true) {
										return attribute.value;
									}
									else {
										return attribute.short;
									}
								}).join('/');
								let name = e.name;
								if (!isOwnTradition(e)) {
									name += ` (${e.tradition.map(e => TRADITIONS[e - 1]).sort().join(', ')})`;
								}
								return (
									<tr key={e.id}>
										<td className="name">{name}</td>
										<td className={classNames('check', checkmod && 'mod')}>{check}{checkmod ? ` (+${getSec(checkmod).short})` : null}</td>
										<td className="value">{e.value}</td>
										<td className="cost"></td>
										<td className="cast-time"></td>
										<td className="range"></td>
										<td className="duration"></td>
										<td className="property">{PROPERTIES[e.property - 1]}</td>
										<td className="ic">{['A', 'B', 'C', 'D'][e.ic - 1]}</td>
										<td className="effect"></td>
										<td className="ref"></td>
									</tr>
								);
							}
							else {
								return (
									<tr key={`undefined${i}`}>
										<td className="name"></td>
										<td className="check"></td>
										<td className="value"></td>
										<td className="cost"></td>
										<td className="cast-time"></td>
										<td className="range"></td>
										<td className="duration"></td>
										<td className="property"></td>
										<td className="ic"></td>
										<td className="effect"></td>
										<td className="ref"></td>
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
