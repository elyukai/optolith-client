import { FC, ForwardRefRenderFunction, PropsWithChildren } from "react"

/**
 * Functional Component with children
 */
export type FCC<P = {}> = FC<PropsWithChildren<P>>

/**
 * Functional Component with children and ref
 */
export type FRRFC<T, P = {}> = ForwardRefRenderFunction<T, PropsWithChildren<P>>
