import * as React from "react"

interface Props { }

export const ListItemButtons: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="btns">
      {children}
    </div>
  )
}
