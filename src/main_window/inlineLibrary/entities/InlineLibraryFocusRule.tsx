import { FC } from "react"
import { Markdown } from "../../../shared/components/markdown/Markdown.tsx"
import { useTranslateMap } from "../../../shared/hooks/translateMap.ts"
import { romanize } from "../../../shared/utils/roman.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { selectFocusRuleSubjects, selectFocusRules } from "../../slices/databaseSlice.ts"
import { InlineLibraryPlaceholder } from "../InlineLibraryPlaceholder.tsx"
import { InlineLibraryTemplate } from "../InlineLibraryTemplate.tsx"
import { Source } from "../shared/Source.tsx"

type Props = {
  id: number
}

export const InlineLibraryFocusRule: FC<Props> = ({ id }) => {
  const translateMap = useTranslateMap()

  const entry = useAppSelector(selectFocusRules)[id]
  const subjects = useAppSelector(selectFocusRuleSubjects)
  const translation = translateMap(entry?.translations)

  if (entry === undefined || translation === undefined) {
    return <InlineLibraryPlaceholder />
  }

  return (
    <InlineLibraryTemplate
      className="focus-rule"
      title={`${translation.name} (${romanize(entry.level)})`}
      subtitle={translateMap(subjects[entry.subject.id.subject]?.translations)?.name}
      >
      <Markdown className="no-indent" source={translation.description} />
      <Source sources={entry.src} />
    </InlineLibraryTemplate>
  )
}
