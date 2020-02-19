import * as React from "react"

interface Props {
  handleSetTab (): void
}

export const NavigationBarBack: React.FC<Props> = props => {
  const { handleSetTab } = props

  return (
    <div className="navigationbar-back">
      <div className="navigationbar-back-inner" onClick={handleSetTab}>
        {"\uE905"}
      </div>
    </div>
  )
}
