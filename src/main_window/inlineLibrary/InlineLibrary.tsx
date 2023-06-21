import { FC } from "react"
import { Aside } from "../../shared/components/aside/Aside.tsx"
import { useAppSelector } from "../hooks/redux.ts"
import { selectInlineLibraryEntryId } from "../slices/inlineWikiSlice.ts"
import "./InlineLibrary.scss"
import { InlineLibraryPlaceholder } from "./InlineLibraryPlaceholder.tsx"
import { InlineLibraryRouter } from "./InlineLibraryRouter.tsx"

export const InlineLibrary: FC = () => {
  const id = useAppSelector(selectInlineLibraryEntryId)

  return (
    <Aside className="inline-library">
      {
        id === undefined
        ? <InlineLibraryPlaceholder />
        : <InlineLibraryRouter id={id} />
      }
    </Aside>
  )
}
