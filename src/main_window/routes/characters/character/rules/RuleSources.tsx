import { on } from "@elyukai/utils/function"
import { compareNumber, reduceCompare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { PublicationCategory } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { type FC, useCallback, useMemo } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useAppDispatch } from "../../../../hooks/redux.ts"
import { RuleSourcesListItem } from "./RuleSourcesListItem.tsx"

const publicationCategoryToNumber = (category: PublicationCategory): number => {
  switch (category.kind) {
    case "CoreRules":
      return 0
    case "Adventure":
    case "ExpansionRules":
    case "RegionalSourcebook":
    case "Sourcebook":
      return 1
    default:
      return assertExhaustive(category)
  }
}

/**
 * Returns a page section for managing the publications to use for a character.
 */
export const RuleSources: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const state = useCharacterState()
  const actions = useCharacterActions()

  const publicationOptions = useMemo(
    () =>
      state.publications.toSorted(
        reduceCompare(
          on(x => publicationCategoryToNumber(x.category), compareNumber),
          on(x => x.name, localeCompare),
        ),
      ),
    [localeCompare, state.publications, translateMap],
  )

  const handleSwitchIncludeAllPublications = useCallback(
    () => actions.toggleIncludeAllPublications(),
    [dispatch],
  )

  return (
    <>
      <h2>{translate("Rule Sources")}</h2>
      <Checkbox
        checked={state.includeAllPublications}
        onClick={handleSwitchIncludeAllPublications}
        label={translate("Use all publications")}
      />
      <ul className="rule-books">
        {publicationOptions.map(e => (
          <RuleSourcesListItem key={e.id} publication={e} />
        ))}
      </ul>
    </>
  )
})
