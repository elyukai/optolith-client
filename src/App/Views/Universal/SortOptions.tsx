import * as React from "react"
import { List, map } from "../../../Data/List"
import { fromJust, isJust, Just, Maybe } from "../../../Data/Maybe"
import { RadioOption } from "../../Models/View/RadioOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { RadioButtonGroup } from "./RadioButtonGroup"

export enum SortNames {
  Name = "name",
  DateModified = "dateModified",
  Group = "group",
  GroupName = "groupname",
  Where = "where",
  Cost = "cost",
  IC = "ic",
  Property = "property",
  Weight = "weight",
}

interface Props<A extends SortNames> {
  staticData: StaticDataRecord
  options: List<A>
  sortOrder: A
  sort (option: A): void
}

export const SortOptions = <A extends SortNames> (props: Props<A>): React.ReactElement => {
  const { staticData, options, sort, sortOrder } = props

  const SORT_NAMES = {
    [SortNames.Name]: translate (staticData) ("general.filters.sort.alphabetically"),
    [SortNames.DateModified]: translate (staticData) ("general.filters.sort.bydatemodified"),
    [SortNames.Group]: translate (staticData) ("general.filters.sort.bygroup"),
    [SortNames.GroupName]: translate (staticData) ("general.filters.sort.bygroup"),
    [SortNames.Where]: translate (staticData) ("general.filters.sort.bylocation"),
    [SortNames.Cost]: translate (staticData) ("general.filters.sort.bycost"),
    [SortNames.IC]: translate (staticData) ("general.filters.sort.byimprovementcost"),
    [SortNames.Property]: translate (staticData) ("general.filters.sort.byproperty"),
    [SortNames.Weight]: translate (staticData) ("general.filters.sort.byweight"),
  }

  const handleClick =
    React.useCallback (
      (option: Maybe<A>) => {
        if (isJust (option)) {
          sort (fromJust (option))
        }
      },
      [ sort ]
    )

  return (
    <RadioButtonGroup<A>
      active={sortOrder}
      onClick={handleClick}
      array={
        sortRecordsByName (staticData)
                          (map ((e: A) => RadioOption ({ name: SORT_NAMES [e], value: Just (e) }))
                               (options))
      }
      />
  )
}
