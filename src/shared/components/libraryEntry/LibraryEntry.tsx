import { EntityDescription } from "@optolith/entity-descriptions"
import { FC } from "react"
import { useAppSelector } from "../../../main_window/hooks/redux.ts"
import { InlineLibraryPlaceholder } from "../../../main_window/inlineLibrary/InlineLibraryPlaceholder.tsx"
import { SelectGetById } from "../../../main_window/selectors/basicCapabilitySelectors.ts"
import { selectLocale } from "../../../main_window/slices/settingsSlice.ts"
import { GetById } from "../../domain/getTypes.ts"
import { useLocaleCompare } from "../../hooks/localeCompare.ts"
import { useTranslate } from "../../hooks/translate.ts"
import { useTranslateMap } from "../../hooks/translateMap.ts"
import { Compare } from "../../utils/compare.ts"
import { Translate, TranslateMap } from "../../utils/translate.ts"
import "./LibraryEntry.scss"
import { LibraryEntryContents } from "./LibraryEntryContents.tsx"
import { LibraryEntryReferences } from "./LibraryEntryReferences.tsx"

/**
 * A function that provides common parameters to every entity desciption
 * creator.
 */
export type PartialEntityDescriptionCreator = (
  defaultDatabaseAccessors: { getPublicationById: GetById.Static.Publication },
  locale: {
    id: string
    translate: Translate
    translateMap: TranslateMap
    compare: Compare<string>
  },
) => EntityDescription | undefined

type Props = {
  createEntityDescription: PartialEntityDescriptionCreator
}

/**
 * Displays all information about a library entry.
 */
export const LibraryEntry: FC<Props> = ({ createEntityDescription }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()
  const getPublicationById = useAppSelector(SelectGetById.Static.Publication)
  const localeId = useAppSelector(selectLocale)

  const libraryEntry = createEntityDescription(
    { getPublicationById },
    { id: localeId ?? "en-US", translate, translateMap, compare: localeCompare },
  )

  if (libraryEntry === undefined) {
    return <InlineLibraryPlaceholder />
  }

  const { title, subtitle, className, body, references } = libraryEntry

  return (
    <div className={`library-entry info ${className}-info`}>
      <div className={`info-header ${className}-header`}>
        <h2 className="title">{title}</h2>
        {subtitle === undefined ? null : <p className="subtitle">{subtitle}</p>}
      </div>
      <LibraryEntryContents contents={body} />
      {references === undefined ? null : <LibraryEntryReferences sources={references} />}
    </div>
  )
}
