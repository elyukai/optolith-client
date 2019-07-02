/**
 * @module Control.Exception
 *
 * This module provides support for catching exceptions.
 *
 * @author Lukas Obermann
 * @see IO
 */

import { pipe } from "../App/Utilities/pipe";
import { Either, Left, Right } from "../Data/Either";
import { ident } from "../Data/Function";
import { fromIO, IO } from "../System/IO";

/**
 * `catch :: Exception e => IO a -> (e -> IO a) -> IO a`
 *
 * This is the simplest of the exception-catching functions. It takes a single
 * argument, runs it, and if an exception is raised the "handler" is executed,
 * with the value of the exception passed as an argument. Otherwise, the result
 * is returned as normal.
 */
export const catchIO =
  <A> (x: IO<A>) =>
  (f: (err: Error) => IO<A>): IO<A> =>
    IO (() => fromIO (x) .then (ident, pipe (f, fromIO)))

/**
 * `try :: Exception e => IO a -> IO (Either e a)`
 *
 * Similar to `catch`, but returns an `Either` result which is `(Right a)` if no
 * exception was raised, or `(Left ex)` if an exception was raised and its value
 * is `ex`.
 */
export const tryIO =
  <A> (x: IO<A>): IO<Either<Error, A>> =>
    IO (() => fromIO (x) .then (Right, Left))
