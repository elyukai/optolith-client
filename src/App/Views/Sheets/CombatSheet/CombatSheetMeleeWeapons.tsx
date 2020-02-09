import * as React from "react"
import { Textfit } from "react-textfit"
import { fmap, fmapF } from "../../../../Data/Functor"
import { flength, intercalate, List, map, replicateR, subscript, subscriptF, toArray } from "../../../../Data/List"
import { bindF, fromMaybe, Maybe } from "../../../../Data/Maybe"
import { dec } from "../../../../Data/Num"
import { Record } from "../../../../Data/Record"
import { bimap, fst, isTuple, snd } from "../../../../Data/Tuple"
import { MeleeWeapon } from "../../../Models/View/MeleeWeapon"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { ndash } from "../../../Utilities/Chars"
import { localizeNumber, localizeWeight, translate, translateP } from "../../../Utilities/I18n"
import { sign, signZero, toRoman } from "../../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  l10n: L10nRecord
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>
}

const MWA = MeleeWeapon.A

export const CombatSheetMeleeWeapons: React.FC<Props> = props => {
  const { l10n, meleeWeapons: mmelee_weapons } = props

  return (
    <TextBox
      label={translate (l10n) ("sheets.combatsheet.closecombatweapons")}
      className="melee-weapons"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.weapon")}
            </th>
            <th className="combat-technique">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.combattechnique")}
            </th>
            <th className="damage-bonus">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.damagebonus")}
            </th>
            <th className="damage">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.damagepoints")}
            </th>
            <th className="mod" colSpan={2}>
              {translate (l10n)
                         ("sheets.combatsheet.closecombatweapons.labels.attackparrymodifier")}
            </th>
            <th className="reach">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.reach")}
            </th>
            <th className="bf">
              {translate (l10n)
                         ("sheets.combatsheet.closecombatweapons.labels.breakingpointrating")}
            </th>
            <th className="loss">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.damaged")}
            </th>
            <th className="at">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.attack")}
            </th>
            <th className="pa">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.parry")}
            </th>
            <th className="weight">
              {translate (l10n) ("sheets.combatsheet.closecombatweapons.labels.weight")}
            </th>
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
                      {translate (l10n) ("general.dice")}
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
                      {translateP (l10n)
                                  ("general.weightvalue")
                                  (pipe_ (
                                    e,
                                    MWA.weight,
                                    localizeWeight (l10n),
                                    localizeNumber (l10n)
                                  ))}
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
                          <td className="name" />
                          <td className="combat-technique" />
                          <td className="damage-bonus" />
                          <td className="damage" />
                          <td className="at-mod mod" />
                          <td className="pa-mod mod" />
                          <td className="reach" />
                          <td className="bf" />
                          <td className="loss" />
                          <td className="at" />
                          <td className="pa" />
                          <td className="weight" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
