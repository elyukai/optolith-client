import { classList } from "@elyukai/utils/classList"
import type { FCC } from "../../utils/react.ts"

type Props = {
  addName?: string
  large?: boolean | React.ReactElement
  name: string
  onClick?(): void
}

/**
 * The name of a list item.
 */
export const ListItemName: FCC<Props> = props => {
  const { addName, children, large, name, onClick } = props

  return (
    <div className={classList("name", { large: large !== undefined })} onClick={onClick}>
      {addName === undefined ? (
        <span
          className={classList("title", {
            "wide-60": name.length > 60,
          })}
        >
          {name}
        </span>
      ) : (
        <span
          className={classList("title", {
            "wide-40": name.length > 40,
            "wide-60": name.length > 60,
          })}
        >
          <span>{name}</span>
          <span className="add">{addName}</span>
        </span>
      )}
      {children}
    </div>
  )
}
