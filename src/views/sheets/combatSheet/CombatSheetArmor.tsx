import * as R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../../components/TextBox';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../utils/dataUtils';
import { localizeNumber, localizeWeight, translate, UIMessagesObject } from '../../../utils/I18n';
import { getRoman, sign } from '../../../utils/NumberUtils';
import { Armor } from '../../../utils/viewData/viewTypeHelpers';

export interface CombatSheetArmorProps {
  armors: Maybe<List<Record<Armor>>>;
  locale: UIMessagesObject;
}

export function CombatSheetArmor (props: CombatSheetArmorProps) {
  const { locale, armors: maybeArmors } = props;

  return (
    <TextBox
      label={translate (locale, 'charactersheet.combat.armor.title')}
      className="armor"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (locale, 'charactersheet.combat.headers.armor')}</th>
            <th className="st">{translate (locale, 'charactersheet.combat.headers.st')}</th>
            <th className="loss">{translate (locale, 'charactersheet.combat.headers.loss')}</th>
            <th className="pro">{translate (locale, 'charactersheet.combat.headers.pro')}</th>
            <th className="enc">{translate (locale, 'charactersheet.combat.headers.enc')}</th>
            <th className="add-penalties">
              {translate (locale, 'charactersheet.combat.headers.addpenalties')}
            </th>
            <th className="weight">{translate (locale, 'charactersheet.combat.headers.weight')}</th>
            <th className="where">{translate (locale, 'charactersheet.combat.headers.where')}</th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeArmors .fmap (
              armors => armors
                .map (e => {
                  const addPenalties = Maybe.catMaybes<string> (
                    List.of (
                      e .get ('mov') !== 0
                        ? Just (
                          `${sign (e .get ('mov'))} ${translate (locale, 'secondaryattributes.mov.short')}`
                        )
                        : Nothing (),
                      e .get ('ini') !== 0
                        ? Just (
                          `${sign (e .get ('ini'))} ${translate (locale, 'secondaryattributes.ini.short')}`
                        )
                        : Nothing ()
                    )
                  );

                  return (
                    <tr key={e .get ('id')}>
                      <td className="name">
                        <Textfit max={11} min={7} mode="single">{e .get ('name')}</Textfit>
                      </td>
                      <td className="st">{e .lookupWithDefault<'st'> (0) ('st')}</td>
                      <td className="loss">
                        {Maybe.fromMaybe ('') (e .lookup ('loss') .fmap (getRoman))}
                      </td>
                      <td className="pro">{e .lookupWithDefault<'pro'> (0) ('pro')}</td>
                      <td className="enc">{e .lookupWithDefault<'enc'> (0) ('enc')}</td>
                      <td className="add-penalties">
                        {addPenalties .null () ? '-' : addPenalties .intercalate (', ')}
                      </td>
                      <td className="weight">
                        {Maybe.fromMaybe<string | number>
                          ('')
                          (e .lookup ('weight') .fmap (
                            weight => localizeNumber (locale .get ('id'))
                                                     (localizeWeight (locale .get ('id')) (weight))
                          ))}
                        {' '}
                        {translate (locale, 'charactersheet.combat.headers.weightunit')}
                      </td>
                      <td className="where">
                        <Textfit max={11} min={7} mode="single">
                          {e .lookupWithDefault<'where'> ('') ('where')}
                        </Textfit>
                      </td>
                    </tr>
                  );
                })
                .toArray ()
            ))}
          {List.unfoldr<JSX.Element, number>
            (x => x >= 4
              ? Nothing ()
              : Just (
                Tuple.of<JSX.Element, number>
                  (
                    <tr key={`undefined${3 - x}`}>
                      <td className="name"></td>
                      <td className="st"></td>
                      <td className="loss"></td>
                      <td className="pro"></td>
                      <td className="enc"></td>
                      <td className="add-penalties"></td>
                      <td className="weight"></td>
                      <td className="where"></td>
                    </tr>
                  )
                  (R.inc (x))
              )
            )
            (Maybe.fromMaybe (0) (maybeArmors .fmap (List.lengthL)))}
        </tbody>
      </table>
    </TextBox>
  );
}
