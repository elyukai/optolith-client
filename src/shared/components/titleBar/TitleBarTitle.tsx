import { FC } from "react"

type Props = {
  title: string | undefined
}

/**
 * The displayed title of the window.
 */
export const TitleBarTitle: FC<Props> = ({ title }) => <div className="titlebar-title">{title}</div>
