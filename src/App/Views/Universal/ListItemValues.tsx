import * as React from "react"

interface Props { }

export const ListItemValues: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="values">
      {children}
    </div>
  )
}
