/**
 * @module Control.Exception
 *
 * This module provides support for catching exceptions.
 *
 * @author Lukas Obermann
 * @see IO
 */

import { Either, Left, Right } from "../Data/Either";
import { fmapF } from "../Data/Functor";
import { IO } from "../System/IO";


/**
 * `try :: Exception e => IO a -> IO (Either e a)`
 *
 * Similar to `catch`, but returns an `Either` result which is `(Right a)` if no
 * exception was raised, or `(Left ex)` if an exception was raised and its value
 * is `ex`.
 */
export const tryy =
  <A> (x: IO<A>): IO<Either<Error, A>> => {
    try {
      return fmapF (x) (Right)
    }
    catch (ex) {
      return IO (() => Promise.resolve (Left (ex)))
    }
  }
