import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { isURLValidM } from "../../Utilities/RegexUtils"
import { Avatar } from "./Avatar"

interface Props {
  className?: string
  children?: React.ReactNode
  img?: boolean
  src: Maybe<string>
  onClick?: () => void
}

export const AvatarWrapper: React.FC<Props> = props => {
  const { children, img, onClick, src: msrc } = props
  let { className } = props

  const validPath = isURLValidM (msrc)

  className = classListMaybe (List (
    Just ("avatar-wrapper"),
    guardReplace (!validPath) ("no-avatar")
  ))

  return (
    <div className={className} onClick={onClick}>
      {children}
      <Avatar
        img={img}
        src={msrc}
        hasWrapper
        validPath={validPath}
        />
    </div>
  )
}
