import { on } from "@elyukai/utils/function"
import { reduceCompare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { observer } from "mobx-react"
import { type FC, useMemo } from "react"
import { List } from "../../../shared/components/list/List.tsx"
import { CharactersSortOrder } from "../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../shared/hooks/localeCompare.ts"
import { SharedGlobalState } from "../../external.ts"
import { CharacterListItem } from "./CharacterListItem.tsx"

export const CharacterList: FC<{ filterText: string; sortOrder: CharactersSortOrder }> = observer(
  ({ filterText, sortOrder }) => {
    const localeCompare = useLocaleCompare()

    const characters = useMemo(
      () =>
        Object.values(SharedGlobalState.characters)
          .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
          .sort(
            (() => {
              switch (sortOrder) {
                case CharactersSortOrder.Name:
                  return on(c => c.name, localeCompare)
                case CharactersSortOrder.DateModified:
                  return reduceCompare(
                    on(c => c.dateLastModified, localeCompare),
                    on(c => c.name, localeCompare),
                  )
                case CharactersSortOrder.DateCreated:
                  return reduceCompare(
                    on(c => c.dateCreated, localeCompare),
                    on(c => c.name, localeCompare),
                  )
                default:
                  return assertExhaustive(sortOrder)
              }
            })(),
          ),
      [SharedGlobalState.characters, filterText, localeCompare, sortOrder],
    )

    return (
      <List>
        {characters.map(character => (
          <CharacterListItem key={character.id} character={character} />
        ))}
      </List>
    )
  },
)
