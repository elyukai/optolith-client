import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { SpecialAbilityInstance, UIMessages } from '../../types/data';
import { getSelectionItem } from '../../utils/selectionUtils';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { getRoman } from '../../utils/NumberUtils';

export interface SkillsSheetLanguagesProps {
  languagesInstance: SpecialAbilityInstance;
  locale: UIMessages;
}

export function SkillsSheetLanguages(props: SkillsSheetLanguagesProps) {
  const { languagesInstance, locale } = props;
  const languages = sortObjects(languagesInstance.active.map(({ sid, tier = 0 }) => {
    const { id, name } = getSelectionItem(languagesInstance, sid) || { id: 0, name: 'MISSING'};
    return ({ id, name, tier });
  }), locale.id, [{ key: 'tier', reverse: true }, 'name']);

  return (
    <TextBox label={translate(locale, 'charactersheet.gamestats.languages.title')}>
      <table className="languages-list">
        <tbody>
          {languages.map(e => <tr key={`lang-${e.id}`}>
            <td>{e.name}</td>
            <td>{e.tier === 4 ? translate(locale, 'charactersheet.gamestats.languages.native') : getRoman(e.tier)}</td>
          </tr>)}
        </tbody>
      </table>
    </TextBox>
  );
}
