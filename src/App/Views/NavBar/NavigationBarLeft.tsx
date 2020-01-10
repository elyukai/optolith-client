import * as React from "react";

export interface NavigationBarLeftProps { }

export const NavigationBarLeft: React.FC<NavigationBarLeftProps> = ({ children }) => (
  <div className="navigationbar-left">
    {children}
  </div>
)
