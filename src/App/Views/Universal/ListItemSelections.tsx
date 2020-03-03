import * as React from "react"

interface Props { }

export const ListItemSelections: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="selections">
      {children}
    </div>
  )
}
