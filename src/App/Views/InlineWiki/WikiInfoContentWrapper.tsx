import * as React from "react"
import { orN } from "../../../Data/Maybe"
import { Aside } from "../Universal/Aside"
import { WikiInfoEmpty } from "./WikiInfoEmpty"

interface Props {
  noWrapper?: boolean
}

export const WikiInfoContentWrapper: React.FC<Props> = props => {
  const { children, noWrapper } = props
  console.log (children)
  const childrenArr = React.Children.toArray (children)
  console.log (childrenArr.length)
  const safe_elem = childrenArr.length > 0 ? childrenArr : <WikiInfoEmpty />
  console.log (safe_elem)

  return orN (noWrapper) ? <>{safe_elem}</> : <Aside>{safe_elem}</Aside>
}
