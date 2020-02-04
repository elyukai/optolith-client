import * as React from "react";

interface Props { }

export const ListItemLeft: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="left">
      {children}
    </div>
  )
}
