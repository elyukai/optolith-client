import * as React from "react"
import { classList } from "../../utils/classList.ts"

type Props = {
  className?: string
  icon: string
  onClick?(): void
}

/**
 * A window control for the title bar.
 */
export const TitleBarButton: React.FC<Props> = ({ className, icon, onClick }) => (
  <button
    className={classList("titlebar-btn", className)}
    disabled={onClick === undefined}
    onClick={onClick}
  >
    <span>{icon}</span>
  </button>
)
