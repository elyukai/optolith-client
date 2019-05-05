import { fromMaybe, maybe } from "../../Data/Maybe";

/**
 * `renderMaybe :: Maybe (String | Int) -> (String | Int)`
 *
 * Returns the value in the `Just` or `""` if it is `Nothing`.
 */
export const renderMaybe = fromMaybe<string | number> ("")

/**
 * `renderMaybeWith :: (a -> (String | Int)) -> Maybe a -> (String | Int)`
 *
 * The function `renderMaybeWith f x` return the result of `f` if `x` is a
 * `Just`, where the value of the `Just` is passed to `f`, or `""` if `x` is
 * `Nothing`.
 */
export const renderMaybeWith = maybe<string | number> ("")
