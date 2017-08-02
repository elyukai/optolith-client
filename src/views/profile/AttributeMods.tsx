import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { Attribute, UIMessages } from '../../types/view.d';
import { _translate } from '../../utils/I18n';
import { AttributeModsListItem } from './AttributeModsListItem';

export interface AttributeModsProps {
	attributes: Attribute[];
	locale: UIMessages;
}

export function AttributeMods(props: AttributeModsProps) {
	return (
		<TextBox className="attribute-mods" label={_translate(props.locale, 'charactersheet.attributemodifiers.title')}>
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
					{props.attributes.map(obj => <AttributeModsListItem {...obj} key={obj.id} />)}
				</tbody>
			</table>
		</TextBox>
	);
}
