import { get } from '../../stores/ListStore';
import { sort } from '../../utils/ListUtils';
import * as React from 'react';
import classNames from 'classnames';
import LiturgiesStore from '../../stores/LiturgiesStore';
import TextBox from '../../components/TextBox';

export default () => {
	const filtered = LiturgiesStore.getAll().filter(e => e.active && e.gr !== 3 && e.isOwnTradition);
	const liturgies = sort(filtered, LiturgiesStore.getSortOrder()) as LiturgyInstance[];
	const list = Array(21).fill(undefined) as (LiturgyInstance | undefined)[];
	list.splice(0, Math.min(liturgies.length, 21), ...liturgies);
	const ASPECTS = LiturgiesStore.getAspectNames();

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
						list.map((e, i) => {
							if (e) {
								const rawCheck = e.check;
								const checkmod = rawCheck.splice(3)[0];
								const check = rawCheck.map(attr => (get(attr) as AttributeInstance).short).join('/');

								return (
									<tr key={e.id}>
										<td className="name">{e.name}</td>
										<td className={classNames('check', checkmod && 'mod')}>{check}{checkmod ? ` (+${checkmod})` : null}</td>
										<td className="value">{e.value}</td>
										<td className="cost"></td>
										<td className="cast-time"></td>
										<td className="range"></td>
										<td className="duration"></td>
										<td className={classNames('aspect', checkmod && 'multi')}>{e.aspect.map(e => ASPECTS[e - 1]).join(', ')}</td>
										<td className="ic">{['A','B','C','D'][e.ic - 1]}</td>
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
						})
					}
				</tbody>
			</table>
		</TextBox>
	);
};
