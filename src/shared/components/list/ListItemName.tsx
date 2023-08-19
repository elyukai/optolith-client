import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"

type Props = {
  addName?: string
  large?: boolean | JSX.Element
  name: string
  onClick?(): void
}

export const ListItemName: FCC<Props> = props => {
  const { addName, children, large, name, onClick } = props

  return (
    <div className={classList("name", { large: large !== undefined })} onClick={onClick}>
      {addName === undefined ? (
        <p className="title">{name}</p>
      ) : (
        <p className="title">
          <span>{name}</span>
          <span className="add">{addName}</span>
        </p>
      )}
      {children}
    </div>
  )
}
