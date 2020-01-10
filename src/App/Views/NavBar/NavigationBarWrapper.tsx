import * as React from "react";

export interface NavigationBarWrapperProps { }

export const NavigationBarWrapper: React.FC<NavigationBarWrapperProps> = ({ children }) => (
  <div className="navigationbar">
    <div className="navigationbar-inner">
      {children}
    </div>
  </div>
)
