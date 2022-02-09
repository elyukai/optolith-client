import * as React from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import Ph from "remark-breaks"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
  noWrapper?: boolean
  source: string
}

export const Markdown: React.FC<Props> = props => {
  const { className, source = "...", noWrapper } = props

  const a = (p: { children?: React.ReactNode}) => (
                 <>
                   {"["}
                   {p.children}
                   {"]"}
                 </>
               )

  return (
    <ReactMarkdown
      className={classListMaybe (List (
        Just (`markdown`),
        Maybe (className)
      ))}
      unwrapDisallowed={noWrapper === true}
      components={{
        a,
      }}
      plugins={[ Ph ]}
      disallowedElements={noWrapper === true ? [ "p" ] : undefined}
      rehypePlugins={[ rehypeRaw ]}
      >
      {source}
    </ReactMarkdown>
  )
}
