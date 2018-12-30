import * as React from 'react';
import { TextBox } from '../../../components/TextBox';
import { ActiveViewObject } from '../../../types/data';
import { compressList } from '../../../utils/activatable/activatableNameUtils';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { SpecialAbility } from '../../../utils/wikiData/wikiTypeHelpers';

export interface SpellsSheetSpecialAbilitiesProps {
  locale: UIMessagesObject;
  magicalSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
}

export function SpellsSheetSpecialAbilities (props: SpellsSheetSpecialAbilitiesProps) {
  const { locale, magicalSpecialAbilities: maybeMagicalSpecialAbilities } = props;

  return (
    <TextBox
      className="activatable-list"
      label={translate (locale, 'charactersheet.spells.magicalspecialabilities.title')}
      value={compressList (
        Maybe.fromMaybe<List<Record<ActiveViewObject<SpecialAbility>>>>
          (List.empty<Record<ActiveViewObject<SpecialAbility>>> ())
          (maybeMagicalSpecialAbilities) as List<Record<ActiveViewObject>>,
        locale
      )}
      />
  );
}
