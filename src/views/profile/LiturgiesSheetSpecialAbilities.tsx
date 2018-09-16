import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data';
import { translate } from '../../utils/I18n';
import { compressList } from '../../utils/activatableNameUtils';

export interface LiturgiesSheetSpecialAbilitiesProps {
  blessedSpecialAbilities: ActiveViewObject[];
  locale: UIMessages;
}

export function LiturgiesSheetSpecialAbilities(props: LiturgiesSheetSpecialAbilitiesProps) {
  const { blessedSpecialAbilities, locale } = props;
  return (
    <TextBox
      className="activatable-list"
      label={translate(locale, 'charactersheet.chants.blessedspecialabilities.title')}
      value={compressList(blessedSpecialAbilities, locale)}
      />
  );
}
