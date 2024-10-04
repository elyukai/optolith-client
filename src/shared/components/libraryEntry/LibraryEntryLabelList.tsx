import { FC } from "react"
import { LibraryEntryContent } from "../../domain/libraryEntry.ts"
import { Markdown } from "../markdown/Markdown.tsx"
import "./LibraryEntryLabelList.scss"

type Props = {
  contents: LibraryEntryContent[]
}

/**
 * Displays all information about a library entry.
 */
export const LibraryEntryLabelList: FC<Props> = ({ contents }) => (
  <dl className="inline-library-properties">
    {contents.map((content, contentIndex) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={contentIndex}>
        <dt>{content.label}</dt>
        <dd className="markdown">
          {typeof content.value === "number" ? (
            content.value
          ) : (
            <Markdown
              className={content.noIndent === true ? "no-indent" : undefined}
              source={content.value}
              noWrapper
            />
          )}
        </dd>
      </div>
    ))}
  </dl>
)
