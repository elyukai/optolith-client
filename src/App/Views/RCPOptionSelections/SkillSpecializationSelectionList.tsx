import * as React from "react"
import { fmap, fmapF } from "../../../Data/Functor"
import { isList, List, map, notNullStr } from "../../../Data/List"
import { bind, ensure, fromJust, fromMaybe, isJust, isNothing, Just, mapMaybe, Maybe, maybeToNullable } from "../../../Data/Maybe"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd, Tuple } from "../../../Data/Tuple"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { SpecializationSelection } from "../../Models/Wiki/professionSelections/SpecializationSelection"
import { Skill } from "../../Models/Wiki/Skill"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { localizeOrList, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { isString } from "../../Utilities/typeCheckUtils"
import { Dropdown } from "../Universal/Dropdown"
import { SkillSpecializationSelectionApplications } from "./SkillSpecializationSelectionApplications"

const WA = WikiModel.A
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
  l10n: L10nRecord
  selection: Record<SpecializationSelection>
  wiki: WikiModelRecord
  setApplicationId: (id: number) => void
  setApplicationString: (input: string) => void
  setSkillId: (id: string) => void
}

export const SkillSpecializationSelectionList: React.FC<Props> = props => {
  const {
    activeApplication,
    activeSkillId,
    l10n,
    selection,
    setApplicationId,
    setApplicationString,
    setSkillId,
    wiki,
  } = props

  const sid = SSA.sid (selection)

  const all_skills = WA.skills (wiki)

  const mskills = React.useMemo (
    () => fmapF (ensure (isList) (sid))
                (mapMaybe (lookupF (all_skills))),
    [ sid, all_skills ]
  )

  const mactive_skill = bind (isString (sid) ? Just (sid) : activeSkillId)
                             (lookupF (all_skills))

  if (isNothing (mactive_skill)) {
    return null
  }

  const active_skill = fromJust (mactive_skill)

  const name =
    pipe_ (
      mskills,
      fmap (pipe (
        map (Skill.A.name),
        localizeOrList (l10n)
      )),
      fromMaybe (Skill.A.name (active_skill))
    )

  const title = translateP (l10n) ("rcpselectoptions.skillspecialization") (List (name))

  const selectSkillElement =
    fmapF (mskills)
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
      <SkillSpecializationSelectionApplications
        active={activeApplication}
        skill={active_skill}
        setApplicationId={setApplicationId}
        setApplicationString={setApplicationString}
        />
    </div>
  )
}
