import * as React from "react";
import { Textfit } from "react-textfit";
import { fmap, fmapF } from "../../../../Data/Functor";
import { flength, List, map, replicateR, toArray } from "../../../../Data/List";
import { fromMaybe, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { HitZoneArmorForView } from "../../../Models/View/HitZoneArmorForView";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { minus, ndash } from "../../../Utilities/Chars";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetArmorZonesProps {
  armorZones: Maybe<List<Record<HitZoneArmorForView>>>
  l10n: L10nRecord
}

const HZAFVA = HitZoneArmorForView.A

export function CombatSheetArmorZones (props: CombatSheetArmorZonesProps) {
  const { l10n, armorZones: mhit_zone_armors } = props

  return (
    <TextBox
      label={translate (l10n) ("armor")}
      className="armor armor-zones"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (l10n) ("armor")}</th>
            <th className="zone">{translate (l10n) ("head.short")}</th>
            <th className="zone">{translate (l10n) ("torso.short")}</th>
            <th className="zone">{translate (l10n) ("leftarm.short")}</th>
            <th className="zone">{translate (l10n) ("rightarm.short")}</th>
            <th className="zone">{translate (l10n) ("leftleg.short")}</th>
            <th className="zone">{translate (l10n) ("rightleg.short")}</th>
            <th className="enc">{translate (l10n) ("encumbrance.short")}</th>
            <th className="add-penalties">
              {translate (l10n) ("additionalpenalties")}
            </th>
            <th className="weight">{translate (l10n) ("weight")}</th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            mhit_zone_armors,
            fmap (pipe (
              map (e => (
                <tr key={HZAFVA.id (e)}>
                  <td className="name">
                    <Textfit max={11} min={7} mode="single">{HZAFVA.name (e)}</Textfit>
                  </td>
                  <td className="zone">{Maybe.sum (HZAFVA.head (e))}</td>
                  <td className="zone">{Maybe.sum (HZAFVA.torso (e))}</td>
                  <td className="zone">{Maybe.sum (HZAFVA.leftArm (e))}</td>
                  <td className="zone">{Maybe.sum (HZAFVA.rightArm (e))}</td>
                  <td className="zone">{Maybe.sum (HZAFVA.leftLeg (e))}</td>
                  <td className="zone">{Maybe.sum (HZAFVA.rightLeg (e))}</td>
                  <td className="enc">{HZAFVA.enc (e)}</td>
                  <td className="add-penalties">
                    {HZAFVA.addPenalties (e) ? `${minus}1/${minus}1` : ndash}
                  </td>
                  <td className="weight">
                    {pipe_ (
                      e,
                      HZAFVA.weight,
                      localizeWeight (l10n),
                      localizeNumber (l10n)
                    )}
                    {" "}
                    {translate (l10n) ("weightunit.short")}
                  </td>
                </tr>
              )),
              toArray
            )),
            fromMaybe (null as React.ReactNode)
          )}
          {replicateR (2 - Maybe.sum (fmapF (mhit_zone_armors) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
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
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
