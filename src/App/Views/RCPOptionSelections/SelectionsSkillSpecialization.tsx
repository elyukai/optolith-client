import * as React from "react";
import { fmap, fmapF, mapReplace } from "../../../Data/Functor";
import { isList, List, map } from "../../../Data/List";
import { altF_, bind, ensure, Just, mapMaybe, Maybe, maybeToNullable } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { fst, Pair, snd } from "../../../Data/Tuple";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecializationSelection } from "../../Models/Wiki/professionSelections/SpecializationSelection";
import { Skill } from "../../Models/Wiki/Skill";
import { Application } from "../../Models/Wiki/sub/Application";
import { localizeOrList, translateP } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { isString } from "../../Utilities/typeCheckUtils";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { TextField } from "../Universal/TextField";

export interface SelectionsSkillSpecializationProps {
  active: Pair<Maybe<number>, string>
  activeId: Maybe<string>
  options: Record<SpecializationSelection>
  l10n: L10nRecord
  skills: OrderedMap<string, Record<Skill>>
  change (value: string | number): void
  changeId (id: string): void
}

const SSA = SpecializationSelection.A

export function SelectionsSkillSpecialization (props: SelectionsSkillSpecializationProps) {
  const { active, activeId, change, changeId, l10n, options, skills } = props

  const sid = SSA.sid (options)

  const maybeSkillsList = fmapF (ensure (isList) (sid)) (mapMaybe (lookupF (skills)))

  const activeSkillId = isString (sid) ? Just (sid) : activeId
  const maybeActiveSkill = bind (activeSkillId) (lookupF (skills))

  const maybeApplicationList = fmapF (maybeActiveSkill) (Skill.A.applications)

  const maybeApplicationInput = bind (maybeActiveSkill) (Skill.A.applicationsInput)

  const name =
    pipe_ (
      maybeSkillsList,
      fmap (pipe (
        map (Skill.A.name),
        localizeOrList (l10n)
      )),
      altF_ (() => fmapF (maybeActiveSkill) (Skill.A.name))
    )

  const selectSkillElement =
    fmapF (maybeSkillsList)
          (skillsList => (
              <div>
                <Dropdown
                  className="talents"
                  value={activeId}
                  onChangeJust={changeId}
                  options={map ((skill: Record<Skill>) => DropdownOption ({
                                                            id: Just (Skill.A.id (skill)),
                                                            name: Skill.A.name (skill),
                                                          }))
                               (skillsList)}
                  />
              </div>
            )
          )

  const selectionElement =
    mapReplace (
                 <div>
                   {pipe_ (
                     maybeApplicationList,
                     fmap (pipe (
                       map (e => DropdownOption ({
                              id: Just (Application.A.id (e)),
                              name: Application.A.name (e),
                            })),
                       applicationList => (
                         <Dropdown
                           className="tiers"
                           value={Maybe.sum (fst (active))}
                           onChangeJust={change}
                           options={applicationList}
                           disabled={snd (active) .length > 0}
                           />
                       )
                     )),
                     maybeToNullable
                   )}
                   {pipe_ (
                     maybeApplicationInput,
                     fmap (applicationInput => (
                            <TextField
                              hint={applicationInput}
                              value={snd (active)}
                              onChange={change}
                              />
                          )),
                     maybeToNullable
                   )}
                 </div>
               )
               (maybeActiveSkill)

  return (
    <div className="spec">
      <h4>
        {translateP (l10n)
                    ("skillspecialization")
                    (List (renderMaybe (name)))}
      </h4>
      {maybeToNullable (selectSkillElement)}
      {maybeToNullable (selectionElement)}
    </div>
  )
}
