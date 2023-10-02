import { FC, ForwardRefRenderFunction, PropsWithChildren } from "react"

/**
 * Functional Component with children
 */
export type FCC<P = object> = FC<PropsWithChildren<P>>

/**
 * Functional Component with children and ref
 */
export type FRRFC<T, P = object> = ForwardRefRenderFunction<T, PropsWithChildren<P>>
