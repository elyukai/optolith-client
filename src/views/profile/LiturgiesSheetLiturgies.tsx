import classNames from 'classnames';
import * as React from 'react';
import TextBox from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import LiturgiesStore from '../../stores/LiturgiesStore';
import { getSids } from '../../utils/ActivatableUtils';
import { sort } from '../../utils/ListUtils';
import { isOwnTradition } from '../../utils/LiturgyUtils';

const rowIterator = (e: LiturgyInstance, i: number) => {
	if (e) {
		const rawCheck = e.check;
		const checkmod = rawCheck.splice(3)[0];
		const check = rawCheck.map(attr => (get(attr) as AttributeInstance).short).join('/');
		const traditionId = getSids(get('SA_102') as SpecialAbilityInstance)[0];
		const aspectIds = e.aspects.filter(e => e === 1 || Math.round((e - 1) / 2) === traditionId);
		const aspects = aspectIds.map(e => LiturgiesStore.getAspectNames()[e - 1]);

		return (
			<tr key={e.id}>
				<td className="name">{e.name}</td>
				<td className={classNames('check', checkmod && 'mod')}>{check}{checkmod ? ` (+${checkmod})` : null}</td>
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

export default () => {
	const filtered = LiturgiesStore.getAll().filter(e => e.active && e.gr !== 3 && isOwnTradition(e));
	const liturgies = sort(filtered, LiturgiesStore.getSortOrder()) as LiturgyInstance[];
	const list = Array(21).fill(undefined) as Array<LiturgyInstance | undefined>;
	list.splice(0, Math.min(liturgies.length, 21), ...liturgies);

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
};
