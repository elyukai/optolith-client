import * as React from "react";
import { ident } from "../../../Data/Function";
import { consF, find, List, map } from "../../../Data/List";
import { Just, liftM2, Maybe, maybeRNull } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined";
import { ProfessionVariantCombinedA_ } from "../../Models/View/ProfessionVariantCombined";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { getNameBySex } from "../../Utilities/rcpUtils";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Option, RadioButtonGroup } from "../Universal/RadioButtonGroup";

export interface ProfessionVariantsProps {
  currentProfessionId: Maybe<string>
  currentProfessionVariantId: Maybe<string>
  l10n: L10nRecord
  professions: List<Record<ProfessionCombined>>
  sex: Maybe<Sex>
  selectProfessionVariant (id: Maybe<string>): void
}

const PCA = ProfessionCombined.A
const PCA_ = ProfessionCombinedA_
const PVCA_ = ProfessionVariantCombinedA_

export function ProfessionVariants (props: ProfessionVariantsProps) {
  const {
    currentProfessionId,
    currentProfessionVariantId,
    l10n,
    professions,
    selectProfessionVariant,
    sex: msex,
  } = props

  const mvars =
    liftM2 ((sex: Sex) => (prof: Record<ProfessionCombined>) =>
             pipe_ (
               prof,
               PCA.mappedVariants,
               map (prof_var => {
                 const name = getNameBySex (sex) (PVCA_.name (prof_var))
                 const ap_tag = translate (l10n) ("adventurepoints.short")

                 return Option ({
                   name: `${name} (${Maybe.sum (PCA_.ap (prof)) + PVCA_.ap (prof_var)} ${ap_tag})`,
                   value: Just (PVCA_.id (prof_var)),
                 })
               }),
               sortRecordsByName (L10n.A.id (l10n)),
               !PCA_.isVariantRequired (prof)
                 ? consF (Option ({ name: translate (l10n) ("novariant") }))
                 : ident
             ))
           (msex)
           (find (pipe (PCA_.id, Maybe.elemF (currentProfessionId)))
                 (professions))

  return maybeRNull ((vars: List<Record<Option<string>>>) => (
                      <RadioButtonGroup
                        active={currentProfessionVariantId}
                        onClick={selectProfessionVariant}
                        array={vars}
                        />
                    ))
                    (mvars)
}
