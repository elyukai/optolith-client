import * as React from 'react';
import { getFromArray } from '../../selectors/dependentInstancesSelectors';
import { TalentInstance } from '../../types/data.d';
import { Attribute, UIMessages } from '../../types/view.d';
import { sortByLocaleName } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';
import { sign } from '../../utils/NumberUtils';
import { getRoutineValue } from '../../utils/TalentUtils';

export function iterateList(talents: TalentInstance[], attributes: Attribute[], checkValueVisibility: boolean, locale: UIMessages): JSX.Element[] {
	return sortByLocaleName(talents, locale.id).map(obj => {
		const { id, name, check, encumbrance, ic, value } = obj;
		const checkValues = check.map(e => getFromArray(attributes, e)!.value);
		const checkString = check.map(e => {
			const attribute = getFromArray(attributes, e)!;
			if (checkValueVisibility === true) {
				return attribute.value;
			}
			else {
				return attribute.short;
			}
		}).join('/');
		const encString = encumbrance === 'true' ? _translate(locale, 'charactersheet.gamestats.skills.enc.yes') : encumbrance === 'false' ? _translate(locale, 'charactersheet.gamestats.skills.enc.no') : _translate(locale, 'charactersheet.gamestats.skills.enc.maybe');
		const routine = getRoutineValue(value, checkValues);
		const routineMark = routine && routine[1] ? '!' : '';
		return (
			<tr key={id}>
				<td className="name">{name}</td>
				<td className="check">{checkString}</td>
				<td className="enc">{encString}</td>
				<td className="ic">{getICName(ic)}</td>
				<td className="sr">{value}</td>
				<td className="routine">{routine && sign(routine[0])}{Array.isArray(routine) ? routine[0] : '-'}{routineMark}</td>
				<td className="comment"></td>
			</tr>
		);
	});
}
