import type { FCC } from "../../../../../shared/utils/react.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectSheetUseParchment } from "../../../../slices/settingsSlice.ts"
import { SheetHeader } from "./SheetHeader.tsx"
import type { HeaderValue } from "./SheetHeaderAttribute.tsx"

type Props = {
  addHeaderInfo?: HeaderValue[]
  id: string
  title: string
}

export const Sheet: FCC<Props> = props => {
  const { addHeaderInfo, children, id, title } = props

  const useParchment = useAppSelector(selectSheetUseParchment)
  const className = useParchment ? "sheet paper" : "sheet"

  return (
    <div className={className} id={id}>
      <SheetHeader title={title} add={addHeaderInfo} />
      {children}
    </div>
  )
}
