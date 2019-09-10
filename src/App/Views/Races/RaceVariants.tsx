import * as React from "react";
import { useDispatch } from "react-redux";
import { find, List, map, notNull } from "../../../Data/List";
import { bindF, ensure, Just, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { selectRaceVariant } from "../../Actions/RaceActions";
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Option, RadioButtonGroup } from "../Universal/RadioButtonGroup";

export interface RaceVariantsProps {
  currentId: Maybe<string>
  currentVariantId: Maybe<string>
  l10n: L10nRecord
  races: List<Record<RaceCombined>>
}

export const RaceVariants: React.FC<RaceVariantsProps> = props => {
  const { currentId, currentVariantId, l10n, races } = props

  const dispatch = useDispatch ()

  const handleSelectRaceVariant =
    React.useCallback (
      (id: string) => dispatch (selectRaceVariant (id)),
      [dispatch]
    )

  return pipe_ (
    races,
    find (pipe (RaceCombinedA_.id, Maybe.elemF (currentId))),
    bindF (pipe (
      RaceCombined.A.mappedVariants,
      map (e => Option ({
        name: RaceVariant.A.name (e),
        value: Just (RaceVariant.A.id (e)),
      })),
      sortRecordsByName (l10n),
      ensure (notNull)
    )),
    maybe (<></>)
          (vars => (
            <RadioButtonGroup
              active={currentVariantId}
              onClickJust={handleSelectRaceVariant}
              array={vars}
              />
          ))
  )
}
