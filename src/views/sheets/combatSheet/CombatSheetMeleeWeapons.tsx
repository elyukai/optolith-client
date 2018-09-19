import * as R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../../components/TextBox';
import { MeleeWeapon } from '../../../types/view';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../utils/dataUtils';
import { localizeNumber, localizeWeight, translate, UIMessagesObject } from '../../../utils/I18n';
import { getRoman, sign, signNull } from '../../../utils/NumberUtils';

export interface CombatSheetMeleeWeaponsProps {
  locale: UIMessagesObject;
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>;
}

export function CombatSheetMeleeWeapons (props: CombatSheetMeleeWeaponsProps) {
  const { locale, meleeWeapons: maybeMeleeWeapons } = props;

  return (
    <TextBox
      label={translate (locale, 'charactersheet.combat.closecombatweapons.title')}
      className="melee-weapons"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (locale, 'charactersheet.combat.headers.weapon')}</th>
            <th className="combat-technique">
              {translate (locale, 'charactersheet.combat.headers.combattechnique')}
            </th>
            <th className="damage-bonus">
              {translate (locale, 'charactersheet.combat.headers.damagebonus')}
            </th>
            <th className="damage">{translate (locale, 'charactersheet.combat.headers.dp')}</th>
            <th className="mod" colSpan={2}>
              {translate (locale, 'charactersheet.combat.headers.atpamod')}
            </th>
            <th className="reach">{translate (locale, 'charactersheet.combat.headers.reach')}</th>
            <th className="bf">{translate (locale, 'charactersheet.combat.headers.bf')}</th>
            <th className="loss">{translate (locale, 'charactersheet.combat.headers.loss')}</th>
            <th className="at">{translate (locale, 'charactersheet.combat.headers.at')}</th>
            <th className="pa">{translate (locale, 'charactersheet.combat.headers.pa')}</th>
            <th className="weight">{translate (locale, 'charactersheet.combat.headers.weight')}</th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeMeleeWeapons .fmap (
              meleeWeapons => meleeWeapons
                .map (e => {
                  const primaryBonus = e .get ('primaryBonus');

                  return (
                    <tr key={e .get ('id')}>
                      <td className="name">
                        <Textfit max={11} min={7} mode="single">{e .get ('name')}</Textfit>
                      </td>
                      <td className="combat-technique">{e .get ('combatTechnique')}</td>
                      <td className="damage-bonus">
                        {primaryBonus instanceof List
                          ? List.zip<string, number> (e .get ('primary')) (primaryBonus)
                            .map (pair => `${Tuple.fst (pair)} ${Tuple.snd (pair)}`)
                            .intercalate ('/')
                          : `${e .get ('primary') .intercalate ('/')} ${primaryBonus}`}
                      </td>
                      <td className="damage">
                        {Maybe.fromMaybe<string | number> ('') (e .lookup ('damageDiceNumber'))}
                        {translate (locale, 'charactersheet.combat.content.dice')}
                        {Maybe.fromMaybe<string | number> ('') (e .lookup ('damageDiceSides'))}
                        {signNull (e .get ('damageFlat'))}
                      </td>
                      <td className="at-mod mod">
                        {sign (e .lookupWithDefault<'atMod'> (0) ('atMod'))}
                      </td>
                      <td className="pa-mod mod">
                        {sign (e .lookupWithDefault<'paMod'> (0) ('paMod'))}
                      </td>
                      <td className="reach">
                        {Maybe.fromMaybe
                          ('')
                          (e .lookup ('reach') .bind (R.pipe (
                            R.dec,
                            List.subscript (
                              translate (locale, 'charactersheet.combat.headers.reachlabels')
                            )
                          )))}
                      </td>
                      <td className="bf">{e .get ('bf')}</td>
                      <td className="loss">
                        {Maybe.fromMaybe ('') (e .lookup ('loss') .fmap (getRoman))}
                      </td>
                      <td className="at">{e .get ('at')}</td>
                      <td className="pa">
                        {Maybe.fromMaybe<string | number> ('--') (e .lookup ('pa'))}
                      </td>
                      <td className="weight">
                        {Maybe.fromMaybe<string | number>
                          ('')
                          (e .lookup ('weight') .fmap (
                            weight => localizeNumber (
                              localizeWeight (weight, locale .get ('id')),
                              locale .get ('id')
                            )
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
                      <td className="damage-bonus"></td>
                      <td className="damage"></td>
                      <td className="at-mod mod"></td>
                      <td className="pa-mod mod"></td>
                      <td className="reach"></td>
                      <td className="bf"></td>
                      <td className="loss"></td>
                      <td className="at"></td>
                      <td className="pa"></td>
                      <td className="weight"></td>
                    </tr>
                  )
                  (R.inc (x))
              )
            )
            (Maybe.fromMaybe (0) (maybeMeleeWeapons .fmap (List.lengthL)))}
        </tbody>
      </table>
    </TextBox>
  );
}
