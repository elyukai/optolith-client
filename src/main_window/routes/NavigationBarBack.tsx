import { FC } from "react"
import "./NavigationBarBack.scss"

interface Props {
  handleSetTab(): void
}

/**
 * Returns a back button for the beginning of the navigation bar.
 */
export const NavigationBarBack: FC<Props> = props => {
  const { handleSetTab } = props

  return (
    <div className="navigationbar-back">
      <div className="navigationbar-back-inner" onClick={handleSetTab}>
        {"\uE905"}
      </div>
    </div>
  )
}
