import * as React from "react"
import { Textfit } from "react-textfit"
import { ident } from "../../../../Data/Function"
import { fmap, fmapF } from "../../../../Data/Functor"
import { consF, elem, flength, intercalate, List, map, notNull, replicateR, subscript, toArray } from "../../../../Data/List"
import { ensure, fromMaybe, mapMaybe, Maybe, maybe } from "../../../../Data/Maybe"
import { dec } from "../../../../Data/Num"
import { elems } from "../../../../Data/OrderedSet"
import { Record } from "../../../../Data/Record"
import { BlessedTradition } from "../../../Constants/Groups"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../../Models/View/LiturgicalChantWithRequirements"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils"
import { minus } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybeWith } from "../../../Utilities/ReactUtils"
import { getAttributeStringByIdList } from "../../../Utilities/sheetUtils"
import { sortStrings } from "../../../Utilities/sortBy"
import { getCheckModStr } from "../../InlineWiki/Elements/WikiSkillCheck"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  liturgicalChants: Maybe<List<Record<LiturgicalChantWithRequirements>>>
  l10n: L10nRecord
}

const LCWRA_ = LiturgicalChantWithRequirementsA_

export const LiturgicalChantsSheetLiturgicalChants: React.FC<Props> = props => {
  const {
    attributes,
    checkAttributeValueVisibility,
    l10n,
    liturgicalChants: maybeLiturgicalChants,
  } = props

  const aspectNames = translate (l10n) ("aspectlist")
  const traditionNames = translate (l10n) ("blessedtraditions")

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
              {translate (l10n) ("liturgicaltime")}
            </th>
            <th className="range">
              {translate (l10n) ("range")}
            </th>
            <th className="duration">
              {translate (l10n) ("duration")}
            </th>
            <th className="aspect">
              {translate (l10n) ("aspect")}
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
                      <Textfit max={11} min={7} mode="single">
                        {fromMaybe (LCWRA_.name (e)) (LCWRA_.nameShort (e))}
                      </Textfit>
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
                          elem (BlessedTradition.CultOfTheNamelessOne) (LCWRA_.tradition (e))
                            ? maybe (ident as ident<List<string>>)
                                    (consF as (x: string) => ident<List<string>>)
                                    (subscript (traditionNames)
                                               (BlessedTradition.CultOfTheNamelessOne - 1))
                            : ident,
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
            fromMaybe (null as React.ReactNode)
          )}
          {replicateR (21 - Maybe.sum (fmapF (maybeLiturgicalChants) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="check" />
                          <td className="value" />
                          <td className="cost" />
                          <td className="cast-time" />
                          <td className="range" />
                          <td className="duration" />
                          <td className="aspect" />
                          <td className="ic" />
                          <td className="effect" />
                          <td className="ref" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
