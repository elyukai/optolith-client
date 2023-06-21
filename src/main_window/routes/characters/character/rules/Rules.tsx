import { FC } from "react"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { FocusRules } from "./FocusRules.tsx"
import { OptionalRules } from "./OptionalRules.tsx"
import { RuleSources } from "./RuleSources.tsx"
import "./Rules.scss"

export const Rules: FC = () => (
  <Page id="rules">
    <Scroll>
      <RuleSources />
      <FocusRules />
      <OptionalRules />
    </Scroll>
    <InlineLibrary />
  </Page>
)
