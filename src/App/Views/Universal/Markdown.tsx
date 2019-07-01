import * as React from "react";
import ReactMarkdown = require("react-markdown");
import breaks = require("remark-breaks")

export interface MarkdownProps {
  className?: string
  isListElement?: boolean
  oneLine?: "span" | "fragment"
  source: string
}

export interface MarkdownRootProps {
  children?: React.ReactNode
}

type Renderer<A> = (props: A) => React.ReactElement<A>

export function Markdown (props: MarkdownProps) {
  const { className, source = "...", isListElement, oneLine } = props

  const root: string | Renderer<{ children?: React.ReactNode }> =
    oneLine === "fragment"
      ? p => <>{p.children}</>
      : oneLine === "span"
      ? "span"
      : isListElement === true
      ? "ul"
      : "div"

  const link = (p: { children?: React.ReactNode}) => (<>[{p.children}]</>)

  return (
    <ReactMarkdown
      className={className}
      source={source}
      unwrapDisallowed={typeof oneLine === "string"}
      skipHtml
      renderers={{
        root,
        link,
        linkReference: link,
      }}
      plugins={[breaks]}
      disallowedTypes={oneLine ? ["paragraph"] : undefined}
      />
  )
}
