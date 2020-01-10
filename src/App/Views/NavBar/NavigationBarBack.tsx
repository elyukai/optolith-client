import * as React from "react";

export interface NavigationBarBackProps {
  handleSetTab (): void
}

export function NavigationBarBack (props: NavigationBarBackProps) {
  const { handleSetTab } = props

  return (
    <div className="navigationbar-back">
      <div className="navigationbar-back-inner" onClick={handleSetTab}>
        {"&#xE905;"}
      </div>
    </div>
  )
}
