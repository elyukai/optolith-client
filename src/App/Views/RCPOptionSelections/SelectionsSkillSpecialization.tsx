import * as React from "react";
import { fmap, fmapF } from "../../../Data/Functor";
import { isList, List, map } from "../../../Data/List";
import { altF_, bind, ensure, Just, mapMaybe, Maybe } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Pair } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecializationSelection } from "../../Models/Wiki/professionSelections/SpecializationSelection";
import { Skill } from "../../Models/Wiki/Skill";
import { localizeOrList, translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
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
      altF_ (() )
    )
    maybeSkillsList .fmap (
      R.pipe (
        List.map (e => e .get ("name")),
        List.intercalate (
          ` ${translate (l10n, "rcpselections.labels.applicationforskillspecialization")} `
        )
      )
    )
      .alt (maybeActiveSkill .fmap (Record.get<Skill, "name"> ("name")))

  const selectSkillElement =
    maybeSkillsList
      .fmap (
        skillsList => (
          <div>
            <Dropdown
              className="talents"
              value={activeId}
              onChangeJust={changeId}
              options={skillsList as unknown as List<Record<DropdownOption>>}
              />
          </div>
        )
      )

  const selectionElement =
    mapReplace<JSX.Element, Record<Skill>>
      (
        <div>
          {
            maybeToReactNode (
              maybeApplicationList
                .fmap (
                  applicationList => (
                    <Dropdown
                      className="tiers"
                      value={fromMaybe (0) (Tuple.fst (active))}
                      onChangeJust={change}
                      options={applicationList as List<Record<DropdownOption>>}
                      disabled={Tuple.snd (active) .length > 0}
                      />
                  )
                )
            )
          }
          {
            maybeToReactNode (
              maybeApplicationInput
                .fmap (
                  applicationInput => (
                    <TextField
                      hint={applicationInput}
                      value={Tuple.snd (active)}
                      onChangeString={change}
                      />
                  )
                )
            )
          }
        </div>
      )
      (maybeActiveSkill)

  return (
    <div className="spec">
      <h4>
        {translate (l10n, "rcpselections.labels.applicationforskillspecialization")}
        {" ("}
        {fromMaybe ("") (name)}
        {")"}
      </h4>
      {maybeToReactNode (selectSkillElement)}
      {maybeToReactNode (selectionElement)}
    </div>
  )
}
