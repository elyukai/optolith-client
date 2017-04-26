import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { CombatTechniquesStore } from '../../stores/CombatTechniquesStore';
import { get } from '../../stores/ListStore';
import { AttributeInstance } from '../../types/data.d';
import { getAt, getPa } from '../../utils/CombatTechniqueUtils';
import { sort } from '../../utils/ListUtils';

export function CombatSheetTechniques() {
	return (
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
						sort(CombatTechniquesStore.getAll(), 'name').map(e => (
							<tr key={e.id}>
								<td className="name">{e.name}</td>
								<td className="primary">{e.primary.map(attr => (get(attr) as AttributeInstance).short).join('/')}</td>
								<td className="ic">{['A', 'B', 'C', 'D'][e.ic - 1]}</td>
								<td className="value">{e.value}</td>
								<td className="at">{getAt(e)}</td>
								<td className="pa">{getPa(e)}</td>
							</tr>
						))
					}
				</tbody>
			</table>
		</TextBox>
	);
}
