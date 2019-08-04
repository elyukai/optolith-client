import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { elem, List } from "../../../Data/List";
import { ensure, mapMaybe, Maybe, maybeToNullable } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { SelectOption, selectToDropdownOption } from "../../Models/Wiki/sub/SelectOption";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { isNumber } from "../../Utilities/typeCheckUtils";
import { Dropdown } from "../Universal/Dropdown";

export interface TerrainKnowledgeProps {
  active: Maybe<number>
  available: List<number>
  terrainKnowledge: Record<SpecialAbility>
  set (id: number): void
}

const SAA = SpecialAbility.A

export function TerrainKnowledge (props: TerrainKnowledgeProps) {
  const { active, available, terrainKnowledge, set } = props

  return (
    <div className="terrain-knowledge">
      <h4>{SAA.name (terrainKnowledge)}</h4>
      {pipe_ (
        terrainKnowledge,
        SAA.select,
        fmap (select => (
          <Dropdown
            value={active}
            options={mapMaybe (pipe (
                                ensure (pipe (
                                  SelectOption.A.id,
                                  id => isNumber (id) && elem (id) (available)
                                )),
                                fmap (selectToDropdownOption)
                              ))
                              (select)}
            onChangeJust={set}
            />
        )),
        maybeToNullable
      )}
    </div>
  )
}
