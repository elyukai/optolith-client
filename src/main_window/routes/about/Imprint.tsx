import { FC } from "react"
import { Main } from "../../../shared/components/main/Main.tsx"
import { Page } from "../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../shared/components/scroll/Scroll.tsx"
import { useTranslate } from "../../../shared/hooks/translate.ts"

/**
 * Returns a page containing the imprint.
 */
export const Imprint: FC = () => {
  const translate = useTranslate()
  return (
    <Page id="imprint">
      <Main>
        <Scroll className="text">
          <h2>{translate("Imprint")}</h2>

          <h3>{"Lukas Obermann"}</h3>
          <p>
            {"Duburger Straße 13"}
            <br />
            {"24939 Flensburg"}
            <br />
            {"Germany"}
            <br />
            <a href="mailto:support@optolith.app">{"support@optolith.app"}</a>
          </p>

          <h3>{"Philipp Borucki"}</h3>
          <p>
            {"Duburger Straße 13"}
            <br />
            {"24939 Flensburg"}
            <br />
            {"Germany"}
            <br />
            <a href="mailto:support@cloud.optolith.app">{"support@cloud.optolith.app"}</a>
          </p>
        </Scroll>
      </Main>
    </Page>
  )
}
