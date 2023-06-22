import { FC, ForwardRefRenderFunction, PropsWithChildren } from "react"

export type FCC<P = {}> = FC<PropsWithChildren<P>>

export type FRRFC<T, P = {}> = ForwardRefRenderFunction<T, PropsWithChildren<P>>
