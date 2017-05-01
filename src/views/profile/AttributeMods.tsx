import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { AttributeStore } from '../../stores/AttributeStore';
import { getLocale } from '../../stores/LocaleStore';
import { AttributeInstance } from '../../types/data.d';
import { AttributeModsListItem } from './AttributeModsListItem';

export function AttributeMods() {
	const attributes: AttributeInstance[] = AttributeStore.getAll();
	return (
		<TextBox className="attribute-mods" label={getLocale()['charactersheet.attributemodifiers.title']}>
			<table>
				<thead>
					<tr>
						<th className="name"></th>
						<th>-3</th>
						<th>-2</th>
						<th>-1</th>
						<th className="null">0</th>
						<th>+1</th>
						<th>+2</th>
						<th>+3</th>
					</tr>
				</thead>
				<tbody>
					{attributes.map(obj => <AttributeModsListItem {...obj} key={obj.id} />)}
				</tbody>
			</table>
		</TextBox>
	);
}
