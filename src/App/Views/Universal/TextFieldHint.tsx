import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List } from "../../../Data/List"
import { guardReplace, Just, Maybe, maybeToNullable, normalize } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { pipe_ } from "../../Utilities/pipe"

interface Props {
  hint: Maybe<string> | string | undefined
  value: string
}

export const TextFieldHint: React.FC<Props> =
  ({ hint: mhint, value }) => pipe_ (
    mhint,
    normalize,
    fmap (hint => (
      <div
        className={
          classListMaybe (List (
            Just ("textfield-hint"),
            guardReplace (value !== "") ("hide")
          ))
        }
        >
        {hint}
      </div>
    )),
    maybeToNullable
  )
