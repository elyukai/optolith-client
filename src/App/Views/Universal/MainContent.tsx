import * as React from "react"

interface Props { }

export const MainContent: React.FC<Props> = props => {
  const { children } = props

  return (
    <main className="main-content">
      {children}
    </main>
  )
}
