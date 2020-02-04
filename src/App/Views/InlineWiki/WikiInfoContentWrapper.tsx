import * as React from "react"
import { orN } from "../../../Data/Maybe"
import { Aside } from "../Universal/Aside"
import { WikiInfoEmpty } from "./WikiInfoEmpty"

export interface WikiInfoContentWrapperProps {
  children?: JSX.Element | null
  noWrapper?: boolean
}

export function WikiInfoContentWrapper (props: WikiInfoContentWrapperProps): JSX.Element {
  const { children, noWrapper } = props

  const safe_elem = children !== null && children !== undefined ? children : <WikiInfoEmpty />

  return orN (noWrapper) ? safe_elem : <Aside>{safe_elem}</Aside>
}
