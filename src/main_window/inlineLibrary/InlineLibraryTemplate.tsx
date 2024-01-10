import { Scroll } from "../../shared/components/scroll/Scroll.tsx"
import { FCC } from "../../shared/utils/react.ts"

type Props = {
  className: string
  title: string
  subtitle?: string
}

/**
 * Wraps entry properties in a common view with title and scroll behaviour.
 */
export const InlineLibraryTemplate: FCC<Props> = ({ className, children, title, subtitle }) => (
  <Scroll>
    <div className={`info ${className}-info`}>
      <div className={`info-header ${className}-header`}>
        <h2 className="title">{title}</h2>
        {subtitle === undefined ? null : <p className="subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  </Scroll>
)
