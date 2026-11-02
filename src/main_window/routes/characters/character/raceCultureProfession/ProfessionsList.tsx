import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { on } from "@elyukai/utils/function"
import { compareNumber, reduceCompare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { observer } from "mobx-react-lite"
import { useMemo, type FC } from "react"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { ProfessionsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { ProfessionsListItem } from "./ProfessionsListItem.tsx"

type Props = {
  filterText: string
  sortOrder: ProfessionsSortOrder
  showAddSlidein: () => void
}

export const ProfessionsList: FC<Props> = observer(props => {
  const { filterText, sortOrder, showAddSlidein } = props

  const translate = useTranslate()
  const localeCompare = useLocaleCompare()

  const { professions = [] } = useCharacterState()

  const filteredProfessions = useMemo(
    () =>
      professions
        .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
        .toSorted(
          (() => {
            switch (sortOrder) {
              case ProfessionsSortOrder.Name:
                return on(c => c.name, localeCompare)
              case ProfessionsSortOrder.Cost:
                return reduceCompare(
                  on(c => c.apValue, compareNumber),
                  on(c => c.name, localeCompare),
                )
              default:
                return assertExhaustive(sortOrder)
            }
          })(),
        ),
    [professions, filterText, localeCompare, sortOrder],
  )

  return (
    <List>
      {ensureNonEmpty(filteredProfessions)?.map(profession => (
        <ProfessionsListItem
          key={profession.versionId}
          profession={profession}
          showAddSlidein={showAddSlidein}
        />
      )) ?? <ListPlaceholder type="professions" message={translate("No Results")} />}
    </List>
  )
})
