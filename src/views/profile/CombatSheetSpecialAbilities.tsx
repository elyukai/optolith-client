import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data';
import { translate } from '../../utils/I18n';
import { compressList } from '../../utils/activatableNameUtils';

export interface CombatSheetSpecialAbilitiesProps {
  combatSpecialAbilities: ActiveViewObject[];
  locale: UIMessages;
}

export function CombatSheetSpecialAbilities(props: CombatSheetSpecialAbilitiesProps) {
  const { combatSpecialAbilities, locale } = props;
  return (
    <TextBox
      className="activatable-list"
      label={translate(locale, 'charactersheet.combat.combatspecialabilities.title')}
      value={compressList(combatSpecialAbilities, locale)}
      />
  );
}
