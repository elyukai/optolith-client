import { pipe } from "../../App/Utilities/pipe";
import { Either, eitherToMaybe, Left, Right } from "../Either";

export const tryParseJSON =
  (x: string): Either<Error, unknown> => {
    try {
      return Right (JSON.parse (x))
    }
    catch (err) {
      return Left (err)
    }
  }

export const parseJSON = pipe (tryParseJSON, eitherToMaybe)
