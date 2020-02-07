import * as React from "react"

interface Props {
  children?: React.ReactNode
}

export const SheetOptions: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="sheet-options">
      {children}
    </div>
  )
}
