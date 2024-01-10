import { FC } from "react"

/**
 * Temporary component for entry types for which a inline library component is
 * not available yet.
 */
export const InlineLibraryPlaceholder: FC = () => (
  <div className="inline-library-placeholder">{"\uE912"}</div>
)
