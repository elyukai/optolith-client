import classNames from 'classnames';
import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { LiturgiesStore } from '../../stores/LiturgiesStore';
import { AttributeInstance, LiturgyInstance, SpecialAbilityInstance } from '../../types/data.d';
import { getSids } from '../../utils/ActivatableUtils';
import { sort } from '../../utils/ListUtils';
import { get as getSec } from '../../utils/secondaryAttributes';

interface Props {
	attributeValueVisibility: boolean;
}

export function LiturgiesSheetMain(props: Props) {
	const filtered = LiturgiesStore.getAll().filter(e => e.active);
	const liturgies = sort(filtered, LiturgiesStore.getSortOrder());
	const list = Array<LiturgyInstance | undefined>(21).fill(undefined);
	list.splice(0, Math.min(liturgies.length, 21), ...liturgies);

	const rowIterator = (e: LiturgyInstance, i: number) => {
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
			const traditionId = getSids(get('SA_102') as SpecialAbilityInstance)[0];
			const aspectIds = e.aspects.filter(e => e === 1 || Math.round((e - 1) / 2) === traditionId);
			const aspects = aspectIds.map(e => LiturgiesStore.getAspectNames()[e - 1]);

			return (
				<tr key={e.id}>
					<td className="name">{e.name}</td>
					<td className={classNames('check', checkmod && 'mod')}>{check}{checkmod ? ` (+${getSec(checkmod).short})` : null}</td>
					<td className="value">{e.value}</td>
					<td className="cost"></td>
					<td className="cast-time"></td>
					<td className="range"></td>
					<td className="duration"></td>
					<td className={classNames('aspect', checkmod && 'multi')}>{aspects.join(', ')}</td>
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
					<td className="aspect"></td>
					<td className="ic"></td>
					<td className="effect"></td>
					<td className="ref"></td>
				</tr>
			);
		}
	};

	return (
		<TextBox label="Liturgien &amp; Zeremonien" className="skill-list">
			<table>
				<thead>
					<td className="name">Liturgie/Zeremonie</td>
					<td className="check">Probe</td>
					<td className="value">Fw</td>
					<td className="cost">Kosten</td>
					<td className="cast-time">Liturgie&shy;dauer</td>
					<td className="range">Reich&shy;weite</td>
					<td className="duration">Wirkungs&shy;dauer</td>
					<td className="aspect">Aspekt</td>
					<td className="ic">Sf.</td>
					<td className="effect">Wirkung</td>
					<td className="ref">S.</td>
				</thead>
				<tbody>
					{
						list.map(rowIterator)
					}
				</tbody>
			</table>
		</TextBox>
	);
}
