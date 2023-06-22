import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"

interface Props {
  active?: boolean
  className?: string
  disabled?: boolean
  important?: boolean
  insertTopMargin?: boolean
  noIncrease?: boolean
  recommended?: boolean
  unrecommended?: boolean
  onClick?(): void
}

export const ListItem: FCC<Props> = props => {
  const {
    active,
    children,
    className,
    disabled,
    important,
    insertTopMargin,
    noIncrease,
    recommended,
    unrecommended,
    onClick,
  } = props

  return (
    <li
      className={classList(className, {
        active,
        disabled,
        imp: important,
        "top-margin": insertTopMargin,
        "no-increase": noIncrease,
        typ: recommended,
        untyp: unrecommended,
      })}
      onClick={onClick}
      >
      {insertTopMargin === true ? <div className="separator" /> : null}
      {children}
    </li>
  )
}
