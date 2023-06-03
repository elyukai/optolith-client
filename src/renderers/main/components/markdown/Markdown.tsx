import * as React from "react"
import { FC } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import Ph from "remark-breaks"
import remarkGfm from "remark-gfm"
import { classList } from "../../../../shared/helpers/classList.ts"

type Props = {
  className?: string
  noWrapper?: boolean
  source: string
}

export const Markdown: FC<Props> = props => {
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
      className={classList("markdown", className)}
      unwrapDisallowed={noWrapper === true}
      components={{
        a,
      }}
      disallowedElements={noWrapper === true ? [ "p" ] : undefined}
      remarkPlugins={[ Ph, [ remarkGfm, { singleTilde: false } ] ]}
      rehypePlugins={[ rehypeRaw ]}
      >
      {source}
    </ReactMarkdown>
  )
}
