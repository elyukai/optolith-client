import * as React from 'react';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { TextBox } from '../../../components/TextBox';
import { ActiveViewObject } from '../../../types/data';
import { compressList } from '../../../utils/activatable/activatableNameUtils';
import { List, Maybe, Record } from '../../../utils/dataUtils';

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
