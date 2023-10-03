import * as React from "react"
import { FC } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import Ph from "remark-breaks"
import remarkGfm from "remark-gfm"
import { classList } from "../../utils/classList.ts"

type Props = {
  className?: string
  noWrapper?: boolean
  source: string
}

const a = (p: { children?: React.ReactNode }) => (
  <>
    {"["}
    {p.children}
    {"]"}
  </>
)

/**
 * Renders a markdown view.
 */
export const Markdown: FC<Props> = props => {
  const { className, source = "...", noWrapper } = props

  return (
    <ReactMarkdown
      className={classList("markdown", className)}
      unwrapDisallowed={noWrapper === true}
      components={{
        a,
      }}
      disallowedElements={noWrapper === true ? ["p"] : undefined}
      remarkPlugins={[Ph, [remarkGfm, { singleTilde: false }]]}
      rehypePlugins={[rehypeRaw]}
    >
      {source}
    </ReactMarkdown>
  )
}
