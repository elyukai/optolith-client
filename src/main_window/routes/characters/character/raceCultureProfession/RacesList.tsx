import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { on } from "@elyukai/utils/function"
import { compareNumber, reduceCompare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { observer } from "mobx-react-lite"
import { useMemo, type FC } from "react"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { RacesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { RacesListItem } from "./RacesListItem.tsx"

type Props = {
  filterText: string
  sortOrder: RacesSortOrder
}

export const RacesList: FC<Props> = observer(props => {
  const { filterText, sortOrder } = props

  const translate = useTranslate()
  const localeCompare = useLocaleCompare()

  const { races = [] } = useCharacterState()

  const filteredRaces = useMemo(
    () =>
      races
        .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
        .toSorted(
          (() => {
            switch (sortOrder) {
              case RacesSortOrder.Name:
                return on(c => c.name, localeCompare)
              case RacesSortOrder.Cost:
                return reduceCompare(
                  on(c => c.apValue, compareNumber),
                  on(c => c.name, localeCompare),
                )
              default:
                return assertExhaustive(sortOrder)
            }
          })(),
        ),
    [races, filterText, localeCompare, sortOrder],
  )

  return (
    <List>
      {ensureNonEmpty(filteredRaces)?.map(race => <RacesListItem key={race.id} race={race} />) ?? (
        <ListPlaceholder type="races" message={translate("No Results")} />
      )}
    </List>
  )
})
