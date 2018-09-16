import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { SecondaryAttribute } from '../../types/data';
import { Attribute, Spell, UIMessages } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { SpellsSheetSpellsTableRow } from './SpellsSheetSpellsTableRow';

export interface SpellsSheetSpellsProps {
  attributes: Attribute[];
  checkAttributeValueVisibility: boolean;
  derivedCharacteristics: SecondaryAttribute[];
  locale: UIMessages;
  spells: Spell[];
}

export function SpellsSheetSpells(props: SpellsSheetSpellsProps) {
  const { attributes, checkAttributeValueVisibility, derivedCharacteristics, locale, spells } = props;
  const sortedSpells = sortObjects(spells, locale.id);
  const list = Array<Spell | undefined>(21).fill(undefined);
  list.splice(0, Math.min(sortedSpells.length, 21), ...sortedSpells);

  return (
    <TextBox label={translate(locale, 'charactersheet.spells.spellslist.title')} className="skill-list">
      <table>
        <thead>
          <tr>
            <th className="name">{translate(locale, 'charactersheet.spells.spellslist.headers.spellritual')}</th>
            <th className="check">{translate(locale, 'charactersheet.spells.spellslist.headers.check')}</th>
            <th className="value">{translate(locale, 'charactersheet.spells.spellslist.headers.sr')}</th>
            <th className="cost">{translate(locale, 'charactersheet.spells.spellslist.headers.cost')}</th>
            <th className="cast-time">{translate(locale, 'charactersheet.spells.spellslist.headers.castingtime')}</th>
            <th className="range">{translate(locale, 'charactersheet.spells.spellslist.headers.range')}</th>
            <th className="duration">{translate(locale, 'charactersheet.spells.spellslist.headers.duration')}</th>
            <th className="property">{translate(locale, 'charactersheet.spells.spellslist.headers.property')}</th>
            <th className="ic">{translate(locale, 'charactersheet.spells.spellslist.headers.ic')}</th>
            <th className="effect">{translate(locale, 'charactersheet.spells.spellslist.headers.effect')}</th>
            <th className="ref">{translate(locale, 'charactersheet.spells.spellslist.headers.page')}</th>
          </tr>
        </thead>
        <tbody>
          {
            list.map((e, i) =>
              <SpellsSheetSpellsTableRow
                key={e ? e.id : `u${i}`}
                attributes={attributes}
                checkAttributeValueVisibility={checkAttributeValueVisibility}
                derivedCharacteristics={derivedCharacteristics}
                locale={locale}
                spell={e}
                />
            )
          }
        </tbody>
      </table>
    </TextBox>
  );
}
