import * as React from "react"

interface Props {
  children?: React.ReactNode
}

export const SheetWrapper: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="sheet-wrapper">
      {children}
    </div>
  )
}
