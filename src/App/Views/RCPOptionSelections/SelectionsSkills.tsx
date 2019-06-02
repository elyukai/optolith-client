import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { List, map, subscriptF, toArray } from "../../../Data/List";
import { isNothing, Maybe, maybe } from "../../../Data/Maybe";
import { lookup, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { minus } from "../../Utilities/Chars";
import { translate, translateP } from "../../Utilities/I18n";
import { divideBy } from "../../Utilities/mathUtils";
import { pipe_ } from "../../Utilities/pipe";
import { BorderButton } from "../Universal/BorderButton";

export interface SelectionsSkillsProps {
  active: OrderedMap<string, number>
  gr: Maybe<number>
  left: number
  list: List<Record<Skill>>
  l10n: L10nRecord
  value: number
  add (id: string): void
  remove (id: string): void
}

export function SelectionsSkills (props: SelectionsSkillsProps) {
  const { active, add, gr, left, list, l10n, remove, value } = props

  return (
    <div className="skills list">
      <h4>
        {pipe_ (
          translate (l10n) ("skillselectiongroups"),
          subscriptF (Maybe.sum (gr)),
          fmap (gr_name => translateP (l10n)
                                      ("skillselectionap")
                                      (List<string | number> (
                                        gr_name,
                                        value,
                                        left
                                      )))
        )}
      </h4>
      {pipe_ (
        list,
        map (e => {
          const id = Skill.A.id (e)
          const name = Skill.A.name (e)
          const ic = Skill.A.ic (e)

          const msr = lookup (id) (active)

          return (
            <div key={id}>
              <div className="skillname">{name}</div>
              <span>{maybe (0) (divideBy (ic)) (msr)}</span>
              <BorderButton
                label="+"
                disabled={left < ic}
                onClick={add.bind (null, id)}
                />
              <BorderButton
                label={minus}
                disabled={isNothing (msr)}
                onClick={remove.bind (null, id)}
                />
            </div>
          )
        }),
        toArray
      )}
    </div>
  )
}
