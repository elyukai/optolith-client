import { FC } from "react"
import { InlineLibraryPlaceholder } from "../../../main_window/inlineLibrary/InlineLibraryPlaceholder.tsx"
import { LibraryEntryConfiguredCreator } from "../../domain/libraryEntry.ts"
import { useLocaleCompare } from "../../hooks/localeCompare.ts"
import { useTranslate } from "../../hooks/translate.ts"
import { useTranslateMap } from "../../hooks/translateMap.ts"
import "./LibraryEntry.scss"
import { LibraryEntryContents } from "./LibraryEntryContents.tsx"
import { LibraryEntryReferences } from "./LibraryEntryReferences.tsx"

type Props = {
  createLibraryEntry: LibraryEntryConfiguredCreator
}

/**
 * Displays all information about a library entry.
 */
export const LibraryEntry: FC<Props> = ({ createLibraryEntry }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const libraryEntry = createLibraryEntry({ translate, translateMap, localeCompare })

  if (libraryEntry === undefined) {
    return <InlineLibraryPlaceholder />
  }

  const { title, subtitle, className, content, src } = libraryEntry

  return (
    <div className={`library-entry info ${className}-info`}>
      <div className={`info-header ${className}-header`}>
        <h2 className="title">{title}</h2>
        {subtitle === undefined ? null : <p className="subtitle">{subtitle}</p>}
      </div>
      <LibraryEntryContents contents={content} />
      {src === undefined ? null : <LibraryEntryReferences sources={src} />}
    </div>
  )
}
