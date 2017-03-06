import * as React from 'react';
import TextBox from '../../components/TextBox';
import AttributeStore from '../../stores/AttributeStore';
import AttributeModsListItem from './AttributeModsListItem';

export default () => {
	const attributes: AttributeInstance[] = AttributeStore.getAll();
	return (
		<TextBox className="attribute-mods" label="Eigenschaftsmodifikationen">
			<table>
				<thead>
					<tr>
						<td className="name"></td>
						<td>-3</td>
						<td>-2</td>
						<td>-1</td>
						<td className="null">0</td>
						<td>+1</td>
						<td>+2</td>
						<td>+3</td>
					</tr>
				</thead>
				<tbody>
					{attributes.map(obj => <AttributeModsListItem {...obj} key={obj.id} />)}
				</tbody>
			</table>
		</TextBox>
	);
};
