import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import { isUrl } from "../../utils/regex.ts"
import { Avatar } from "../avatar/Avatar.tsx"
import "./AvatarWrapper.scss"

type Props = {
  className?: string
  img?: boolean
  src: string
  onClick?: () => void
}

/**
 * A decorated avatar with validation.
 */
export const AvatarWrapper: FCC<Props> = props => {
  const { children, className: inheritedClassName, img, onClick, src } = props

  const validPath = isUrl(src)

  const className = classList("avatar-wrapper", inheritedClassName, { "no-avatar": !validPath })

  return (
    <div className={className} onClick={onClick}>
      {children}
      <Avatar img={img} src={src} hasWrapper validPath={validPath} />
    </div>
  )
}
