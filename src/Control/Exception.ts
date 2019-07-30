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
import { Internals } from "../Data/Internals";
import { fromIO } from "../System/IO";

import IO = Internals.IO

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

/**
 * `trySync :: Exception e => (a -> b) -> (e -> b) -> (() -> a) -> b`
 *
 * `trySync f g h` runs `h`. If it throws, it calls `g` with the thrown error
 * and the result of `g` is returned. Otherwise, `f` is called with the result
 * of `h` and the result of `f` is returned.
 *
 * Similar to `try {} catch {]`, but functional.
 */
export const trySync:
  <A, B> (success: (x: A) => B) => (failure: (x: Error) => B) => (toTry: () => A) => B =
    f => g => h => {
      try {
        const a = h ()

        return f (a)
      }
      catch (err) {
        return g (err)
      }
    }
