import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { SecondaryAttribute } from '../../types/data';
import { Attribute, Liturgy, UIMessages } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { LiturgiesSheetLiturgiesTableRow } from './LiturgiesSheetLiturgiesTableRow';

export interface LiturgiesSheetLiturgiesProps {
  attributes: Attribute[];
  checkAttributeValueVisibility: boolean;
  derivedCharacteristics: SecondaryAttribute[];
  liturgies: Liturgy[];
  locale: UIMessages;
}

export function LiturgiesSheetLiturgies(props: LiturgiesSheetLiturgiesProps) {
  const { liturgies, locale } = props;
  const sortedLiturgies = sortObjects(liturgies, locale.id);
  const list = Array<Liturgy | undefined>(21).fill(undefined);
  list.splice(0, Math.min(sortedLiturgies.length, 21), ...sortedLiturgies);

  return (
    <TextBox label={translate(locale, 'charactersheet.chants.chantslist.title')} className="skill-list">
      <table>
        <thead>
          <tr>
            <th className="name">{translate(locale, 'charactersheet.chants.chantslist.headers.liturgyceremony')}</th>
            <th className="check">{translate(locale, 'charactersheet.chants.chantslist.headers.check')}</th>
            <th className="value">{translate(locale, 'charactersheet.chants.chantslist.headers.sr')}</th>
            <th className="cost">{translate(locale, 'charactersheet.chants.chantslist.headers.cost')}</th>
            <th className="cast-time">{translate(locale, 'charactersheet.chants.chantslist.headers.castingtime')}</th>
            <th className="range">{translate(locale, 'charactersheet.chants.chantslist.headers.range')}</th>
            <th className="duration">{translate(locale, 'charactersheet.chants.chantslist.headers.duration')}</th>
            <th className="aspect">{translate(locale, 'charactersheet.chants.chantslist.headers.property')}</th>
            <th className="ic">{translate(locale, 'charactersheet.chants.chantslist.headers.ic')}</th>
            <th className="effect">{translate(locale, 'charactersheet.chants.chantslist.headers.effect')}</th>
            <th className="ref">{translate(locale, 'charactersheet.chants.chantslist.headers.page')}</th>
          </tr>
        </thead>
        <tbody>
          {
            list.map((e, i) =>
              <LiturgiesSheetLiturgiesTableRow
                {...props}
                key={e ? e.id : `u${i}`}
                liturgy={e}
                />
            )
          }
        </tbody>
      </table>
    </TextBox>
  );
}
