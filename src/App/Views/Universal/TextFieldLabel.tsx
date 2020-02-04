import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { notNullStr } from "../../../Data/List"
import { bindF, ensure, Maybe, maybeToNullable, normalize } from "../../../Data/Maybe"
import { pipe_ } from "../../Utilities/pipe"
import { Label } from "./Label"

interface Props {
  label: Maybe<string> | string | undefined
}

export const TextFieldLabel: React.FC<Props> =
  ({ label }) => pipe_ (
    label,
    normalize,
    bindF (ensure (notNullStr)),
    fmap (l => <Label text={l} />),
    maybeToNullable
  )
