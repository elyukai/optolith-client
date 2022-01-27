import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List, map, toArray } from "../../../Data/List"
import { fromMaybe } from "../../../Data/Maybe"
import { elems, lookup, OrderedMap, sum } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { SkillsSelection } from "../../Models/Wiki/professionSelections/SkillsSelection"
import { Skill } from "../../Models/Wiki/Skill"
import { SkillGroup } from "../../Models/Wiki/SkillGroup"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translateP } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { SkillSelectionListItem } from "./SkillSelectionListItem"

const SDA = StaticData.A
const SSA = SkillsSelection.A
const SA = Skill.A

export const isSkillSelectionValid =
  (skillsActive: OrderedMap<string, number>) =>
  (selection: Record<SkillsSelection>): Pair<boolean, number> => {
    const ap_total = SSA.value (selection)
    const ap_spent = sum (skillsActive)
    const ap_left = ap_total - ap_spent

    return Pair (ap_left === 0, ap_left)
  }

const getSkills =
  (staticData: StaticDataRecord) =>
    pipe_ (
      staticData,
      SDA.skills,
      elems,
      sortRecordsByName (staticData)
    )

interface Props {
  staticData: StaticDataRecord
  active: OrderedMap<string, number>
  ap_left: number
  selection: Record<SkillsSelection>
  addSkillPoint (id: string): void
  removeSkillPoint (id: string): void
}

export const SkillSelectionList: React.FC<Props> = props => {
  const { active, addSkillPoint, ap_left, removeSkillPoint, selection, staticData } = props

  const ap_total = SSA.value (selection)
  const mgr = SSA.gr (selection)

  const skills = getSkills (staticData)

  return (
    <div className="skills list">
      <h4>
        {pipe_ (
          staticData,
          SDA.skillGroups,
          lookup (fromMaybe (0) (mgr)),
          fmap ((gr: Record<SkillGroup>) => translateP (staticData)
                                 ("rcpselectoptions.skillselectionap")
                                 (List<string | number> (
                                   SkillGroup.A.name (gr),
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
              key={SA.id (skill)}
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
