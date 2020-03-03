import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe, orN } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import Ph = require ("remark-breaks")
import ReactMarkdown = require ("react-markdown")
import HTMLParser = require ("react-markdown/plugins/html-parser")

const parseHtml = HTMLParser ({
  isValidNode: (node: any) => node.type !== "script",
})

interface Props {
  className?: string
  isListElement?: boolean
  noWrapper?: boolean
  source: string
}

type Renderer<A> = (props: A) => React.ReactElement<A>

export const Markdown: React.FC<Props> = props => {
  const { className, source = "...", isListElement, noWrapper } = props

  const root: string | Renderer<{ children?: React.ReactNode }> =
    noWrapper === true ? p => <>{p.children}</> : orN (isListElement) ? "ul" : "div"

  const link = (p: { children?: React.ReactNode}) => (
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
      source={source}
      unwrapDisallowed={noWrapper === true}
      renderers={{
        root,
        link,
        linkReference: link,
      }}
      plugins={[ Ph ]}
      disallowedTypes={noWrapper === true ? [ "paragraph" ] : undefined}
      escapeHtml={false}
      astPlugins={[ parseHtml ]}
      />
  )
}
