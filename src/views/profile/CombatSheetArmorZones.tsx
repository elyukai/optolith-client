import * as React from 'react';
import { Textfit } from 'react-textfit';
import { TextBox } from '../../components/TextBox';
import { ArmorZone, UIMessages } from '../../types/view';
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';

export interface CombatSheetArmorZonesProps {
  armorZones: ArmorZone[];
  locale: UIMessages;
}

export function CombatSheetArmorZones(props: CombatSheetArmorZonesProps) {
  const { armorZones, locale } = props;
  const list = ([undefined, undefined, undefined, undefined] as Array<ArmorZone | undefined>);
  list.splice(0, Math.min(armorZones.length, 4), ...armorZones);
  return (
    <TextBox label={translate(locale, 'charactersheet.combat.armor.title')} className="armor armor-zones">
      <table>
        <thead>
          <tr>
            <th className="name">{translate(locale, 'charactersheet.combat.headers.armor')}</th>
            <th className="zone">{translate(locale, 'charactersheet.combat.headers.head')}</th>
            <th className="zone">{translate(locale, 'charactersheet.combat.headers.torso')}</th>
            <th className="zone">{translate(locale, 'charactersheet.combat.headers.leftarm')}</th>
            <th className="zone">{translate(locale, 'charactersheet.combat.headers.rightarm')}</th>
            <th className="zone">{translate(locale, 'charactersheet.combat.headers.leftleg')}</th>
            <th className="zone">{translate(locale, 'charactersheet.combat.headers.rightleg')}</th>
            <th className="enc">{translate(locale, 'charactersheet.combat.headers.enc')}</th>
            <th className="add-penalties">{translate(locale, 'charactersheet.combat.headers.addpenalties')}</th>
            <th className="weight">{translate(locale, 'charactersheet.combat.headers.weight')}</th>
          </tr>
        </thead>
        <tbody>
          {
            list.map((e, i) => {
              if (e) {
                return (
                  <tr key={e.id}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{e.name}</Textfit>
                    </td>
                    <td className="zone">{e.head}</td>
                    <td className="zone">{e.torso}</td>
                    <td className="zone">{e.leftArm}</td>
                    <td className="zone">{e.rightArm}</td>
                    <td className="zone">{e.leftLeg}</td>
                    <td className="zone">{e.rightLeg}</td>
                    <td className="enc">{e.enc}</td>
                    <td className="add-penalties">{e.addPenalties ? '-1/-1' : '-'}</td>
                    <td className="weight">{localizeNumber(localizeWeight(e.weight, locale.id), locale.id)} {translate(locale, 'charactersheet.combat.headers.weightunit')}</td>
                  </tr>
                );
              }
              else {
                return (
                  <tr key={`undefined${i}`}>
                    <td className="name"></td>
                    <td className="zone"></td>
                    <td className="zone"></td>
                    <td className="zone"></td>
                    <td className="zone"></td>
                    <td className="zone"></td>
                    <td className="zone"></td>
                    <td className="enc"></td>
                    <td className="add-penalties"></td>
                    <td className="weight"></td>
                  </tr>
                );
              }
            })
          }
        </tbody>
      </table>
    </TextBox>
  );
}
