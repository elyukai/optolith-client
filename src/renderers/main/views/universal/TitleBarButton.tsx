import * as React from "react"
import { classList } from "../../../../shared/helpers/classList.ts"

type Props = {
  className?: string
  icon: string
  onClick (): void
}

export const TitleBarButton: React.FC<Props> = ({ className, icon, onClick }) => (
  <div
    className={classList("titlebar-btn", className)}
    onClick={onClick}
    >
    <span>{icon}</span>
  </div>
)
