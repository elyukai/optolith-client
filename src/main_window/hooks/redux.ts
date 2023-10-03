import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store.ts"

/**
 * A pre-typed hook to access the redux `dispatch` function.
 */
export const useAppDispatch: () => AppDispatch = useDispatch

/**
 * A pre-typed hook to access the redux store's state. This hook takes a
 * selector function as an argument. The selector is called with the store
 * state.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
