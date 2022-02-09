import * as React from "react"
import { Either, eitherToMaybe, invertEither, isEither } from "../../../Data/Either"
import { fmap } from "../../../Data/Functor"
import { notNullStr } from "../../../Data/List"
import { bindF, ensure, Maybe, maybeToNullable, normalize } from "../../../Data/Maybe"
import { pipe_ } from "../../Utilities/pipe"

interface Props {
  error: Maybe<string> | Either<string, any> | undefined
}

export const TextFieldError: React.FC<Props> =
  ({ error }) => pipe_ (
    error,
    x => isEither (x) ? eitherToMaybe (invertEither (x)) : x,
    normalize,
    bindF (ensure (notNullStr)),
    fmap ((msg: string) => (
      <p className="error">
        {msg}
      </p>
    )),
    maybeToNullable
  )
