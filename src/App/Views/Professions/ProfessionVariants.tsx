import * as React from "react";
import { useDispatch } from "react-redux";
import { ident } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { consF, find, List, map, notNull } from "../../../Data/List";
import { bind, ensure, join, Just, liftM2, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { selectProfessionVariant } from "../../Actions/ProfessionVariantActions";
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
  professions: Maybe<List<Record<ProfessionCombined>>>
  sex: Maybe<Sex>
}

const PCA = ProfessionCombined.A
const PCA_ = ProfessionCombinedA_
const PVCA_ = ProfessionVariantCombinedA_

export const ProfessionVariants: React.FC<ProfessionVariantsProps> = props => {
  const {
    currentProfessionId,
    currentProfessionVariantId,
    l10n,
    professions,
    sex: msex,
  } = props

  const dispatch = useDispatch ()

  const handleProfessionVariantSelect =
    React.useCallback (
      (id: Maybe<string>) => dispatch (selectProfessionVariant (id)),
      [dispatch]
    )

  const mvars =
    liftM2 ((sex: Sex) => (prof: Record<ProfessionCombined>) =>
             pipe_ (
               prof,
               PCA.mappedVariants,
               ensure (notNull),
               fmap (pipe (
                 map (prof_var => {
                   const name = getNameBySex (sex) (PVCA_.name (prof_var))
                   const ap_tag = translate (l10n) ("adventurepoints.short")
                   const ap = Maybe.sum (PCA_.ap (prof)) + PVCA_.ap (prof_var)

                   return Option ({
                     name: `${name} (${ap} ${ap_tag})`,
                     value: Just (PVCA_.id (prof_var)),
                   })
                 }),
                 sortRecordsByName (L10n.A.id (l10n)),
                 PCA_.isVariantRequired (prof)
                   ? ident
                   : consF (Option ({ name: translate (l10n) ("novariant") }))
               ))
             ))
           (msex)
           (bind (professions) (find (pipe (PCA_.id, Maybe.elemF (currentProfessionId)))))

  return maybe (<></>)
               ((vars: List<Record<Option<string>>>) => (
                 <RadioButtonGroup
                   active={currentProfessionVariantId}
                   onClick={handleProfessionVariantSelect}
                   array={vars}
                   />
               ))
               (join (mvars))
}
