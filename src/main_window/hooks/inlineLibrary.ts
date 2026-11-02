import type { AvailableCreatorEntity } from "@optolith/entity-descriptions"
import { useCallback } from "react"
import { InlineLibraryManager } from "../inlineLibrary/InlineLibrary.tsx"

export const useInlineLibrary = (entity: AvailableCreatorEntity, id: string) => {
  const displayInlineLibraryEntry = useCallback(
    () => InlineLibraryManager.instance.goTo([entity, id]),
    [id],
  )
  const selectedInlineLibraryEntryId = InlineLibraryManager.instance.current
  const isActiveInInlineLibrary =
    selectedInlineLibraryEntryId?.[0] === entity && selectedInlineLibraryEntryId[1] === id

  return { displayInlineLibraryEntry, isActiveInInlineLibrary }
}
