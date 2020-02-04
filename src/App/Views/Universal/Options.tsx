import * as React from "react";

interface Props { }

export const Options: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="options">
      {children}
    </div>
  )
}
