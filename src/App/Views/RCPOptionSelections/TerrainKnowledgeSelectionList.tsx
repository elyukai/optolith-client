import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { elem, List } from "../../../Data/List"
import { bindF, ensure, joinMaybeList, mapMaybe, Maybe, maybe } from "../../../Data/Maybe"
import { lookup } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { SpecialAbilityId } from "../../Constants/Ids"
import { TerrainKnowledgeSelection } from "../../Models/Wiki/professionSelections/TerrainKnowledgeSelection"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption, selectToDropdownOption } from "../../Models/Wiki/sub/SelectOption"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { isNumber } from "../../Utilities/typeCheckUtils"
import { Dropdown } from "../Universal/Dropdown"

const WA = WikiModel.A
const TKSA = TerrainKnowledgeSelection.A
const SAA = SpecialAbility.A

export const isTerrainKnowledgeSelectionValid =
  (activeTerrain: Maybe<number>) =>
  (selection: Record<TerrainKnowledgeSelection>): Tuple<[boolean]> => {
    const sid = TKSA.sid (selection)

    const is_terrain_valid = Maybe.any (List.elemF (sid)) (activeTerrain)

    return Tuple (is_terrain_valid)
  }

interface Props {
  wiki: WikiModelRecord
  active: Maybe<number>
  selection: Record<TerrainKnowledgeSelection>
  setTerrainId (id: number): void
}

export const TerrainKnowledgeSelectionList: React.FC<Props> = props => {
  const { active, selection, setTerrainId, wiki } = props

  const available = TKSA.sid (selection)

  const terrain_knowledge = React.useMemo (
    () => pipe_ (
      wiki,
      WA.specialAbilities,
      lookup <string> (SpecialAbilityId.TerrainKnowledge)
    ),
    [ wiki ]
  )

  const terrains = React.useMemo (
    () => pipe_ (
      terrain_knowledge,
      bindF (SAA.select),
      joinMaybeList,
      mapMaybe (pipe (
        ensure (pipe (
          SelectOption.A.id,
          id => isNumber (id) && elem (id) (available)
        )),
        fmap (selectToDropdownOption)
      ))
    ),
    [ available, terrain_knowledge ]
  )

  return (
    <div className="terrain-knowledge">
      <h4>{maybe ("") (SAA.name) (terrain_knowledge)}</h4>
      <Dropdown
        value={active}
        options={terrains}
        onChangeJust={setTerrainId}
        />
    </div>
  )
}
