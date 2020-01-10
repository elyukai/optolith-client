import * as React from "react";

export interface NavigationBarRightProps { }

export const NavigationBarRight: React.FC<NavigationBarRightProps> = ({ children }) => (
  <div className="navigationbar-right">
    {children}
  </div>
)
