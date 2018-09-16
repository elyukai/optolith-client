import * as React from 'react';
import { translate, UIMessages } from '../../utils/I18n';

export interface AdvantagesDisadvantagesAdventurePointsProps {
  total: number;
  magical: number;
  magicalMax: number;
  blessed: number;
  locale: UIMessages;
}

export function AdvantagesDisadvantagesAdventurePoints(props: AdvantagesDisadvantagesAdventurePointsProps) {
  const {
    total,
    magical,
    magicalMax,
    blessed,
    locale,
  } = props;

  return (
    <p>
      {translate(locale, 'titlebar.adventurepoints.advantages', total, 80)}<br/>
      {magical > 0 && translate(locale, 'titlebar.adventurepoints.advantagesmagic', magical, magicalMax)}
      {magical > 0 && blessed > 0 && <br/>}
      {blessed > 0 && translate(locale, 'titlebar.adventurepoints.advantagesblessed', blessed, 50)}
    </p>
  );
}
