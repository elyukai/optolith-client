import * as React from "react";
import { Textfit } from "react-textfit";
import { fmap, fmapF } from "../../../../Data/Functor";
import { flength, intercalate, List, map, replicateR, subscript, subscriptF, toArray } from "../../../../Data/List";
import { bindF, fromMaybe, Maybe } from "../../../../Data/Maybe";
import { dec } from "../../../../Data/Num";
import { Record } from "../../../../Data/Record";
import { bimap, fst, isTuple, snd } from "../../../../Data/Tuple";
import { MeleeWeapon } from "../../../Models/View/MeleeWeapon";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { ndash } from "../../../Utilities/Chars";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { sign, signZero, toRoman } from "../../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetMeleeWeaponsProps {
  l10n: L10nRecord
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>
}

const MWA = MeleeWeapon.A

export function CombatSheetMeleeWeapons (props: CombatSheetMeleeWeaponsProps) {
  const { l10n, meleeWeapons: mmelee_weapons } = props

  return (
    <TextBox
      label={translate (l10n) ("closecombatweapons")}
      className="melee-weapons"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (l10n) ("weapon")}</th>
            <th className="combat-technique">
              {translate (l10n) ("combattechnique")}
            </th>
            <th className="damage-bonus">
              {translate (l10n) ("damagebonus.medium")}
            </th>
            <th className="damage">{translate (l10n) ("damagepoints.short")}</th>
            <th className="mod" colSpan={2}>
              {translate (l10n) ("attackparrymodifier.short")}
            </th>
            <th className="reach">{translate (l10n) ("reach")}</th>
            <th className="bf">{translate (l10n) ("breakingpointrating.short")}</th>
            <th className="loss">{translate (l10n) ("damaged.short")}</th>
            <th className="at">{translate (l10n) ("attack.short")}</th>
            <th className="pa">{translate (l10n) ("parry.short")}</th>
            <th className="weight">{translate (l10n) ("weight")}</th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            mmelee_weapons,
            fmap (pipe (
              map (e => {
                const primaryBonus = MWA.primaryBonus (e)

                const getPrimaryAtIndex =
                  (i: number) => pipe (MWA.primary, subscriptF (i), renderMaybe)

                return (
                  <tr key={MWA.id (e)}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{MWA.name (e)}</Textfit>
                    </td>
                    <td className="combat-technique">{MWA.combatTechnique (e)}</td>
                    <td className="damage-bonus">
                      {isTuple (primaryBonus)
                        ? pipe_ (
                            primaryBonus,
                            bimap (first => `${getPrimaryAtIndex (0) (e)} ${first}`)
                                  (second => `${getPrimaryAtIndex (1) (e)} ${second}`),
                            p => `${fst (p)}/${snd (p)}`
                          )
                        : `${intercalate ("/") (MWA.primary (e))} ${primaryBonus}`}
                    </td>
                    <td className="damage">
                      {renderMaybe (MWA.damageDiceNumber (e))}
                      {translate (l10n) ("dice.short")}
                      {renderMaybe (MWA.damageDiceSides (e))}
                      {signZero (MWA.damageFlat (e))}
                    </td>
                    <td className="at-mod mod">
                      {sign (Maybe.sum (MWA.atMod (e)))}
                    </td>
                    <td className="pa-mod mod">
                      {sign (Maybe.sum (MWA.paMod (e)))}
                    </td>
                    <td className="reach">
                      {pipe_ (
                        e,
                        MWA.reach,
                        bindF (pipe (
                          dec,
                          subscript (translate (l10n) ("reachlabels"))
                        )),
                        renderMaybe
                      )}
                    </td>
                    <td className="bf">{MWA.bf (e)}</td>
                    <td className="loss">
                      {renderMaybeWith (toRoman) (MWA.loss (e))}
                    </td>
                    <td className="at">{MWA.at (e)}</td>
                    <td className="pa">
                      {fromMaybe<string | number> (ndash) (MWA.pa (e))}
                    </td>
                    <td className="weight">
                      {pipe_ (
                        e,
                        MWA.weight,
                        localizeWeight (l10n),
                        localizeNumber (l10n)
                      )}
                      {" "}
                      {translate (l10n) ("weightunit.short")}
                    </td>
                  </tr>
                )
              }),
              toArray
            )),
            fromMaybe (null as React.ReactNode)
          )}
          {replicateR (2 - Maybe.sum (fmapF (mmelee_weapons) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
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
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
