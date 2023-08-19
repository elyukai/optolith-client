import { FC, useEffect, useState } from "react"
import { Main } from "../../../shared/components/main/Main.tsx"
import { Markdown } from "../../../shared/components/markdown/Markdown.tsx"
import { Page } from "../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../shared/components/scroll/Scroll.tsx"
import { ExternalAPI } from "../../external.ts"

let savedText: string | undefined = undefined

export const LastChanges: FC = () => {
  const [text, setText] = useState(savedText ?? "...")

  useEffect(() => {
    if (savedText === undefined) {
      ExternalAPI.getChangelog()
        .then(loadedText => {
          setText(loadedText)
          savedText = loadedText
        })
        .catch(err => {
          console.error(err)
          setText("Changelog could not be loaded")
        })
    }
  }, [])

  return (
    <Page id="last-changes">
      <Main>
        <Scroll className="text">
          <Markdown source={text} />
        </Scroll>
      </Main>
    </Page>
  )
}
