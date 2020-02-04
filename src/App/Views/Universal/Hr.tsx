import * as React from "react"

interface Props {
  className?: string
}

export const Hr: React.FC<Props> = ({ className }) => (
  <hr className={className} />
)
