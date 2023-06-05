import { FC, useEffect, useState } from "react"
import { Markdown } from "../../../shared/components/markdown/Markdown.tsx"
import { preloadApi } from "../../preload.ts"

export const LastChanges: FC = () => {
  const [ text, setText ] = useState("...")

  useEffect(
    () => {
      preloadApi.getChangelog()
        .then(setText)
        .catch(err => {
          console.error(err)
          setText("Changelog could not be loaded")
        })
    },
    []
  )

  return (
    <>
    {/* <Page id="last-changes">
      <Scroll className="text"> */}
        <Markdown source={text} />
      {/* </Scroll>
    </Page> */}
    </>
  )
}
