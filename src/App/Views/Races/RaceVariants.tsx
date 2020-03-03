import * as React from "react"
import { useDispatch } from "react-redux"
import { find, List, map, notNull } from "../../../Data/List"
import { bindF, ensure, Just, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { selectRaceVariant } from "../../Actions/RaceActions"
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined"
import { RadioOption } from "../../Models/View/RadioOption"
import { RaceVariant } from "../../Models/Wiki/RaceVariant"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { RadioButtonGroup } from "../Universal/RadioButtonGroup"

export interface RaceVariantsProps {
  currentId: Maybe<string>
  currentVariantId: Maybe<string>
  staticData: StaticDataRecord
  races: List<Record<RaceCombined>>
}

export const RaceVariants: React.FC<RaceVariantsProps> = props => {
  const { currentId, currentVariantId, staticData, races } = props

  const dispatch = useDispatch ()

  const handleSelectRaceVariant =
    React.useCallback (
      (id: string) => dispatch (selectRaceVariant (id)),
      [ dispatch ]
    )

  return pipe_ (
    races,
    find (pipe (RaceCombinedA_.id, Maybe.elemF (currentId))),
    bindF (pipe (
      RaceCombined.A.mappedVariants,
      map (e => RadioOption ({
        name: RaceVariant.A.name (e),
        value: Just (RaceVariant.A.id (e)),
      })),
      sortRecordsByName (staticData),
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
