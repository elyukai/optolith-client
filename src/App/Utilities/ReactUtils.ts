import { ReactElement } from "react";
import { fromMaybe, maybe, Maybe } from "../../Data/Maybe";

export type ReactReturn = ReactElement | null

/**
 * `renderMaybe :: Maybe (String | Int) -> (String | Int)`
 *
 * Returns the value in the `Just` or `""` if it is `Nothing`.
 */
export const renderMaybe =
  fromMaybe<string | number> ("") as <A extends string | number> (x: Maybe<A>) => A | string

/**
 * `renderMaybeWith :: (a -> (String | Int)) -> Maybe a -> (String | Int)`
 *
 * The function `renderMaybeWith f x` return the result of `f` if `x` is a
 * `Just`, where the value of the `Just` is passed to `f`, or `""` if `x` is
 * `Nothing`.
 */
export const renderMaybeWith = maybe<string | number> ("")
