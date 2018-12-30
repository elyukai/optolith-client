import * as React from 'react';
import { TextBox } from '../../../components/TextBox';
import { ActiveViewObject } from '../../../types/data';
import { compressList } from '../../../utils/activatable/activatableNameUtils';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { SpecialAbility } from '../../../utils/wikiData/wikiTypeHelpers';

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
