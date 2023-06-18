import { Dispatch, SetStateAction, useCallback, useState } from "react"

type BooleanState = [
  state: boolean,
  setState: Dispatch<SetStateAction<boolean>>,
  toggleState: () => void,
]

export const useBooleanState = (initialState: boolean | (() => boolean)): BooleanState => {
  const [ state, setState ] = useState(initialState)

  const toggleState = useCallback(() => setState(oldState => !oldState), [])

  return [ state, setState, toggleState ]
}
