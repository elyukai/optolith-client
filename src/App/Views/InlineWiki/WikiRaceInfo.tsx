import * as React from "react"
import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { all, flength, fnull, intercalate, List, map, notNull, toArray } from "../../../Data/List"
import { ensure, fromMaybe, fromMaybe_, isNothing, mapMaybe, Maybe, maybeRNullF } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined"
import { RaceVariant } from "../../Models/Wiki/RaceVariant"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { signNeg } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortStrings } from "../../Utilities/sortBy"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

const RCA = RaceCombined.A
const RVA = RaceVariant.A
const RCA_ = RaceCombinedA_

type PlainOrByVarsTitle = "inlinewiki.commonadvantages"
                        | "inlinewiki.commondisadvantages"
                        | "inlinewiki.uncommonadvantages"
                        | "inlinewiki.uncommondisadvantages"

const renderPlainOrByVars =
  (staticData: StaticDataRecord) =>
  (mapText: (x: Record<RaceCombined>) => Maybe<string>) =>
  (mapVarText: (x: Record<RaceVariant>) => Maybe<string>) =>
  (vars: List<Record<RaceVariant>>) =>
  (title: PlainOrByVarsTitle) =>
  (same_for_vars: boolean) =>
  (x: Record<RaceCombined>) => (
    <>
      <WikiProperty staticData={staticData} title={title}>
        {same_for_vars
          ? <span>{fromMaybe (translate (staticData) ("general.none")) (mapText (x))}</span>
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
                                   fmap ((text: string) => (
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
  staticData: StaticDataRecord
  x: Record<RaceCombined>
}

export const WikiRaceInfo: React.FC<WikiRaceInfoProps> = props => {
  const { x, staticData } = props

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
      <WikiProperty staticData={staticData} title="inlinewiki.apvalue">
        {RCA_.ap (x)}
        {" "}
        {translate (staticData) ("inlinewiki.adventurepoints")}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.lifepointbasevalue">
        {signNeg (RCA_.lp (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.spiritbasevalue">
        {signNeg (RCA_.spi (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.toughnessbasevalue">
        {signNeg (RCA_.tou (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.movementbasevalue">
        {signNeg (RCA_.mov (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.attributeadjustments">
        {RCA_.attributeAdjustmentsText (x)}
      </WikiProperty>
      {maybeRNullF (RCA_.automaticAdvantagesText (x))
                   (str => (
                     <WikiProperty
                       staticData={staticData}
                       title="inlinewiki.automaticadvantages"
                       >
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (RCA_.stronglyRecommendedAdvantagesText (x))
                   (str => (
                     <WikiProperty
                       staticData={staticData}
                       title="inlinewiki.stronglyrecommendedadvantages"
                       >
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (RCA_.stronglyRecommendedDisadvantagesText (x))
                   (str => (
                     <WikiProperty
                       staticData={staticData}
                       title="inlinewiki.stronglyrecommendeddisadvantages"
                       >
                       {str}
                     </WikiProperty>
                   ))}
      <WikiProperty staticData={staticData} title="inlinewiki.commoncultures">
        {sameCommonCultures
          ? (
            <span>
              {pipe_ (
                x,
                RCA_.commonCultures,
                ensure (notNull),
                fromMaybe_ (() => map (RVA.name) (variants)),
                sortStrings (staticData),
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
                        sortStrings (staticData),
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
      {renderPlainOrByVars (staticData)
                           (RCA_.commonAdvantagesText)
                           (RVA.commonAdvantagesText)
                           (variants)
                           ("inlinewiki.commonadvantages")
                           (sameCommonAdvantages)
                           (x)}
      {renderPlainOrByVars (staticData)
                           (RCA_.commonDisadvantagesText)
                           (RVA.commonDisadvantagesText)
                           (variants)
                           ("inlinewiki.commondisadvantages")
                           (sameCommonDisadvantages)
                           (x)}
      {renderPlainOrByVars (staticData)
                           (RCA_.uncommonAdvantagesText)
                           (RVA.uncommonAdvantagesText)
                           (variants)
                           ("inlinewiki.uncommonadvantages")
                           (sameUncommonAdvantages)
                           (x)}
      {renderPlainOrByVars (staticData)
                           (RCA_.uncommonDisadvantagesText)
                           (RVA.uncommonDisadvantagesText)
                           (variants)
                           ("inlinewiki.uncommondisadvantages")
                           (sameUncommonDisadvantages)
                           (x)}
      <WikiSource
        x={x}
        staticData={staticData}
        acc={RCA_}
        />
    </WikiBoxTemplate>
  )
}
