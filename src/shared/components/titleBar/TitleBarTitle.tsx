import { FC } from "react"

type Props = {
  title: string | undefined
}

export const TitleBarTitle: FC<Props> = ({ title }) => <div className="titlebar-title">{title}</div>
