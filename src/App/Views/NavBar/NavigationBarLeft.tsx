import * as React from "react";

interface Props { }

export const NavigationBarLeft: React.FC<Props> = ({ children }) => (
  <div className="navigationbar-left">
    {children}
  </div>
)
