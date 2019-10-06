import * as React from "react";
import { Textfit } from "react-textfit";
import { fmap, fmapF } from "../../../../Data/Functor";
import { flength, List, map, replicateR, toArray } from "../../../../Data/List";
import { fromMaybe, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { ShieldOrParryingWeapon } from "../../../Models/View/ShieldOrParryingWeapon";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { sign, toRoman } from "../../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybeWith } from "../../../Utilities/ReactUtils";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetShieldsProps {
  l10n: L10nRecord
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>
}

const SOPWA = ShieldOrParryingWeapon.A

export function CombatSheetShields (props: CombatSheetShieldsProps) {
  const { l10n, shieldsAndParryingWeapons: msh_or_parry_weapons } = props

  return (
    <TextBox
      label={translate (l10n) ("shieldparryingweapon")}
      className="shields"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (l10n) ("shieldparryingweapon")}
            </th>
            <th className="str">
              {translate (l10n) ("structurepoints.short")}
            </th>
            <th className="bf">{translate (l10n) ("breakingpointrating.short")}</th>
            <th className="loss">{translate (l10n) ("damaged.short")}</th>
            <th className="mod">{translate (l10n) ("attackparrymodifier.short")}</th>
            <th className="weight">{translate (l10n) ("weight")}</th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            msh_or_parry_weapons,
            fmap (pipe (
              map (e => (
                <tr key={SOPWA.id (e)}>
                  <td className="name">
                    <Textfit max={11} min={7} mode="single">{SOPWA.name (e)}</Textfit>
                  </td>
                  <td className="str">
                    {Maybe.fromMaybe<string | number> ("") (SOPWA.stp (e))}
                  </td>
                  <td className="bf">{SOPWA.bf (e)}</td>
                  <td className="loss">
                    {renderMaybeWith (toRoman) (SOPWA.loss (e))}
                  </td>
                  <td className="mod">
                    {sign (Maybe.sum (SOPWA.atMod (e)))}/{sign (Maybe.sum (SOPWA.paMod (e)))}
                  </td>
                  <td className="weight">
                    {pipe_ (
                      e,
                      SOPWA.weight,
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
          {replicateR (2 - Maybe.sum (fmapF (msh_or_parry_weapons) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name"></td>
                          <td className="str"></td>
                          <td className="bf"></td>
                          <td className="loss"></td>
                          <td className="mod"></td>
                          <td className="weight"></td>
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
