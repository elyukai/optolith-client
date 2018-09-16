import * as React from 'react';
import { TalentInstance } from '../../types/data';
import { Attribute, UIMessages } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { getICName } from '../../utils/improvementCostUtils';
import { sign } from '../../utils/NumberUtils';
import { getRoutineValue } from '../../utils/skillUtils';

export function iterateList(talents: TalentInstance[], attributes: Attribute[], checkValueVisibility: boolean, locale: UIMessages): JSX.Element[] {
  return sortObjects(talents, locale.id).map(obj => {
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
    const encString = encumbrance === 'true' ? translate(locale, 'charactersheet.gamestats.skills.enc.yes') : encumbrance === 'false' ? translate(locale, 'charactersheet.gamestats.skills.enc.no') : translate(locale, 'charactersheet.gamestats.skills.enc.maybe');
    const routine = getRoutineValue(value, checkValues);
    return (
      <tr key={id}>
        <td className="name">{name}</td>
        <td className="check">{checkString}</td>
        <td className="enc">{encString}</td>
        <td className="ic">{getICName(ic)}</td>
        <td className="sr">{value}</td>
        <td className="routine">{routine ? `${sign(routine[0])}${routine[1] ? '!' : ''}` : '-'}</td>
        <td className="comment"></td>
      </tr>
    );
  });
}
