import * as R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { ShieldOrParryingWeapon } from '../../../App/Models/View/viewTypeHelpers';
import { localizeNumber, localizeWeight, translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { getRoman, sign } from '../../../App/Utils/NumberUtils';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../Utilities/dataUtils';
import { TextBox } from '../../Universal/TextBox';

export interface CombatSheetShieldsProps {
  locale: UIMessagesObject;
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>;
}

export function CombatSheetShields (props: CombatSheetShieldsProps) {
  const { locale, shieldsAndParryingWeapons: maybeShieldsAndParryingWeapons } = props;

  return (
    <TextBox
      label={translate (locale, 'charactersheet.combat.shieldparryingweapon.title')}
      className="shields"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (locale, 'charactersheet.combat.headers.shieldparryingweapon')}
            </th>
            <th className="str">
              {translate (locale, 'charactersheet.combat.headers.structurepoints')}
            </th>
            <th className="bf">{translate (locale, 'charactersheet.combat.headers.bf')}</th>
            <th className="loss">{translate (locale, 'charactersheet.combat.headers.loss')}</th>
            <th className="mod">{translate (locale, 'charactersheet.combat.headers.atpamod')}</th>
            <th className="weight">{translate (locale, 'charactersheet.combat.headers.weight')}</th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeShieldsAndParryingWeapons .fmap (
              shieldsAndParryingWeapons => shieldsAndParryingWeapons
                .map (e => (
                  <tr key={e .get ('id')}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{e .get ('name')}</Textfit>
                    </td>
                    <td className="str">
                      {Maybe.fromMaybe<string | number> ('') (e .lookup ('stp'))}
                    </td>
                    <td className="bf">{e .get ('bf')}</td>
                    <td className="loss">
                      {Maybe.fromMaybe ('') (e .lookup ('loss') .fmap (getRoman))}
                    </td>
                    <td className="mod">
                      {sign (e .lookupWithDefault<'atMod'> (0) ('atMod'))}
                      /
                      {sign (e .lookupWithDefault<'paMod'> (0) ('paMod'))}
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
                  </tr>
                ))
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
                      <td className="str"></td>
                      <td className="bf"></td>
                      <td className="loss"></td>
                      <td className="mod"></td>
                      <td className="weight"></td>
                    </tr>
                  )
                  (R.inc (x))
              )
            )
            (Maybe.fromMaybe (0) (maybeShieldsAndParryingWeapons .fmap (List.lengthL)))}
        </tbody>
      </table>
    </TextBox>
  );
}
