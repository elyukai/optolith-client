import { get } from '../../stores/ListStore';
import * as React from 'react';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import TextBox from '../../components/TextBox';

export default () => (
	<TextBox label="Kampftechniken" className="combat-techniques">
		<table>
			<thead>
				<td className="name">Kampftechniken</td>
				<td className="primary">Leiteig.</td>
				<td className="ic">Sf.</td>
				<td className="value">Ktw.</td>
				<td className="at">AT/FK</td>
				<td className="pa">PA</td>
			</thead>
			<tbody>
				{
					CombatTechniquesStore.getAll().map(e => (
						<tr key={e.id}>
							<td className="name">{e.name}</td>
							<td className="primary">{e.primary.map(attr => (get(attr) as AttributeInstance).short).join('/')}</td>
							<td className="ic">{['A','B','C','D'][e.ic - 1]}</td>
							<td className="value">{e.value}</td>
							<td className="at">{e.at}</td>
							<td className="pa">{e.pa}</td>
						</tr>
					))
				}
			</tbody>
		</table>
	</TextBox>
);
