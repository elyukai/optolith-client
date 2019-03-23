import * as React from 'react';
import { ActivatableDependent, ActiveObject } from '../../../App/Models/Hero/heroTypeHelpers';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { getRoman } from '../../../App/Utils/NumberUtils';
import { TextBox } from '../../../components/TextBox';
import { findSelectOption } from '../../../Utilities/Activatable/selectionUtils';
import { List, Maybe, Record } from '../../../Utilities/dataUtils';
import { sortObjects } from '../../../Utilities/FilterSortUtils';

export interface SkillsSheetLanguagesProps {
  languagesStateEntry: Maybe<Record<ActivatableDependent>>;
  languagesWikiEntry: Maybe<Record<SpecialAbility>>;
  locale: UIMessagesObject;
}

export function SkillsSheetLanguages (props: SkillsSheetLanguagesProps) {
  const {
    languagesStateEntry: maybeLanguagesStateEntry,
    languagesWikiEntry: maybeLanguagesWikiEntry,
    locale,
  } = props;

  const languages = sortObjects (
    Maybe.fromMaybe (List.empty<Record<ActiveObject>> ())
                    (maybeLanguagesStateEntry .fmap (stateEntry => stateEntry .get ('active')))
      .map (activeObject => {
        const selection =
          Maybe.fromMaybe
            (Record.of ({ id: 0, name: 'MISSING' }))
            (
              maybeLanguagesWikiEntry
                .bind (wikiEntry => findSelectOption (wikiEntry, activeObject .lookup ('sid')))
            );

        return Record.of ({
          id: selection .get ('id'),
          name: selection .get ('name'),
          level: activeObject .lookupWithDefault<'tier'> (0) ('tier'),
        });
      }),
    locale .get ('id'),
    [{ key: 'level', reverse: true }, 'name']
  );

  return (
    <TextBox label={translate (locale, 'charactersheet.gamestats.languages.title')}>
      <table className="languages-list">
        <tbody>
          {languages
            .map (e => (
              <tr key={`lang-${e .get ('id')}`}>
                <td>{e .get ('name')}</td>
                <td>{
                  e .get ('level') === 4
                    ? translate (locale, 'charactersheet.gamestats.languages.native')
                    : getRoman (e .get ('level'))
                }</td>
              </tr>
            ))
            .toArray ()}
        </tbody>
      </table>
    </TextBox>
  );
}
