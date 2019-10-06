import * as React from "react";
import { Textfit } from "react-textfit";
import { fmap, fmapF } from "../../../../Data/Functor";
import { flength, intercalate, List, map, replicateR, toArray } from "../../../../Data/List";
import { fromMaybe, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { RangedWeapon } from "../../../Models/View/RangedWeapon";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { signZero, toRoman } from "../../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetRangedWeaponProps {
  l10n: L10nRecord
  rangedWeapons: Maybe<List<Record<RangedWeapon>>>
}

const RWA = RangedWeapon.A

export function CombatSheetRangedWeapons (props: CombatSheetRangedWeaponProps) {
  const { l10n, rangedWeapons: mranged_weapons } = props

  return (
    <TextBox
      label={translate (l10n) ("rangedcombatweapons")}
      className="melee-weapons"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (l10n) ("weapon")}</th>
            <th className="combat-technique">
              {translate (l10n) ("combattechnique")}
            </th>
            <th className="reload-time">
              {translate (l10n) ("reloadtime")}
            </th>
            <th className="damage">{translate (l10n) ("damagepoints.short")}</th>
            <th className="ammunition">
              {translate (l10n) ("ammunition")}
            </th>
            <th className="range">
              {translate (l10n) ("rangebrackets")}
            </th>
            <th className="bf">{translate (l10n) ("breakingpointrating.short")}</th>
            <th className="loss">{translate (l10n) ("damaged.short")}</th>
            <th className="ranged">
              {translate (l10n) ("rangedcombat")}
            </th>
            <th className="weight">{translate (l10n) ("weight")}</th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            mranged_weapons,
            fmap (pipe (
              map (e => (
                <tr key={RWA.id (e)}>
                  <td className="name">
                    <Textfit max={11} min={7} mode="single">{RWA.name (e)}</Textfit>
                  </td>
                  <td className="combat-technique">{RWA.combatTechnique (e)}</td>
                  <td className="reload-time">
                    {renderMaybe (RWA.reloadTime (e))}
                    {" "}
                    {translate (l10n) ("actions")}
                  </td>
                  <td className="damage">
                    {renderMaybe (RWA.damageDiceNumber (e))}
                    {translate (l10n) ("dice.short")}
                    {renderMaybe (RWA.damageDiceSides (e))}
                    {signZero (Maybe.sum (RWA.damageFlat (e)))}
                  </td>
                  <td className="ammunition">
                    {renderMaybe (RWA.ammunition (e))}
                  </td>
                  <td className="range">
                    {renderMaybeWith (intercalate ("/")) (RWA.range (e))}
                  </td>
                  <td className="bf">{RWA.bf (e)}</td>
                  <td className="loss">
                    {renderMaybeWith (toRoman) (RWA.loss (e))}
                  </td>
                  <td className="ranged">{RWA.at (e)}</td>
                  <td className="weight">
                    {pipe_ (
                      e,
                      RWA.weight,
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
          {replicateR (2 - Maybe.sum (fmapF (mranged_weapons) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
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
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
