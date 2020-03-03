import * as React from "react"
import { List } from "../../../Data/List"
import { fromMaybe, Just, Maybe, Nothing } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { Box } from "./Box"

interface Props {
  className?: string
  label: string
  value?: Maybe<string | number>
}

export const LabelBox: React.FC<Props> = props => {
  const { className, children, label, value = Nothing } = props

  return (
    <div className={classListMaybe (List (Just ("labelbox"), Maybe (className)))}>
      <Box>{fromMaybe (children as any) (value)}</Box>
      <label>{label}</label>
    </div>
  )
}
