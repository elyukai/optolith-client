import * as classNames from "classnames";
import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { isPathValidM } from "../../Utilities/RegexUtils";
import { Avatar } from "./Avatar";

export interface AvatarWrapperProps {
  className?: string
  children?: React.ReactNode
  img?: boolean
  src: Maybe<string>
  onClick? (): void
}

export function AvatarWrapper (props: AvatarWrapperProps) {
  const { children, img, onClick, src: msrc } = props
  let { className } = props

  const validPath = isPathValidM (msrc)

  className = classNames (className, {
    "avatar-wrapper": true,
    "no-avatar": !validPath,
  })

  return (
    <div className={className} onClick={onClick}>
      {children}
      <Avatar img={img} src={msrc} hasWrapper validPath={validPath} />
    </div>
  )
}
