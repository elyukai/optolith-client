import * as React from 'react';
import { TextBox } from '../../../components/TextBox';
import { ActivatableDependent, ActiveObject } from '../../../types/data';
import { SpecialAbility } from '../../../types/wiki';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { getSelectOptionName } from '../../../utils/selectionUtils';

export interface SkillsSheetScriptsProps {
  locale: UIMessagesObject;
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>;
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>;
}

export function SkillsSheetScripts (props: SkillsSheetScriptsProps) {
  const {
    locale,
    scriptsStateEntry: maybeScriptsStateEntry,
    scriptsWikiEntry: maybeScriptsWikiEntry,
  } = props;

  const scripts = sortStrings (
    Maybe.mapMaybe<Record<ActiveObject>, string>
      (activeObject => maybeScriptsWikiEntry .bind (
        wikiEntry => getSelectOptionName (wikiEntry, activeObject .lookup ('sid'))
      ))
      (Maybe.fromMaybe (List.empty<Record<ActiveObject>> ())
                       (maybeScriptsStateEntry .fmap (stateEntry => stateEntry .get ('active')))),
    locale .get ('id')
  );

  return (
    <TextBox label={translate (locale, 'charactersheet.gamestats.knownscripts.title')}>
      <div className="scripts-list">
        {scripts.intercalate (', ')}
      </div>
    </TextBox>
  );
}
