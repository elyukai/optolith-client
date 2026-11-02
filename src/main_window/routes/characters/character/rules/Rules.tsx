import type { FC } from "react"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { AlternativeRules } from "./AlternativeRules.tsx"
import { FocusRules } from "./FocusRules.tsx"
import { OptionalRules } from "./OptionalRules.tsx"
import "./Rules.scss"
import { RuleSources } from "./RuleSources.tsx"

/**
 * Returns a page for managing a character’s ruleset.
 */
export const Rules: FC = () => (
  <Page id="rules">
    <Main>
      <Scroll>
        <RuleSources />
        <FocusRules />
        <OptionalRules />
        <AlternativeRules />
      </Scroll>
    </Main>
    <InlineLibrary />
  </Page>
)
