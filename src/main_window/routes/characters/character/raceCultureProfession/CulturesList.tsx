import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { on } from "@elyukai/utils/function"
import { compareNumber, reduceCompare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { observer } from "mobx-react-lite"
import { useMemo, type FC } from "react"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { RacesSortOrder, type CulturesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { CulturesListItem } from "./CulturesListItem.tsx"

type Props = {
  filterText: string
  sortOrder: CulturesSortOrder
}

export const CulturesList: FC<Props> = observer(props => {
  const { filterText, sortOrder } = props

  const translate = useTranslate()
  const localeCompare = useLocaleCompare()

  const { cultures = [] } = useCharacterState()

  const filteredCultures = useMemo(
    () =>
      cultures
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
    [cultures, filterText, localeCompare, sortOrder],
  )

  return (
    <List>
      {ensureNonEmpty(filteredCultures)?.map(culture => (
        <CulturesListItem key={culture.id} culture={culture} />
      )) ?? <ListPlaceholder type="cultures" message={translate("No Results")} />}
    </List>
  )
})
