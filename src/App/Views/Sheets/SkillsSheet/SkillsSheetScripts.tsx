import * as React from 'react';
import { ActivatableDependent, ActiveObject } from '../../../App/Models/Hero/heroTypeHelpers';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { TextBox } from '../../../components/TextBox';
import { getSelectOptionName } from '../../../Utilities/Activatable/selectionUtils';
import { List, Maybe, Record } from '../../../Utilities/dataUtils';
import { sortStrings } from '../../../Utilities/FilterSortUtils';

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

  const scripts =
    sortStrings
      (locale .get ('id'))
      (
        Maybe.mapMaybe<Record<ActiveObject>, string>
          (activeObject => maybeScriptsWikiEntry .bind (
            wikiEntry => getSelectOptionName (wikiEntry, activeObject .lookup ('sid'))
          ))
          (Maybe.fromMaybe (List.empty<Record<ActiveObject>> ())
                           (maybeScriptsStateEntry
                             .fmap (stateEntry => stateEntry .get ('active'))))
      );

  return (
    <TextBox label={translate (locale, 'charactersheet.gamestats.knownscripts.title')}>
      <div className="scripts-list">
        {scripts.intercalate (', ')}
      </div>
    </TextBox>
  );
}
