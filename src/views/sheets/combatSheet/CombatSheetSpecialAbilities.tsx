import * as React from 'react';
import { TextBox } from '../../../components/TextBox';
import { ActiveViewObject } from '../../../types/data';
import { SpecialAbility } from '../../../types/wiki';
import { compressList } from '../../../utils/activatableNameUtils';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';

export interface CombatSheetSpecialAbilitiesProps {
  combatSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
  locale: UIMessagesObject;
}

export function CombatSheetSpecialAbilities (props: CombatSheetSpecialAbilitiesProps) {
  const { combatSpecialAbilities: maybeCombatSpecialAbilities, locale } = props;

  return (
    <TextBox
      className="activatable-list"
      label={translate (locale, 'charactersheet.combat.combatspecialabilities.title')}
      value={compressList (
        Maybe.fromMaybe<List<Record<ActiveViewObject<SpecialAbility>>>>
          (List.empty<Record<ActiveViewObject<SpecialAbility>>> ())
          (maybeCombatSpecialAbilities) as List<Record<ActiveViewObject>>,
        locale
      )}
      />
  );
}
