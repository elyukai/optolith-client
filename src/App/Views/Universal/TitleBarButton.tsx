import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

interface Props {
  className?: string
  icon: string
  onClick (): void
}

export const TitleBarButton: React.FC<Props> = ({ className, icon, onClick }) => (
  <div
    className={classListMaybe (List (Just ("titlebar-btn"), Maybe (className)))}
    onClick={onClick}
    >
    <span>{icon}</span>
  </div>
)
