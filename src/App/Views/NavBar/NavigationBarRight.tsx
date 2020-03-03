import * as React from "react"

interface Props { }

export const NavigationBarRight: React.FC<Props> = ({ children }) => (
  <div className="navigationbar-right">
    {children}
  </div>
)
