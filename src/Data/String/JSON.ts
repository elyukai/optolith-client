import { pipe } from "../../App/Utilities/pipe";
import { Either, Left, Right } from "../Either";
import { eitherToMaybe } from "../Either/Extra";

export const tryParseJSON =
  (x: string): Either<Error, any> => {
    try {
      return Right (JSON.parse (x))
    }
    catch (err) {
      return Left (err)
    }
  }

export const parseJSON = pipe (tryParseJSON, eitherToMaybe)
