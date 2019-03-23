import * as React from 'react';
import { ActiveViewObject } from '../../../App/Models/Hero/heroTypeHelpers';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { TextBox } from '../../../components/TextBox';
import { compressList } from '../../../Utilities/Activatable/activatableNameUtils';
import { List, Maybe, Record } from '../../../Utilities/dataUtils';

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
