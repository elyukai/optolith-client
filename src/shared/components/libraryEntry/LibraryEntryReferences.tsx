import { FC } from "react"

type Props = {
  sources: string
}

/**
 * Displays the sources of an entry.
 */
export const LibraryEntryReferences: FC<Props> = ({ sources }) => (
  <p className="sources no-indent">{sources}</p>
)
