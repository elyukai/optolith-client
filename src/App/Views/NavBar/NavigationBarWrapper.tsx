import * as React from "react";

interface Props { }

export const NavigationBarWrapper: React.FC<Props> = ({ children }) => (
  <div className="navigationbar">
    <div className="navigationbar-inner">
      {children}
    </div>
  </div>
)
