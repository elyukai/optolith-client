import * as React from "react";
import { Skill } from "../../Models/Wiki/wikiTypeHelpers";
import { translate, UIMessagesObject } from "../../Utilities/I18n";
import { divideBy } from "../../Utilities/mathUtils";
import { BorderButton } from "../Universal/BorderButton";

export interface SelectionsSkillsProps {
  active: OrderedMap<string, number>
  gr: Maybe<number>
  left: number
  list: List<Record<Skill>>
  locale: UIMessagesObject
  value: number
  add (id: string): void
  remove (id: string): void
}

export function SelectionsSkills (props: SelectionsSkillsProps) {
  const { active, add, gr, left, list, locale, remove, value } = props

  return (
    <div className="skills list">
      <h4>
        {
          Maybe.fromMaybe ("")
                          (translate (locale, "rcpselections.labels.skillgroups")
                            .subscript (Maybe.fromMaybe (0) (gr))
                            .fmap (
                              group => translate (
                                locale,
                                "rcpselections.labels.skills",
                                group,
                                value,
                                left
                              )
                           ))
        }
      </h4>
      {
        list
          .map (obj => {
            const id = obj .get ("id")
            const name = obj .get ("name")
            const ic = obj .get ("ic")

            const maybeSR = active .lookup (id)

            return (
              <div key={id}>
                <div className="skillname">{name}</div>
                <span>{Maybe.fromMaybe (0) (maybeSR .fmap (divideBy (ic)))}</span>
                <BorderButton
                  label="+"
                  disabled={left < ic}
                  onClick={add.bind (null, id)}
                  />
                <BorderButton
                  label="-"
                  disabled={Maybe.isNothing (maybeSR)}
                  onClick={remove.bind (null, id)}
                  />
              </div>
            )
          })
          .toArray ()
      }
    </div>
  )
}
