import * as React from "react";
import { Textfit } from "react-textfit";
import { notEquals } from "../../../../Data/Eq";
import { fmap, fmapF } from "../../../../Data/Functor";
import { flength, intercalate, List, map, notNull, replicateR, toArray } from "../../../../Data/List";
import { catMaybes, ensure, Maybe, maybe, maybeRNull } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { Armor } from "../../../Models/View/Armor";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { ndash } from "../../../Utilities/Chars";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { sign, toRoman } from "../../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetArmorProps {
  armors: Maybe<List<Record<Armor>>>
  l10n: L10nRecord
}

const AA = Armor.A

export function CombatSheetArmor (props: CombatSheetArmorProps) {
  const { l10n, armors: marmors } = props

  const movement_tag = translate (l10n) ("movement.short")
  const initiative_tag = translate (l10n) ("initiative.short")

  return (
    <TextBox
      label={translate (l10n) ("armor")}
      className="armor"
      >
      <table>
        <thead>
          <tr>
            <th className="name">{translate (l10n) ("armor")}</th>
            <th className="st">{translate (l10n) ("sturdinessrating.short")}</th>
            <th className="loss">{translate (l10n) ("wear.short")}</th>
            <th className="pro">{translate (l10n) ("protection.short")}</th>
            <th className="enc">{translate (l10n) ("encumbrance.short")}</th>
            <th className="add-penalties">{translate (l10n) ("additionalpenalties")}</th>
            <th className="weight">{translate (l10n) ("weight")}</th>
            <th className="where">{translate (l10n) ("carriedwhereexamples")}</th>
          </tr>
        </thead>
        <tbody>
          {maybeRNull (pipe (
                        map ((e: Record<Armor>) => {
                          const addPenalties =
                            catMaybes (List (
                                        fmapF (ensure (notEquals (0)) (AA.mov (e)))
                                              (mov => `${sign (mov)} ${movement_tag}`),
                                        fmapF (ensure (notEquals (0)) (AA.ini (e)))
                                              (ini => `${sign (ini)} ${initiative_tag}`)
                                      ))

                          return (
                            <tr key={AA.id (e)}>
                              <td className="name">
                                <Textfit max={11} min={7} mode="single">{AA.name (e)}</Textfit>
                              </td>
                              <td className="st">{Maybe.sum (AA.st (e))}</td>
                              <td className="loss">{renderMaybeWith (toRoman) (AA.loss (e))}</td>
                              <td className="pro">{Maybe.sum (AA.pro (e))}</td>
                              <td className="enc">{Maybe.sum (AA.enc (e))}</td>
                              <td className="add-penalties">
                                {maybe (ndash)
                                       (intercalate (", "))
                                       (ensure (notNull) (addPenalties))}
                              </td>
                              <td className="weight">
                                {pipe_ (
                                  e,
                                  AA.weight,
                                  fmap (pipe (
                                    localizeWeight (l10n),
                                    localizeNumber (l10n)
                                  )),
                                  renderMaybe
                                )}
                                {" "}
                                {translate (l10n) ("weightunit.short")}
                              </td>
                              <td className="where">
                                <Textfit max={11} min={7} mode="single">
                                  {renderMaybe (AA.where (e))}
                                </Textfit>
                              </td>
                            </tr>
                          )
                        }),
                        toArray
                      ))
                      (marmors)}
          {replicateR (2 - Maybe.sum (fmapF (marmors) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="st" />
                          <td className="loss" />
                          <td className="pro" />
                          <td className="enc" />
                          <td className="add-penalties" />
                          <td className="weight" />
                          <td className="where" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
