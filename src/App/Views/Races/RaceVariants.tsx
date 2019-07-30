import * as React from "react";
import { find, List, map, notNull } from "../../../Data/List";
import { bindF, ensure, Just, Maybe, maybeRNull } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Option, RadioButtonGroup } from "../Universal/RadioButtonGroup";

export interface RaceVariantsProps {
  currentId: Maybe<string>
  currentVariantId: Maybe<string>
  l10n: L10nRecord
  races: List<Record<RaceCombined>>
  selectRaceVariant (id: string): void
}

export function RaceVariants (props: RaceVariantsProps) {
  const { currentId, currentVariantId, l10n, races, selectRaceVariant } = props

  return pipe_ (
    races,
    find (pipe (RaceCombinedA_.id, Maybe.elemF (currentId))),
    bindF (pipe (
      RaceCombined.A.mappedVariants,
      map (e => Option ({
        name: RaceVariant.A.name (e),
        value: Just (RaceVariant.A.id (e)),
      })),
      sortRecordsByName (L10n.A.id (l10n)),
      ensure (notNull)
    )),
    maybeRNull (vars => (
                          <RadioButtonGroup
                            active={currentVariantId}
                            onClickJust={selectRaceVariant}
                            array={vars}
                            />
                        ))
  )
}
