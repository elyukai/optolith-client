import * as R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../../components/TextBox';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../utils/dataUtils';
import { localizeNumber, localizeWeight, translate, UIMessagesObject } from '../../../utils/I18n';
import { ArmorZone } from '../../../utils/viewData/viewTypeHelpers';

export interface CombatSheetArmorZonesProps {
  armorZones: Maybe<List<Record<ArmorZone>>>;
  locale: UIMessagesObject;
}

export function CombatSheetArmorZones (props: CombatSheetArmorZonesProps) {
  const { locale, armorZones: maybeZoneArmors } = props;

  return (
    <TextBox
      label={translate (locale, 'charactersheet.combat.armor.title')}
      className="armor armor-zones"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (locale, 'charactersheet.combat.headers.armor')}</th>
            <th className="zone">{translate (locale, 'charactersheet.combat.headers.head')}</th>
            <th className="zone">{translate (locale, 'charactersheet.combat.headers.torso')}</th>
            <th className="zone">{translate (locale, 'charactersheet.combat.headers.leftarm')}</th>
            <th className="zone">{translate (locale, 'charactersheet.combat.headers.rightarm')}</th>
            <th className="zone">{translate (locale, 'charactersheet.combat.headers.leftleg')}</th>
            <th className="zone">{translate (locale, 'charactersheet.combat.headers.rightleg')}</th>
            <th className="enc">{translate (locale, 'charactersheet.combat.headers.enc')}</th>
            <th className="add-penalties">
              {translate (locale, 'charactersheet.combat.headers.addpenalties')}
            </th>
            <th className="weight">{translate (locale, 'charactersheet.combat.headers.weight')}</th>
          </tr>
        </thead>
        <tbody>
          {Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeZoneArmors .fmap (
              zoneArmors => zoneArmors
                .map (e => (
                  <tr key={e .get ('id')}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{e .get ('name')}</Textfit>
                    </td>
                    <td className="zone">{e .lookupWithDefault<'head'> (0) ('head')}</td>
                    <td className="zone">{e .lookupWithDefault<'torso'> (0) ('torso')}</td>
                    <td className="zone">{e .lookupWithDefault<'leftArm'> (0) ('leftArm')}</td>
                    <td className="zone">{e .lookupWithDefault<'rightArm'> (0) ('rightArm')}</td>
                    <td className="zone">{e .lookupWithDefault<'leftLeg'> (0) ('leftLeg')}</td>
                    <td className="zone">{e .lookupWithDefault<'rightLeg'> (0) ('rightLeg')}</td>
                    <td className="enc">{e .lookupWithDefault<'enc'> (0) ('enc')}</td>
                    <td className="add-penalties">{e .get ('addPenalties') ? '-1/-1' : '-'}</td>
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
            (Maybe.fromMaybe (0) (maybeZoneArmors .fmap (List.lengthL)))}
        </tbody>
      </table>
    </TextBox>
  );
}
