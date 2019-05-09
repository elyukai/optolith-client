import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { all, flength, fnull, intercalate, List, map, notNull, toArray } from "../../../Data/List";
import { ensure, fromMaybe, isNothing, mapMaybe, Maybe, maybeRNullF, maybe_ } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined";
import { Book } from "../../Models/Wiki/Book";
import { Culture } from "../../Models/Wiki/Culture";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortStrings } from "../../Utilities/sortBy";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiRaceInfoProps {
  books: OrderedMap<string, Record<Book>>
  cultures: OrderedMap<string, Record<Culture>>
  x: Record<RaceCombined>
  l10n: L10nRecord
}

const RCA = RaceCombined.A
const RVA = RaceVariant.A
const RCA_ = RaceCombinedA_

export function WikiRaceInfo (props: WikiRaceInfoProps) {
  const { cultures, x, l10n } = props

  const name = RCA_.name (x)

  // if (["nl-BE"].includes(l10n.id)) {
  //   return (
  //     <WikiBoxTemplate className="race" title={name}>
  //       <WikiProperty l10n={l10n} title="info.apvalue">
  //         {x.ap} {translate(l10n, "aptext")}
  //       </WikiProperty>
  //       <WikiProperty l10n={l10n} title="info.lifepointbasevalue">{x.lp}</WikiProperty>
  //       <WikiProperty l10n={l10n} title="info.spiritbasevalue">{x.spi}</WikiProperty>
  //       <WikiProperty l10n={l10n} title="info.toughnessbasevalue">{x.tou}</WikiProperty>
  //       <WikiProperty l10n={l10n} title="info.movementbasevalue">{x.mov}</WikiProperty>
  //       <WikiSource {...props} />
  //     </WikiBoxTemplate>
  //   )
  // }

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
      <WikiProperty l10n={l10n} title="apvalue">
        {RCA_.ap (x)} {translate (l10n) ("adventurepoints")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="lifepointbasevalue">{RCA_.lp (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="spiritbasevalue">{RCA_.spi (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="toughnessbasevalue">{RCA_.tou (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="movementbasevalue">{RCA_.mov (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="attributeadjustments">
        {RCA_.attributeAdjustmentsText (x)}
      </WikiProperty>
      {maybeRNullF (RCA_.automaticAdvantagesText (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="automaticadvantages">
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (RCA_.stronglyRecommendedAdvantagesText (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="stronglyrecommendedadvantages">
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (RCA_.stronglyRecommendedDisadvantagesText (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="stronglyrecommendeddisadvantages">
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (RCA_.stronglyRecommendedDisadvantagesText (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="stronglyrecommendeddisadvantages">
                       {str}
                     </WikiProperty>
                   ))}
      <WikiProperty l10n={l10n} title="commoncultures">
        {sameCommonCultures
          ? <span>
              {pipe_ (
                x,
                RCA_.commonCultures,
                ensure (notNull),
                maybe_ (() => map (RVA.name) (variants))
                       (mapMaybe (pipe (lookupF (cultures), fmap (Culture.A.name)))),
                sortStrings (L10n.A.id (l10n)),
                intercalate (", ")
              )}
            </span>
          : null}
      </WikiProperty>
      {!sameCommonCultures
        ? <ul className="race-variant-options">
            {pipe_ (
              variants,
              map (e => {
                    const commonCultures =
                      pipe_ (
                        x,
                        RCA_.commonCultures,
                        mapMaybe (pipe (lookupF (cultures), fmap (Culture.A.name))),
                        sortStrings (L10n.A.id (l10n)),
                        intercalate (", ")
                      )

                    return <li key={RVA.id (e)}>
                      <span>{RVA.name (e)}</span>
                      <span>{commonCultures}</span>
                    </li>
                  }),
              toArray
            )}
          </ul>
        : null}
      {renderPlainOrByVars (l10n)
                           (RCA_.commonAdvantagesText)
                           (RVA.commonAdvantagesText)
                           (variants)
                           ("commonadvantages")
                           (sameCommonAdvantages)
                           (x)}
      {renderPlainOrByVars (l10n)
                           (RCA_.commonDisadvantagesText)
                           (RVA.commonDisadvantagesText)
                           (variants)
                           ("commondisadvantages")
                           (sameCommonDisadvantages)
                           (x)}
      {renderPlainOrByVars (l10n)
                           (RCA_.uncommonAdvantagesText)
                           (RVA.uncommonAdvantagesText)
                           (variants)
                           ("uncommonadvantages")
                           (sameUncommonAdvantages)
                           (x)}
      {renderPlainOrByVars (l10n)
                           (RCA_.uncommonDisadvantagesText)
                           (RVA.uncommonDisadvantagesText)
                           (variants)
                           ("uncommondisadvantages")
                           (sameUncommonDisadvantages)
                           (x)}
      <WikiSource {...props} acc={RCA_} />
    </WikiBoxTemplate>
  )
}

type PlainOrByVarsTitle = "commonadvantages"
                        | "commondisadvantages"
                        | "uncommonadvantages"
                        | "uncommondisadvantages"

const renderPlainOrByVars =
  (l10n: L10nRecord) =>
  (mapText: (x: Record<RaceCombined>) => Maybe<string>) =>
  (mapVarText: (x: Record<RaceVariant>) => Maybe<string>) =>
  (vars: List<Record<RaceVariant>>) =>
  (title: PlainOrByVarsTitle) =>
  (same_for_vars: boolean) =>
  (x: Record<RaceCombined>) =>
    <>
      <WikiProperty l10n={l10n} title={title}>
        {same_for_vars
          ? <span>{fromMaybe (translate (l10n) ("none")) (mapText (x))}</span>
          : null}
      </WikiProperty>
      {!same_for_vars
        ? <ul className="race-variant-options">
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
        : null}
    </>
