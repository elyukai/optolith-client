import * as React from "react"
import { classList } from "../../utils/classList.ts"
import "./Avatar.scss"

type Props = {
  className?: string
  hasWrapper?: boolean
  img?: boolean
  src: string | undefined
  validPath?: boolean
  onClick?(): void
}

export const Avatar: React.FC<Props> = props => {
  const { className: inheritedClassName, hasWrapper, img, onClick, src, validPath = false } = props

  const className = classList("avatar", inheritedClassName, {
    "no-avatar": hasWrapper !== true && !validPath,
  })

  return img === true ? (
    <img
      className={className}
      src={src !== undefined && validPath === true ? src : undefined}
      onClick={onClick}
      alt=""
    />
  ) : (
    <div
      className={className}
      style={validPath ? { backgroundImage: `url("${src ?? ""}")` } : undefined}
      onClick={onClick}
    />
  )
}
