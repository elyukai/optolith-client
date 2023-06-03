import { FC, useEffect, useState } from "react"
import { preloadApi } from "../../preloadApi.ts"

export const ThirdPartyLicenses: FC = () => {
  const [ version, setVersion ] = useState("0.0.0")
  const [ text, setText ] = useState("...")

  useEffect(
    () => {
      preloadApi.getLicense()
        .then(setText)
        .catch(err => {
          console.error(err)
          setText("Third-party licenses could not be loaded")
        })

      preloadApi.getVersion()
        .then(setVersion)
        .catch(console.error)
    },
    []
  )

  return (
    <>
    {/* <Page id="last-changes">
      <Scroll className="text"> */}
        <h2>
          {"Optolith Desktop Client v"}
          {version}
        </h2>
        <p>{"Third Party Software and Content Licenses"}</p>
        <pre className="third-party-software-body">
          {text}
        </pre>
      {/* </Scroll>
    </Page> */}
    </>
  )
}
