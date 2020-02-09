import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List, map, subscriptF, toArray } from "../../../Data/List"
import { fromMaybe } from "../../../Data/Maybe"
import { elems, OrderedMap, sum } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { SkillsSelection } from "../../Models/Wiki/professionSelections/SkillsSelection"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { SkillSelectionListItem } from "./SkillSelectionListItem"

const WA = WikiModel.A
const SSA = SkillsSelection.A

export const isSkillSelectionValid =
  (skillsActive: OrderedMap<string, number>) =>
  (selection: Record<SkillsSelection>): Pair<boolean, number> => {
    const ap_total = SSA.value (selection)
    const ap_spent = sum (skillsActive)
    const ap_left = ap_total - ap_spent

    return Pair (ap_left === 0, ap_left)
  }

const getSkills =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
    pipe_ (
      wiki,
      WA.skills,
      elems,
      sortRecordsByName (l10n)
    )

interface Props {
  l10n: L10nRecord
  wiki: WikiModelRecord
  active: OrderedMap<string, number>
  ap_left: number
  selection: Record<SkillsSelection>
  addSkillPoint (id: string): void
  removeSkillPoint (id: string): void
}

export const SkillSelectionList: React.FC<Props> = props => {
  const { active, addSkillPoint, ap_left, l10n, removeSkillPoint, selection, wiki } = props

  const ap_total = SSA.value (selection)
  const mgr = SSA.gr (selection)

  const skills = getSkills (l10n) (wiki)

  return (
    <div className="skills list">
      <h4>
        {pipe_ (
          translate (l10n) ("skillselectiongroups"),
          subscriptF (fromMaybe (0) (mgr)),
          fmap (gr_name => translateP (l10n)
                                      ("rcpselectoptions.skillselectionap")
                                      (List<string | number> (
                                        gr_name,
                                        ap_total,
                                        ap_left
                                      ))),
          renderMaybe
        )}
      </h4>
      <ul>
        {pipe_ (
          skills,
          map (skill => (
            <SkillSelectionListItem
              active={active}
              ap_left={ap_left}
              skill={skill}
              addSkillPoint={addSkillPoint}
              removeSkillPoint={removeSkillPoint}
              />
          )),
          toArray
        )}
      </ul>
    </div>
  )
}
