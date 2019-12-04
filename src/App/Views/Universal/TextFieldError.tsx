import * as React from "react";
import { Either, eitherToMaybe, invertEither, isEither } from "../../../Data/Either";
import { fmap } from "../../../Data/Functor";
import { Maybe, maybeToNullable, normalize } from "../../../Data/Maybe";
import { pipe_ } from "../../Utilities/pipe";

interface TextFieldErrorProps {
  error: Maybe<string> | Either<string, any> | undefined
}

export const TextFieldError: React.FC<TextFieldErrorProps> =
  ({ error }) => pipe_ (
    error,
    x => isEither (x) ? eitherToMaybe (invertEither (x)) : x,
    normalize,
    fmap (msg => (
      <p className="error">
        {msg}
      </p>
    )),
    maybeToNullable
  )
