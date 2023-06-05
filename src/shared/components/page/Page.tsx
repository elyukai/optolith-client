import { FCC } from "../../utils/react.ts"
import "./Page.scss"

interface Props {
  id?: string
}

export const Page: FCC<Props> = props => {
  const { children, id } = props

  return (
    <div className="page" id={id}>
      {children}
    </div>
  )
}
