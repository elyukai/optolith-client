/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
/**
 * @module Control.Exception
 *
 * This module provides support for catching exceptions.
 *
 * @author Lukas Obermann
 * @see IO
 */

import { pipe } from "../App/Utilities/pipe"
import { Either, either, Left, Right } from "../Data/Either"
import { bindF, pure } from "../System/IO"


export const toMsg : (err : Error) => string
                   = err => err .message


/**
 * `handle :: Exception e => (e -> IO a) -> IO a -> IO a`
 *
 * This is the simplest of the exception-catching functions. It takes a single
 * argument, runs it, and if an exception is raised the "handler" is executed,
 * with the value of the exception passed as an argument. Otherwise, the result
 * is returned as normal.
 */
export const handle : <A> (f : (err : Error) => Promise<A>) => (x : Promise<A>) => Promise<A>
                    = f => async x => x .catch (f)


/**
 * `handleE :: Exception e => IO a -> IO (Either e a)`
 *
 * Similar to `handle`, but returns an `Either` result which is `(Right a)` if no
 * exception was raised, or `(Left ex)` if an exception was raised and its value
 * is `ex`.
 */
export const handleE : <A> (x : Promise<A>) => Promise<Either<Error, A>>
                     = async x => x .then (Right) .catch (Left)


/**
 * `trySync :: Exception e => (a -> b) -> (e -> b) -> (() -> a) -> b`
 *
 * `trySync f g h` runs `h`. If it throws, it calls `g` with the thrown error
 * and the result of `g` is returned. Otherwise, `f` is called with the result
 * of `h` and the result of `f` is returned.
 *
 * Similar to `try {} catch {]`, but functional.
 */
export const trySync : <A, B> (success : (x : A) => B)
                     => (failure : (x : Error) => B)
                     => <C> (toTry : (x : C) => A)
                     => (x : C)
                     => B
                     = f => g => h => x => {
                       try {
                         const a = h (x)

                         return f (a)
                       }
                       catch (err) {
                         return g (err)
                       }
                     }


/**
 * `pipeEx` takes a function and an `IO` with an `Either` containing a possible
 * error. If the `Either` contains an error, it is returned. Otherwise, the
 * value is passed to the given function whose return value will be returned.
 *
 * This way you can pipe functions that may result in errors.
 */
export const pipeEx : <A, B> (f : (x : A) => Promise<Either<Error, B>>)
                    => (x : Promise<Either<Error, A>>)
                    => Promise<Either<Error, B>>
                    = f => bindF (either <Error, ReturnType<typeof f>> (pipe (Left, pure)) (f))
