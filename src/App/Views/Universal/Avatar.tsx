import * as React from "react";
import { List } from "../../../Data/List";
import { bind, guard, guardReplace, Just, Maybe, orN, then } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { isURLValidM } from "../../Utilities/RegexUtils";

interface Props {
  className?: string
  hasWrapper?: boolean
  img?: boolean
  src: Maybe<string>
  validPath?: boolean
  onClick? (): void
}

export const Avatar: React.FC<Props> = props => {
  const { className: inheritedClassName, hasWrapper, img, onClick, src: msrc } = props

  const {
    validPath = isURLValidM (msrc),
  } = props

  const className = classListMaybe (List (
    Just ("avatar"),
    bind (Maybe (inheritedClassName)) (guardReplace (hasWrapper !== true)),
    guardReplace (hasWrapper !== true && !validPath) ("no-avatar")
  ))

  return orN (img) ? (
    <img
      className={className}
      src={renderMaybe (then (guard (validPath)) (msrc))}
      onClick={onClick}
      alt=""
      />
  ) : (
    <div
      className={className}
      style={
        validPath
          ? { backgroundImage: `url("${renderMaybe (msrc)}")` }
          : undefined
      }
      onClick={onClick}
      />
  )
}
