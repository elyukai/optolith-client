import { FC, ReactNode } from "react"
import { filterNonNullable } from "../../shared/utils/array.ts"
import "./InlineLibraryProperties.scss"

export type InlineLibraryProperty = {
  label: string
  value: ReactNode
}

type Props = {
  list: (InlineLibraryProperty | undefined)[]
}

export const InlineLibraryProperties: FC<Props> = ({ list }) => (
  <dl className="inline-library-properties">
    {filterNonNullable(list).map(({ label, value }) => (
      <div key={label}>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    ))}
  </dl>
)
