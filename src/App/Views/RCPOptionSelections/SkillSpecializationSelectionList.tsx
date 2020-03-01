import * as React from "react"
import { fmap, fmapF } from "../../../Data/Functor"
import { flength, isList, List, map, notNull, notNullStr } from "../../../Data/List"
import { bindF, ensure, fromMaybe, isJust, Just, mapMaybe, Maybe, maybe, maybeToList, maybeToNullable } from "../../../Data/Maybe"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd, Tuple } from "../../../Data/Tuple"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { SpecializationSelection } from "../../Models/Wiki/professionSelections/SpecializationSelection"
import { Skill } from "../../Models/Wiki/Skill"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { localizeOrList, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { isString } from "../../Utilities/typeCheckUtils"
import { Dropdown } from "../Universal/Dropdown"
import { SkillSpecializationSelectionApplications } from "./SkillSpecializationSelectionApplications"

const SDA = StaticData.A
const SSA = SpecializationSelection.A

export const isSkillSpecializationSelectionValid =
  (activeApplication: Pair<Maybe<number>, string>) =>
  (activeSkillId: Maybe<string>) =>
  (selection: Record<SpecializationSelection>): Tuple<[boolean]> => {
    const sid = SSA.sid (selection)

    const is_skill_id_valid = !isList (sid) || isJust (activeSkillId)
    const is_application_valid = isJust (fst (activeApplication))
                               || notNullStr (snd (activeApplication))

    return Tuple (is_skill_id_valid && is_application_valid)
  }

interface Props {
  activeApplication: Pair<Maybe<number>, string>
  activeSkillId: Maybe<string>
  selection: Record<SpecializationSelection>
  staticData: StaticDataRecord
  setApplicationId: (id: number) => void
  setApplicationString: (input: string) => void
  setSkillId: (id: string) => void
}

export const SkillSpecializationSelectionList: React.FC<Props> = props => {
  const {
    activeApplication,
    activeSkillId,
    selection,
    setApplicationId,
    setApplicationString,
    setSkillId,
    staticData,
  } = props

  const sid = SSA.sid (selection)

  const all_skills = SDA.skills (staticData)

  const skills = React.useMemo (
    () => isList (sid)
          ? mapMaybe (lookupF (all_skills)) (sid)
          : maybeToList (lookupF (all_skills) (sid)),
    [ sid, all_skills ]
  )

  const name =
    pipe_ (
      skills,
      ensure (notNull),
      fmap (pipe (
        map (Skill.A.name),
        localizeOrList (staticData)
      )),
      fromMaybe ("...")
    )

  const title = translateP (staticData) ("rcpselectoptions.skillspecialization") (List (name))

  const selectSkillElement =
    fmapF (pipe_ (skills, ensure (xs => flength (xs) > 1)))
          (skillsList => (
            <div>
              <Dropdown
                className="talents"
                value={activeSkillId}
                onChangeJust={setSkillId}
                options={map ((skill: Record<Skill>) => DropdownOption ({
                                                          id: Just (Skill.A.id (skill)),
                                                          name: Skill.A.name (skill),
                                                        }))
                             (skillsList)}
                />
            </div>
          ))

  return (
    <div className="spec">
      <h4>{title}</h4>
      {maybeToNullable (selectSkillElement)}
      {pipe_ (
        isString (sid) ? Just (sid) : activeSkillId,
        bindF (lookupF (all_skills)),
        maybe (null as React.ReactNode)
              (active_skill => (
                <SkillSpecializationSelectionApplications
                  active={activeApplication}
                  skill={active_skill}
                  setApplicationId={setApplicationId}
                  setApplicationString={setApplicationString}
                  />
              ))
      )}
    </div>
  )
}
