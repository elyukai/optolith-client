import * as React from "react"
import { isJust, Maybe, Nothing, orN } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { Aside } from "../Universal/Aside"
import { ErrorMessage } from "../Universal/ErrorMessage"
import { WikiInfoContent, WikiInfoContentStateProps } from "./WikiInfoContent"

export interface WikiInfoSelector {
  currentId: string
  index: number
  item: Record<ActiveActivatable>
}

export interface WikiInfoOwnProps {
  currentId?: Maybe<string>
  currentSelector?: Maybe<WikiInfoSelector>
  noWrapper?: boolean
}

export interface WikiInfoDispatchProps {}

export type WikiInfoProps = WikiInfoContentStateProps & WikiInfoDispatchProps & WikiInfoOwnProps

export interface WikiInfoState {
  hasError?: {
    error: Error
    info: any
  }
}

export class WikiInfo extends React.Component<WikiInfoProps, WikiInfoState> {
  state: WikiInfoState = {}

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info } }))
  }

  shouldComponentUpdate (nextProps: WikiInfoProps) {
    const { currentId, currentSelector } = this.props

    return nextProps.currentId !== currentId || nextProps.currentSelector !== currentSelector
  }

  componentDidUpdate (prevProps: WikiInfoProps, prevState: WikiInfoState) {
    const { currentId } = this.props

    if (prevProps.currentId !== currentId && typeof prevState.hasError === "object") {
      this.setState (() => ({ hasError: undefined }))
    }
  }

  render () {
    const {
      currentId,
      currentSelector,
      noWrapper,
      combinedRaces,
      combinedCultures,
      combinedProfessions,
      items,
      languages,
      liturgicalChantExtensions,
      scripts,
      sex,
      spellExtensions,
      staticData,
    } = this.props

    const { hasError } = this.state

    if (typeof hasError === "object") {
      const currentElement = (
        <ErrorMessage
          stack={hasError.error.stack!}
          componentStack={hasError.info.componentStack}
          />
      )

      return orN (noWrapper) ? currentElement : <Aside>{currentElement}</Aside>
    }

    const id = (() => {
      if (currentId && isJust (currentId)) {
        return currentId
      }

      if (currentSelector && isJust (currentSelector)) {
        return Maybe (currentSelector.value.currentId)
      }

      return Nothing
    }) ()
    const selector = (() => {
      if (currentSelector) {
        return currentSelector
      }

      return Nothing
    }) ()

    return (
      <WikiInfoContent
        currentId={id}
        currentSelector={selector}
        noWrapper={noWrapper}
        combinedRaces={combinedRaces}
        combinedCultures={combinedCultures}
        combinedProfessions={combinedProfessions}
        items={items}
        languages={languages}
        liturgicalChantExtensions={liturgicalChantExtensions}
        scripts={scripts}
        sex={sex}
        spellExtensions={spellExtensions}
        staticData={staticData}
        />
    )
  }
}
