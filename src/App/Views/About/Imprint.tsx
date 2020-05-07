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
          {"Duburger Straße 13"}
          <br />
          {"24939 Flensburg"}
          <br />
          {"Germany"}
          <br />
          <a href="mailto:support@optolith.app">{"support@optolith.app"}</a>
        </p>
      </Scroll>
    </Page>
  )
}
