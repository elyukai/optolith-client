import * as React from "react"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"

export interface ImprintProps {
  staticData: StaticDataRecord
}

export const Imprint = (props: ImprintProps) => {
  const { staticData } = props

  return (
    <Page id="imprint">
      <Scroll className="text">
        <h2>{translate (staticData) ("imprint.title")}</h2>

        <h3>{"Lukas Obermann"}</h3>
        <p>
          {"Ballastbrücke 29"}
          <br />
          {"24937 Flensburg"}
          <br />
          {"Germany"}
          <br />
          <a href="mailto:support@optolith.app">{"support@optolith.app"}</a>
        </p>

        <h3>{"Thore Schuchardt"}</h3>
        <p>
          {"Lehmberg 7b"}
          <br />
          {"24361 Groß Wittensee"}
          <br />
          {"Germany"}
        </p>
      </Scroll>
    </Page>
  )
}
