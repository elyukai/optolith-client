import R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../../components/TextBox';
import { RangedWeapon } from '../../../types/view';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../utils/dataUtils';
import { localizeNumber, localizeWeight, translate, UIMessagesObject } from '../../../utils/I18n';
import { getRoman, signNull } from '../../../utils/NumberUtils';

export interface CombatSheetRangedWeaponProps {
  locale: UIMessagesObject;
  rangedWeapons: Maybe<List<Record<RangedWeapon>>>;
}

export function CombatSheetRangedWeapons (props: CombatSheetRangedWeaponProps) {
  const { locale, rangedWeapons: maybeRangedWeapons } = props;

  return (
    <TextBox
      label={translate (locale, 'charactersheet.combat.rangedcombatweapons.title')}
      className="melee-weapons"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (locale, 'charactersheet.combat.headers.weapon')}</th>
            <th className="combat-technique">
              {translate (locale, 'charactersheet.combat.headers.combattechnique')}
            </th>
            <th className="reload-time">
              {translate (locale, 'charactersheet.combat.headers.reloadtime')}
            </th>
            <th className="damage">{translate (locale, 'charactersheet.combat.headers.dp')}</th>
            <th className="ammunition">
              {translate (locale, 'charactersheet.combat.headers.ammunition')}
            </th>
            <th className="range">
              {translate (locale, 'charactersheet.combat.headers.rangebrackets')}
            </th>
            <th className="bf">{translate (locale, 'charactersheet.combat.headers.bf')}</th>
            <th className="loss">{translate (locale, 'charactersheet.combat.headers.loss')}</th>
            <th className="ranged">
              {translate (locale, 'charactersheet.combat.headers.rangedcombat')}
            </th>
            <th className="weight">{translate (locale, 'charactersheet.combat.headers.weight')}</th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeRangedWeapons .fmap (
              rangedWeapons => rangedWeapons
                .map (e => {
                  return (
                    <tr key={e .get ('id')}>
                      <td className="name">
                        <Textfit max={11} min={7} mode="single">{e .get ('name')}</Textfit>
                      </td>
                      <td className="combat-technique">{e .get ('combatTechnique')}</td>
                      <td className="reload-time">
                        {e .lookupWithDefault<'reloadTime'> (0) ('reloadTime')}
                        {' '}
                        {translate (locale, 'charactersheet.combat.content.actions')}
                      </td>
                      <td className="damage">
                        {Maybe.fromMaybe<string | number> ('') (e .lookup ('damageDiceNumber'))}
                        {translate (locale, 'charactersheet.combat.content.dice')}
                        {Maybe.fromMaybe<string | number> ('') (e .lookup ('damageDiceSides'))}
                        {signNull (e .lookupWithDefault<'damageFlat'> (0) ('damageFlat'))}
                      </td>
                      <td className="ammunition">
                        {Maybe.fromMaybe<string | number> ('') (e .lookup ('ammunition'))}
                      </td>
                      <td className="range">
                        {Maybe.fromMaybe ('') (e .lookup ('range') .fmap (List.intercalate ('/')))}
                      </td>
                      <td className="bf">{e .get ('bf')}</td>
                      <td className="loss">
                        {Maybe.fromMaybe ('') (e .lookup ('loss') .fmap (getRoman))}
                      </td>
                      <td className="ranged">{e .get ('at')}</td>
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
                      <td className="combat-technique"></td>
                      <td className="reload-time"></td>
                      <td className="damage"></td>
                      <td className="ammunition"></td>
                      <td className="range"></td>
                      <td className="bf"></td>
                      <td className="loss"></td>
                      <td className="ranged"></td>
                      <td className="weight"></td>
                    </tr>
                  )
                  (R.inc (x))
              )
            )
            (Maybe.fromMaybe (0) (maybeRangedWeapons .fmap (List.lengthL)))}
        </tbody>
      </table>
    </TextBox>
  );
}
