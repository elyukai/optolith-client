/**
 * @module Control.Exception
 *
 * This module provides support for catching exceptions.
 *
 * @author Lukas Obermann
 * @see IO
 */

import { Either, Left, Right } from "../Data/Either"

export const toMsg = (err: Error) => err .message

/**
 * `catch :: Exception e => IO a -> (e -> IO a) -> IO a`
 *
 * This is the simplest of the exception-catching functions. It takes a single
 * argument, runs it, and if an exception is raised the "handler" is executed,
 * with the value of the exception passed as an argument. Otherwise, the result
 * is returned as normal.
 */
export const catchIO: <A> (x: () => Promise<A>) => (f: (err: Error) => Promise<A>) => Promise<A> =
  x => async f => {
    try {
      return await x ()
    }
    catch (err) {
      return await f (err)
    }
  }

/**
 * `try :: Exception e => IO a -> IO (Either e a)`
 *
 * Similar to `catch`, but returns an `Either` result which is `(Right a)` if no
 * exception was raised, or `(Left ex)` if an exception was raised and its value
 * is `ex`.
 */
export const tryIO: <A extends any[], B> (x: (...p: A) => Promise<B>) =>
                    (...p: A) => Promise<Either<Error, B>> =
  x => async (...p) => {
    try {
      return Right (await x (...p))
    }
    catch (err) {
      return Left (err)
    }
  }

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
