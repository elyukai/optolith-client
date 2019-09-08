import * as React from "react";
import { Textfit } from "react-textfit";
import { fmap, fmapF } from "../../../../Data/Functor";
import { flength, intercalate, List, map, notNull, replicateR, subscript, toArray } from "../../../../Data/List";
import { ensure, fromMaybeR, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { dec } from "../../../../Data/Num";
import { elems } from "../../../../Data/OrderedSet";
import { Record } from "../../../../Data/Record";
import { AttributeCombined } from "../../../Models/View/AttributeCombined";
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../../Models/View/LiturgicalChantWithRequirements";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils";
import { minus } from "../../../Utilities/Chars";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybeWith } from "../../../Utilities/ReactUtils";
import { getAttributeStringByIdList } from "../../../Utilities/sheetUtils";
import { sortStrings } from "../../../Utilities/sortBy";
import { getCheckModStr } from "../../InlineWiki/Elements/WikiSkillCheck";
import { TextBox } from "../../Universal/TextBox";

export interface LiturgicalChantsSheetLiturgicalChantsProps {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  liturgicalChants: Maybe<List<Record<LiturgicalChantWithRequirements>>>
  l10n: L10nRecord
}

const LCWRA_ = LiturgicalChantWithRequirementsA_

export function LiturgicalChantsSheetLiturgicalChants (
  props: LiturgicalChantsSheetLiturgicalChantsProps
) {
  const {
    attributes,
    checkAttributeValueVisibility,
    l10n,
    liturgicalChants: maybeLiturgicalChants,
  } = props

  const aspectNames = translate (l10n) ("aspectlist")

  return (
    <TextBox
      label={translate (l10n) ("liturgicalchantsandceremonies")}
      className="skill-list"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (l10n) ("liturgicalchantsandceremonies")}
            </th>
            <th className="check">
              {translate (l10n) ("check")}
            </th>
            <th className="value">
              {translate (l10n) ("skillrating.short")}
            </th>
            <th className="cost">
              {translate (l10n) ("cost")}
            </th>
            <th className="cast-time">
              {translate (l10n) ("castingtime")}
            </th>
            <th className="range">
              {translate (l10n) ("range")}
            </th>
            <th className="duration">
              {translate (l10n) ("duration")}
            </th>
            <th className="aspect">
              {translate (l10n) ("property")}
            </th>
            <th className="ic">
              {translate (l10n) ("improvementcost.short")}
            </th>
            <th className="effect">
              {translate (l10n) ("effect")}
            </th>
            <th className="ref">
              {translate (l10n) ("page.short")}
            </th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            maybeLiturgicalChants,
            fmap (pipe (
              map (e => {
                const check =
                  getAttributeStringByIdList (checkAttributeValueVisibility)
                                             (attributes)
                                             (LCWRA_.check (e))


                return (
                  <tr key={LCWRA_.id (e)}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{LCWRA_.name (e)}</Textfit>
                    </td>
                    <td className="check">
                      <Textfit max={11} min={7} mode="single">
                        {check}
                        {pipe_ (
                          e,
                          LCWRA_.checkmod,
                          elems,
                          ensure (notNull),
                          renderMaybeWith (pipe (
                            map (getCheckModStr (l10n)),
                            intercalate ("/"),
                            str => ` (${minus}${str})`
                          ))
                        )}
                      </Textfit>
                    </td>
                    <td className="value">{LCWRA_.value (e)}</td>
                    <td className="cost">
                      <Textfit max={11} min={7} mode="single">{LCWRA_.costShort (e)}</Textfit>
                    </td>
                    <td className="cast-time">
                      <Textfit max={11} min={7} mode="single">
                        {LCWRA_.castingTimeShort (e)}
                      </Textfit>
                    </td>
                    <td className="range">
                      <Textfit max={11} min={7} mode="single">{LCWRA_.rangeShort (e)}</Textfit>
                    </td>
                    <td className="duration">
                      <Textfit max={11} min={7} mode="single">{LCWRA_.durationShort (e)}</Textfit>
                    </td>
                    <td className="aspect">
                      <Textfit max={11} min={7} mode="single">
                        {pipe_ (
                          e,
                          LCWRA_.aspects,
                          mapMaybe (pipe (dec, subscript (aspectNames))),
                          sortStrings (l10n),
                          intercalate (", ")
                        )}
                      </Textfit>
                    </td>
                    <td className="ic">{getICName (LCWRA_.ic (e))}</td>
                    <td className="effect" />
                    <td className="ref" />
                  </tr>
                )
              }),
              toArray
            )),
            fromMaybeR (null)
          )}
          {replicateR (21 - Maybe.sum (fmapF (maybeLiturgicalChants) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name"></td>
                          <td className="check"></td>
                          <td className="value"></td>
                          <td className="cost"></td>
                          <td className="cast-time"></td>
                          <td className="range"></td>
                          <td className="duration"></td>
                          <td className="aspect"></td>
                          <td className="ic"></td>
                          <td className="effect"></td>
                          <td className="ref"></td>
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
