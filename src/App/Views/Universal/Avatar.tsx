import classNames from "classnames";
import * as React from "react";
import { guard, Maybe, then } from "../../../Data/Maybe";
import { isPathValidM } from "../../Utilities/RegexUtils";

export interface AvatarProps {
  className?: string
  hasWrapper?: boolean
  img?: boolean
  src: Maybe<string>
  validPath?: boolean
  onClick? (): void
}

export function Avatar (props: AvatarProps) {
  const { className: inheritedClassName, hasWrapper, img, onClick, src: msrc } = props

  const {
    validPath = isPathValidM (msrc),
  } = props

  const className = classNames (
    hasWrapper !== true ? inheritedClassName : undefined,
    {
      "avatar": true,
      "no-avatar": hasWrapper !== true && !validPath,
    }
  )

  return img === true ? (
    <img
      className={className}
      src={Maybe.fromMaybe ("") (then (guard (validPath)) (msrc))}
      onClick={onClick}
      alt=""
      />
  ) : (
    <div
      className={className}
      style={
        validPath
          ? { backgroundImage: `url("${Maybe.fromMaybe ("") (msrc)}")` }
          : undefined
      }
      onClick={onClick}
      />
  )
}
