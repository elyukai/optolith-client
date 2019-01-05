import * as R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { AttributeCombined, SpellCombined } from '../../../App/Models/View/viewTypeHelpers';
import { TextBox } from '../../../components/TextBox';
import { SecondaryAttribute } from '../../../types/data';
import { getICName } from '../../../utils/adventurePoints/improvementCostUtils';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../utils/dataUtils';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { getAttributeStringByIdList } from '../../../utils/sheetUtils';

export interface SpellsSheetSpellsProps {
  attributes: List<Record<AttributeCombined>>;
  checkAttributeValueVisibility: boolean;
  derivedCharacteristics: List<Record<SecondaryAttribute>>;
  locale: UIMessagesObject;
  spells: Maybe<List<Record<SpellCombined>>>;
}

export function SpellsSheetSpells (props: SpellsSheetSpellsProps) {
  const {
    attributes,
    checkAttributeValueVisibility,
    derivedCharacteristics,
    locale,
    spells: maybeSpells,
  } = props;

  const propertyNames = translate (locale, 'spells.view.properties');
  const traditionNames = translate (locale, 'spells.view.traditions');

  return (
    <TextBox
      label={translate (locale, 'charactersheet.spells.spellslist.title')}
      className="skill-list"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (locale, 'charactersheet.spells.spellslist.headers.spellritual')}
            </th>
            <th className="check">
              {translate (locale, 'charactersheet.spells.spellslist.headers.check')}
            </th>
            <th className="value">
              {translate (locale, 'charactersheet.spells.spellslist.headers.sr')}
            </th>
            <th className="cost">
              {translate (locale, 'charactersheet.spells.spellslist.headers.cost')}
            </th>
            <th className="cast-time">
              {translate (locale, 'charactersheet.spells.spellslist.headers.castingtime')}
            </th>
            <th className="range">
              {translate (locale, 'charactersheet.spells.spellslist.headers.range')}
            </th>
            <th className="duration">
              {translate (locale, 'charactersheet.spells.spellslist.headers.duration')}
            </th>
            <th className="property">
              {translate (locale, 'charactersheet.spells.spellslist.headers.property')}
            </th>
            <th className="ic">
              {translate (locale, 'charactersheet.spells.spellslist.headers.ic')}
            </th>
            <th className="effect">
              {translate (locale, 'charactersheet.spells.spellslist.headers.effect')}
            </th>
            <th className="ref">
              {translate (locale, 'charactersheet.spells.spellslist.headers.page')}
            </th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeSpells .fmap (
              spells => spells
                .map (e => {
                  const check = getAttributeStringByIdList (checkAttributeValueVisibility)
                                                           (attributes)
                                                           (e .get ('check'));

                  return (
                    <tr>
                      <td className="name">
                        <Textfit max={11} min={7} mode="single">
                          {e .get ('name')}
                          {e .get ('tradition') .null ()
                            ? ''
                            : ` (${
                              sortStrings
                                (locale .get ('id'))
                                (
                                  Maybe.mapMaybe<number, string>
                                    (R.pipe (
                                      R.dec,
                                      List.subscript (traditionNames)
                                    ))
                                    (e .get ('tradition'))
                                )
                                .intercalate (', ')
                            })`}
                        </Textfit>
                      </td>
                      <td className="check">
                        <Textfit max={11} min={7} mode="single">
                          {check}
                          {Maybe.fromMaybe
                            ('')
                            (e
                              .lookup ('checkmod')
                              .bind (
                                checkmod => derivedCharacteristics
                                  .find (derived => derived .get ('id') === checkmod)
                              )
                              .fmap (checkmod => ` (+${checkmod .get ('short')})`))}
                        </Textfit>
                      </td>
                      <td className="value">{e .get ('value')}</td>
                      <td className="cost">
                        <Textfit max={11} min={7} mode="single">{e .get ('costShort')}</Textfit>
                      </td>
                      <td className="cast-time">
                        <Textfit max={11} min={7} mode="single">
                          {e .get ('castingTimeShort')}
                        </Textfit>
                      </td>
                      <td className="range">
                        <Textfit max={11} min={7} mode="single">{e .get ('rangeShort')}</Textfit>
                      </td>
                      <td className="duration">
                        <Textfit max={11} min={7} mode="single">{e .get ('durationShort')}</Textfit>
                      </td>
                      <td className="property">
                        <Textfit max={11} min={7} mode="single">
                          {Maybe.fromMaybe
                            ('')
                            (propertyNames .subscript (e .get ('property') - 1))}
                        </Textfit>
                      </td>
                      <td className="ic">{getICName (e .get ('ic'))}</td>
                      <td className="effect"></td>
                      <td className="ref"></td>
                    </tr>
                  );
                })
                .toArray ()
            ))}
          {List.unfoldr<JSX.Element, number>
            (x => x >= 21
              ? Nothing ()
              : Just (
                Tuple.of<JSX.Element, number>
                  (
                    <tr key={`undefined${20 - x}`}>
                      <td className="name"></td>
                      <td className="check"></td>
                      <td className="value"></td>
                      <td className="cost"></td>
                      <td className="cast-time"></td>
                      <td className="range"></td>
                      <td className="duration"></td>
                      <td className="property"></td>
                      <td className="ic"></td>
                      <td className="effect"></td>
                      <td className="ref"></td>
                    </tr>
                  )
                  (R.inc (x))
              )
            )
            (Maybe.fromMaybe (0) (maybeSpells .fmap (List.lengthL)))}
          }
        </tbody>
      </table>
    </TextBox>
  );
}
