import { FCC } from "../../utils/react.ts"
import { Grid } from "../grid/Grid.tsx"
import "./Options.scss"

export const Options: FCC = props => {
  const { children } = props

  return (
    <aside className="options">
      <Grid size="large">{children}</Grid>
    </aside>
  )
}
