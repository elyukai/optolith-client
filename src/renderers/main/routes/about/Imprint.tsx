import { FC } from "react"
import { useTranslate } from "../../hooks/translate.ts"

export const Imprint: FC = () => {
  const translate = useTranslate()
  return (
    <>
     {/* <Page id="imprint">
       <Scroll className="text"> */}
        <h2>{translate("imprint.title")}</h2>

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
      {/* </Scroll>
    </Page> */}
    </>
  )
}
