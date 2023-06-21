import { SetStateAction, useCallback, useState } from "react"

/**
 * A hook that works like `useState` but its setter function toggles the state
 * if no argument is passed.
 */
export const useToggleState = (initialState: boolean | (() => boolean)): [
  state: boolean,
  toggleOrSetState: (newState?: SetStateAction<boolean>) => void,
] => {
  const [ state, setState ] = useState(initialState)

  const toggleState = useCallback(
    (newState?: SetStateAction<boolean>) => setState(
      oldState => typeof newState === "function"
        ? newState(oldState)
        : (newState ?? !oldState)
    ),
    []
  )

  return [ state, toggleState ]
}
