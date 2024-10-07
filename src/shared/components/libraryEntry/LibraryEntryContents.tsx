import { EntityDescriptionSection } from "@optolith/entity-descriptions"
import { FC, Fragment } from "react"
import { groupBy } from "../../utils/array.ts"
import { classList } from "../../utils/classList.ts"
import { Markdown } from "../markdown/Markdown.tsx"
import { LibraryEntryLabelList } from "./LibraryEntryLabelList.tsx"

type Props = {
  contents: EntityDescriptionSection[]
}

/**
 * Displays all information about a library entry.
 */
export const LibraryEntryContents: FC<Props> = ({ contents }) =>
  groupBy(contents, (a, b) => (a.label === undefined) === (b.label === undefined)).map(
    (group, groupIndex) => {
      const [first] = group

      if (first === undefined) {
        return null
      } else if (first.label === undefined) {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={groupIndex}>
            {group.map((contentSlice, contentSliceIndex) =>
              typeof contentSlice.value === "number" ? (
                // eslint-disable-next-line react/no-array-index-key
                <p key={contentSliceIndex} className={contentSlice.className}>
                  {contentSlice.value}
                </p>
              ) : (
                <Markdown
                  // eslint-disable-next-line react/no-array-index-key
                  key={contentSliceIndex}
                  className={(() => {
                    const classes = classList(
                      { "no-indent": contentSlice.noIndent === true },
                      contentSlice.className,
                    )
                    return classes === "" ? undefined : classes
                  })()}
                  source={contentSlice.value}
                />
              ),
            )}
          </Fragment>
        )
      } else {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <LibraryEntryLabelList key={groupIndex} contents={group} />
        )
      }
    },
  )
