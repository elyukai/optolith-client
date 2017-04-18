import classNames from 'classnames';
import * as React from 'react';
import TextBox from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import SpellsStore from '../../stores/SpellsStore';
import { sort } from '../../utils/ListUtils';
import { isOwnTradition } from '../../utils/SpellUtils';

interface Props {
	attributeValueVisibility: boolean;
}

export default function SpellsSheetMain(props: Props) {
	const filtered = SpellsStore.getAll().filter(e => e.active && e.gr !== 5);
	const spells = sort(filtered, SpellsStore.getSortOrder()) as SpellInstance[];
	const list = Array(21).fill(undefined) as Array<SpellInstance | undefined>;
	list.splice(0, Math.min(spells.length, 21), ...spells);
	const PROPERTIES = SpellsStore.getPropertyNames();
	const TRADITIONS = SpellsStore.getTraditionNames();

	return (
		<TextBox label="Zauber &amp; Rituale" className="skill-list">
			<table>
				<thead>
					<td className="name">Zauber/Ritual</td>
					<td className="check">Probe</td>
					<td className="value">Fw</td>
					<td className="cost">Kosten</td>
					<td className="cast-time">Zauber&shy;dauer</td>
					<td className="range">Reich&shy;weite</td>
					<td className="duration">Wirkungs&shy;dauer</td>
					<td className="property">Merkmal</td>
					<td className="ic">Sf.</td>
					<td className="effect">Wirkung</td>
					<td className="ref">S.</td>
				</thead>
				<tbody>
					{
						list.map((e, i) => {
							if (e) {
								const rawCheck = e.check;
								const checkmod = rawCheck.splice(3)[0];
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
										<td className={classNames('check', checkmod && 'mod')}>{check}{checkmod ? ` (+${checkmod})` : null}</td>
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
