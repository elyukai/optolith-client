import * as React from "react"
import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { all, flength, fnull, intercalate, List, map, notNull, toArray } from "../../../Data/List"
import { ensure, fromMaybe, fromMaybe_, isNothing, mapMaybe, Maybe, maybeRNullF } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { RaceVariant } from "../../Models/Wiki/RaceVariant"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { signNeg } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortStrings } from "../../Utilities/sortBy"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

const WA = WikiModel.A
const RCA = RaceCombined.A
const RVA = RaceVariant.A
const RCA_ = RaceCombinedA_

type PlainOrByVarsTitle = "inlinewiki.commonadvantages"
                        | "inlinewiki.commondisadvantages"
                        | "inlinewiki.uncommonadvantages"
                        | "inlinewiki.uncommondisadvantages"

const renderPlainOrByVars =
  (l10n: L10nRecord) =>
  (mapText: (x: Record<RaceCombined>) => Maybe<string>) =>
  (mapVarText: (x: Record<RaceVariant>) => Maybe<string>) =>
  (vars: List<Record<RaceVariant>>) =>
  (title: PlainOrByVarsTitle) =>
  (same_for_vars: boolean) =>
  (x: Record<RaceCombined>) => (
    <>
      <WikiProperty l10n={l10n} title={title}>
        {same_for_vars
          ? <span>{fromMaybe (translate (l10n) ("general.none")) (mapText (x))}</span>
          : null}
      </WikiProperty>
      {same_for_vars
        ? null
        : (
          <ul className="race-variant-options">
            {toArray (mapMaybe ((v: Record<RaceVariant>) =>
                                 pipe_ (
                                   v,
                                   mapVarText,
                                   fmap (text => (
                                     <li key={RVA.id (v)}>
                                       <span>{RVA.name (v)}</span>
                                       <span>{text}</span>
                                     </li>
                                   ))
                                 ))
                               (vars))}
          </ul>
        )}
    </>
  )

export interface WikiRaceInfoProps {
  l10n: L10nRecord
  wiki: WikiModelRecord
  x: Record<RaceCombined>
}

export const WikiRaceInfo: React.FC<WikiRaceInfoProps> = props => {
  const { x, l10n, wiki } = props

  const books = WA.books (wiki)

  const name = RCA_.name (x)

  const variants = RCA.mappedVariants (x)

  const sameCommonCultures =
    all (pipe (RVA.commonCultures, fnull)) (variants)
    || all (pipe (RVA.commonCultures, flength, equals (1))) (variants)

  const sameCommonAdvantages = all (pipe (RVA.commonAdvantagesText, isNothing))
                                   (variants)

  const sameCommonDisadvantages = all (pipe (RVA.commonDisadvantagesText, isNothing))
                                      (variants)

  const sameUncommonAdvantages = all (pipe (RVA.uncommonAdvantagesText, isNothing))
                                     (variants)

  const sameUncommonDisadvantages = all (pipe (RVA.uncommonDisadvantagesText, isNothing))
                                        (variants)


  return (
    <WikiBoxTemplate className="race" title={name}>
      <WikiProperty l10n={l10n} title="inlinewiki.apvalue">
        {RCA_.ap (x)}
        {" "}
        {translate (l10n) ("inlinewiki.adventurepoints")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="inlinewiki.lifepointbasevalue">
        {signNeg (RCA_.lp (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="inlinewiki.spiritbasevalue">
        {signNeg (RCA_.spi (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="inlinewiki.toughnessbasevalue">
        {signNeg (RCA_.tou (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="inlinewiki.movementbasevalue">
        {signNeg (RCA_.mov (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="inlinewiki.attributeadjustments">
        {RCA_.attributeAdjustmentsText (x)}
      </WikiProperty>
      {maybeRNullF (RCA_.automaticAdvantagesText (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="inlinewiki.automaticadvantages">
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (RCA_.stronglyRecommendedAdvantagesText (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="inlinewiki.stronglyrecommendedadvantages">
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (RCA_.stronglyRecommendedDisadvantagesText (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="inlinewiki.stronglyrecommendeddisadvantages">
                       {str}
                     </WikiProperty>
                   ))}
      <WikiProperty l10n={l10n} title="inlinewiki.commoncultures">
        {sameCommonCultures
          ? (
            <span>
              {pipe_ (
                x,
                RCA_.commonCultures,
                ensure (notNull),
                fromMaybe_ (() => map (RVA.name) (variants)),
                sortStrings (l10n),
                intercalate (", ")
              )}
            </span>
          )
          : null}
      </WikiProperty>
      {sameCommonCultures
        ? null
        : (
          <ul className="race-variant-options">
            {pipe_ (
              variants,
              map (e => {
                    const commonCultures =
                      pipe_ (
                        e,
                        RVA.commonCultures,
                        sortStrings (l10n),
                        intercalate (", ")
                      )

                    return (
                      <li key={RVA.id (e)}>
                        <span>
                          {RVA.name (e)}
                          {": "}
                        </span>
                        <span>{commonCultures}</span>
                      </li>
                    )
                  }),
              toArray
            )}
          </ul>
        )}
      {renderPlainOrByVars (l10n)
                           (RCA_.commonAdvantagesText)
                           (RVA.commonAdvantagesText)
                           (variants)
                           ("inlinewiki.commonadvantages")
                           (sameCommonAdvantages)
                           (x)}
      {renderPlainOrByVars (l10n)
                           (RCA_.commonDisadvantagesText)
                           (RVA.commonDisadvantagesText)
                           (variants)
                           ("inlinewiki.commondisadvantages")
                           (sameCommonDisadvantages)
                           (x)}
      {renderPlainOrByVars (l10n)
                           (RCA_.uncommonAdvantagesText)
                           (RVA.uncommonAdvantagesText)
                           (variants)
                           ("inlinewiki.uncommonadvantages")
                           (sameUncommonAdvantages)
                           (x)}
      {renderPlainOrByVars (l10n)
                           (RCA_.uncommonDisadvantagesText)
                           (RVA.uncommonDisadvantagesText)
                           (variants)
                           ("inlinewiki.uncommondisadvantages")
                           (sameUncommonDisadvantages)
                           (x)}
      <WikiSource
        books={books}
        x={x}
        l10n={l10n}
        acc={RCA_}
        />
    </WikiBoxTemplate>
  )
}
