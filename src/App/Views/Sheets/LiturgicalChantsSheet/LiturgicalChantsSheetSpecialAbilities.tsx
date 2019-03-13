import * as React from 'react';
import { ActiveViewObject } from '../../../App/Models/Hero/heroTypeHelpers';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { TextBox } from '../../../components/TextBox';
import { compressList } from '../../../utils/activatable/activatableNameUtils';
import { List, Maybe, Record } from '../../../utils/dataUtils';

export interface LiturgicalChantsSheetSpecialAbilitiesProps {
  blessedSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
  locale: UIMessagesObject;
}

export function LiturgicalChantsSheetSpecialAbilities (
  props: LiturgicalChantsSheetSpecialAbilitiesProps
) {
  const { locale, blessedSpecialAbilities: maybeBlessedSpecialAbilities } = props;

  return (
    <TextBox
      className="activatable-list"
      label={translate (locale, 'charactersheet.chants.blessedspecialabilities.title')}
      value={compressList (
        Maybe.fromMaybe<List<Record<ActiveViewObject<SpecialAbility>>>>
          (List.empty<Record<ActiveViewObject<SpecialAbility>>> ())
          (maybeBlessedSpecialAbilities) as List<Record<ActiveViewObject>>,
        locale
      )}
      />
  );
}
