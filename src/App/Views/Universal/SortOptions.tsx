import * as React from "react";
import { List, map } from "../../../Data/List";
import { fromJust, isJust, Just } from "../../../Data/Maybe";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Option, RadioButtonGroup } from "./RadioButtonGroup";

export type SortNames = "name"
                      | "dateModified"
                      | "group"
                      | "groupname"
                      | "where"
                      | "cost"
                      | "ic"
                      | "property"
                      | "weight"

export interface SortOptionsProps {
  l10n: L10nRecord
  options: List<SortNames>
  sortOrder: SortNames
  sort (option: string): void
}

export function SortOptions (props: SortOptionsProps) {
  const { l10n, options, sort, sortOrder, ...other } = props

  const SORT_NAMES = {
    name: translate (l10n) ("sortalphabetically"),
    dateModified: translate (l10n) ("sortbydatemodified"),
    group: translate (l10n) ("sortbygroup"),
    groupname: translate (l10n) ("sortbygroup"),
    where: translate (l10n) ("sortbylocation"),
    cost: translate (l10n) ("sortbycost"),
    ic: translate (l10n) ("sortbyimprovementcost"),
    property: translate (l10n) ("sortbyproperty"),
    weight: translate (l10n) ("sortbyweight"),
  }

  return (
    <RadioButtonGroup<string>
      {...other}
      active={sortOrder}
      onClick={
        option => {
          if (isJust (option)) {
            sort (fromJust (option as Just<string>))
          }
        }
      }
      array={
        sortRecordsByName (L10n.A.id (l10n))
                          (map ((e: SortNames) =>
                                 Option ({ name: SORT_NAMES [e], value: Just (e) }))
                               (options))
      }
      />
  )
}
