import { FCC } from "../../utils/react.ts"
import "./Form.scss"

type Props = {
  notSemantic?: boolean
}

export const Form: FCC<Props> = ({ notSemantic, children }) =>
  notSemantic === true ? (
    <div className="form">{children}</div>
  ) : (
    <form className="form">{children}</form>
  )
