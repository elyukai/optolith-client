import * as React from 'react';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { Maybe } from '../../utils/dataUtils';

export interface AdvantagesDisadvantagesAdventurePointsProps {
  total: number;
  magical: number;
  magicalMax: Maybe<number>;
  blessed: number;
  locale: UIMessagesObject;
}

export function AdvantagesDisadvantagesAdventurePoints (
  props: AdvantagesDisadvantagesAdventurePointsProps
) {
  const {
    total,
    magical,
    magicalMax,
    blessed,
    locale,
  } = props;

  return (
    <p>
      {translate (locale, 'titlebar.adventurepoints.advantages', total, 80)}<br/>
      {
        magical > 0
        && translate (
          locale,
          'titlebar.adventurepoints.advantagesmagic',
          magical,
          Maybe.fromMaybe (50) (magicalMax)
        )
      }
      {magical > 0 && blessed > 0 && <br/>}
      {
        blessed > 0
        && translate (
          locale,
          'titlebar.adventurepoints.advantagesblessed',
          blessed,
          50
        )
      }
    </p>
  );
}
