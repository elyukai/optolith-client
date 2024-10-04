import { FC } from "react"
import { Aside } from "../../shared/components/aside/Aside.tsx"
import { Scroll } from "../../shared/components/scroll/Scroll.tsx"
import { useAppSelector } from "../hooks/redux.ts"
import { selectInlineLibraryEntryId } from "../slices/inlineWikiSlice.ts"
import "./InlineLibrary.scss"
import { InlineLibraryPlaceholder } from "./InlineLibraryPlaceholder.tsx"
import { InlineLibraryRouter } from "./InlineLibraryRouter.tsx"

/**
 * Displays all information about a selected entry in a sidebar.
 */
export const InlineLibrary: FC = () => {
  const id = useAppSelector(selectInlineLibraryEntryId)

  return (
    <Aside className="inline-library">
      <Scroll>
        {id === undefined ? <InlineLibraryPlaceholder /> : <InlineLibraryRouter id={id} />}
      </Scroll>
    </Aside>
  )
}
