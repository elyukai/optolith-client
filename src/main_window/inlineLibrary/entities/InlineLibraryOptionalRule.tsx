import { FC } from "react"
import { Markdown } from "../../../shared/components/markdown/Markdown.tsx"
import { useAppSelector } from "../../hooks/redux.ts"
import { useTranslateMap } from "../../hooks/translateMap.ts"
import { selectOptionalRules } from "../../slices/databaseSlice.ts"
import { InlineLibraryPlaceholder } from "../InlineLibraryPlaceholder.tsx"
import { InlineLibraryTemplate } from "../InlineLibraryTemplate.tsx"
import { Source } from "../shared/Source.tsx"

type Props = {
  id: number
}

export const InlineLibraryOptionalRule: FC<Props> = ({ id }) => {
  const translateMap = useTranslateMap()

  const entry = useAppSelector(selectOptionalRules)[id]
  const translation = translateMap(entry?.translations)

  if (entry === undefined || translation === undefined) {
    return <InlineLibraryPlaceholder />
  }

  return (
    <InlineLibraryTemplate
      className="optional-rule"
      title={translation.name}
      >
      <Markdown className="no-indent" source={translation.description} />
      <Source sources={entry.src} />
    </InlineLibraryTemplate>
  )
}
