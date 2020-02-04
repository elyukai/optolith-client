import * as React from "react"
import { List, map } from "../../../Data/List"
import { fromJust, isJust, Just, Maybe } from "../../../Data/Maybe"
import { RadioOption } from "../../Models/View/RadioOption"
import { L10nRecord } from "../../Models/Wiki/L10n"
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
  l10n: L10nRecord
  options: List<A>
  sortOrder: A
  sort (option: A): void
}

export const SortOptions = <A extends SortNames> (props: Props<A>): React.ReactElement => {
  const { l10n, options, sort, sortOrder } = props

  const SORT_NAMES = {
    [SortNames.Name]: translate (l10n) ("sortalphabetically"),
    [SortNames.DateModified]: translate (l10n) ("sortbydatemodified"),
    [SortNames.Group]: translate (l10n) ("sortbygroup"),
    [SortNames.GroupName]: translate (l10n) ("sortbygroup"),
    [SortNames.Where]: translate (l10n) ("sortbylocation"),
    [SortNames.Cost]: translate (l10n) ("sortbycost"),
    [SortNames.IC]: translate (l10n) ("sortbyimprovementcost"),
    [SortNames.Property]: translate (l10n) ("sortbyproperty"),
    [SortNames.Weight]: translate (l10n) ("sortbyweight"),
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
        sortRecordsByName (l10n)
                          (map ((e: A) => RadioOption ({ name: SORT_NAMES [e], value: Just (e) }))
                               (options))
      }
      />
  )
}
