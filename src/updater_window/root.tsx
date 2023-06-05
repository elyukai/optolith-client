import type { UpdateInfo } from "electron-updater"

type Props = {
  updateInfo: UpdateInfo
}

export const Root: React.FC<Props> = props => {
  const { updateInfo: { version } } = props
  return (
    <>
      <h1>{"Update available"}</h1>
      {version}
    </>
  )
}
