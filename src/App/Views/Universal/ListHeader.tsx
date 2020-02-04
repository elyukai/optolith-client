import * as React from "react";

interface Props { }

export const ListHeader: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="list-header">
      {children}
    </div>
  )
}
