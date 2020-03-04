/**
 * This is the simplest of the exception-catching functions. It takes a single
 * argument, runs it, and if an exception is raised the "handler" is executed,
 * with the value of the exception passed as an argument. Otherwise, the result
 * is returned as normal.
 */
let catch: (Js.Promise.error => IO.t('a), IO.t('a)) => IO.t('a);

/**
 * Similar to `catch`, but returns an `Either` result which is `(Right a)` if no
 * exception was raised, or `(Left ex)` if an exception was raised and its value
 * is `ex`.
 */
let try_: IO.t('a) => IO.t(Either.t(Js.Promise.error, 'a));
