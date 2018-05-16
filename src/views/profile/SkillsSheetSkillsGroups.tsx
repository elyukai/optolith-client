import * as React from 'react';
import { getFromArray } from '../../selectors/dependentInstancesSelectors';
import { Attribute, UIMessages } from '../../types/view.d';
import { translate } from '../../utils/I18n';

export function iterateGroupHeaders(attributes: Attribute[], checkAttributeValueVisibility: boolean, locale: UIMessages) {
	const groupChecksIds = [
		['ATTR_1', 'ATTR_6', 'ATTR_8'],
		['ATTR_3', 'ATTR_4', 'ATTR_4'],
		['ATTR_1', 'ATTR_6', 'ATTR_7'],
		['ATTR_2', 'ATTR_2', 'ATTR_3'],
		['ATTR_5', 'ATTR_5', 'ATTR_7'],
	];
	const groupNameKeys = [
		'physical',
		'social',
		'nature',
		'knowledge',
		'craft',
	];
	return groupChecksIds.map((arr, index) => {
		const check = arr.map(e => {
			const attribute = getFromArray(attributes, e)!;
			if (checkAttributeValueVisibility === true) {
				return attribute.value;
			}
			else {
				return attribute.short;
			}
		}).join('/');
		return (
			<tr className="group">
				<td className="name">{translate(locale, `charactersheet.gamestats.skills.subheaders.${groupNameKeys[index]}` as 'charactersheet.gamestats.skills.subheaders.physical')}</td>
				<td className="check">{check}</td>
				<td className="enc"></td>
				<td className="ic"></td>
				<td className="sr"></td>
				<td className="routine"></td>
				<td className="comment">{translate(locale, `charactersheet.gamestats.skills.subheaders.${groupNameKeys[index]}pages` as 'charactersheet.gamestats.skills.subheaders.physicalpages')}</td>
			</tr>
		);
	});
}
