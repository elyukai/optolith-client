import * as React from "react";

interface Props {
  id?: string
}

export const Page: React.FC<Props> = props => {
  const { children, id } = props

  return (
    <div className="page" id={id}>
      {children}
    </div>
  )
}
