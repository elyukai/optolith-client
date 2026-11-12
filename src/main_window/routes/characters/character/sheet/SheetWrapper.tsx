import type { FCC } from "../../../../../shared/utils/react.ts"

export const SheetWrapper: FCC = props => {
  const { children } = props

  return <div className="sheet-wrapper">{children}</div>
}
