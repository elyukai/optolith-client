import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data';
import { compressList } from '../../utils/activatableNameUtils';
import { translate } from '../../utils/I18n';

export interface SpellsSheetSpecialAbilitiesProps {
  locale: UIMessages;
  magicalSpecialAbilities: ActiveViewObject[];
}

export function SpellsSheetSpecialAbilities(props: SpellsSheetSpecialAbilitiesProps) {
  const { locale, magicalSpecialAbilities } = props;
  return (
    <TextBox
      className="activatable-list"
      label={translate(locale, 'charactersheet.spells.magicalspecialabilities.title')}
      value={compressList(magicalSpecialAbilities, locale)}
      />
  );
}
