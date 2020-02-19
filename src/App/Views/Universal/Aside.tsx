import * as React from "react"

interface Props { }

export const Aside: React.FC<Props> = ({ children }) => (
  <aside>
    {children}
  </aside>
)
