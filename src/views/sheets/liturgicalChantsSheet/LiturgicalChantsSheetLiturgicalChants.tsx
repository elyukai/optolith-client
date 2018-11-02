import * as R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../../components/TextBox';
import { SecondaryAttribute } from '../../../types/data';
import { AttributeCombined, LiturgicalChantWithRequirements } from '../../../types/view';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../utils/dataUtils';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { getICName } from '../../../utils/improvementCostUtils';
import { getAttributeStringByIdList } from '../../../utils/sheetUtils';

export interface LiturgicalChantsSheetLiturgicalChantsProps {
  attributes: List<Record<AttributeCombined>>;
  checkAttributeValueVisibility: boolean;
  derivedCharacteristics: List<Record<SecondaryAttribute>>;
  liturgicalChants: Maybe<List<Record<LiturgicalChantWithRequirements>>>;
  locale: UIMessagesObject;
}

export function LiturgicalChantsSheetLiturgicalChants (
  props: LiturgicalChantsSheetLiturgicalChantsProps
) {
  const {
    attributes,
    checkAttributeValueVisibility,
    derivedCharacteristics,
    locale,
    liturgicalChants: maybeLiturgicalChants,
  } = props;

  const aspectNames = translate (locale, 'liturgies.view.aspects');

  return (
    <TextBox
      label={translate (locale, 'charactersheet.chants.chantslist.title')}
      className="skill-list"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (locale, 'charactersheet.chants.chantslist.headers.liturgyceremony')}
            </th>
            <th className="check">
              {translate (locale, 'charactersheet.chants.chantslist.headers.check')}
            </th>
            <th className="value">
              {translate (locale, 'charactersheet.chants.chantslist.headers.sr')}
            </th>
            <th className="cost">
              {translate (locale, 'charactersheet.chants.chantslist.headers.cost')}
            </th>
            <th className="cast-time">
              {translate (locale, 'charactersheet.chants.chantslist.headers.castingtime')}
            </th>
            <th className="range">
              {translate (locale, 'charactersheet.chants.chantslist.headers.range')}
            </th>
            <th className="duration">
              {translate (locale, 'charactersheet.chants.chantslist.headers.duration')}
            </th>
            <th className="aspect">
              {translate (locale, 'charactersheet.chants.chantslist.headers.property')}
            </th>
            <th className="ic">
              {translate (locale, 'charactersheet.chants.chantslist.headers.ic')}
            </th>
            <th className="effect">
              {translate (locale, 'charactersheet.chants.chantslist.headers.effect')}
            </th>
            <th className="ref">
              {translate (locale, 'charactersheet.chants.chantslist.headers.page')}
            </th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeLiturgicalChants .fmap (
              liturgicalChants => liturgicalChants
                .map (e => {
                  const check = getAttributeStringByIdList (checkAttributeValueVisibility)
                                                           (attributes)
                                                           (e .get ('check'));

                  return (
                    <tr>
                      <td className="name">
                        <Textfit max={11} min={7} mode="single">{e .get ('name')}</Textfit>
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
                      <td className="aspect">
                        <Textfit max={11} min={7} mode="single">
                          {sortStrings (locale .get ('id'))
                                       (
                                         Maybe.mapMaybe<number, string>
                                           (R.pipe (
                                             R.dec,
                                             List.subscript (aspectNames)
                                           ))
                                           (e .get ('aspects'))
                                       )}
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
                      <td className="aspect"></td>
                      <td className="ic"></td>
                      <td className="effect"></td>
                      <td className="ref"></td>
                    </tr>
                  )
                  (R.inc (x))
              )
            )
            (Maybe.fromMaybe (0) (maybeLiturgicalChants .fmap (List.lengthL)))}
          }
        </tbody>
      </table>
    </TextBox>
  );
}
