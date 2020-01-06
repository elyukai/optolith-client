import * as React from "react";
import { Maybe, orN } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Aside } from "../Universal/Aside";
import { ErrorMessage } from "../Universal/ErrorMessage";
import { WikiInfoContent, WikiInfoContentStateProps } from "./WikiInfoContent";

export interface WikiInfoOwnProps {
  currentId: Maybe<string>
  l10n: L10nRecord
  noWrapper?: boolean
}

export interface WikiInfoDispatchProps {}

export type WikiInfoProps = WikiInfoContentStateProps & WikiInfoDispatchProps & WikiInfoOwnProps

export interface WikiInfoState {
  hasError?: {
    error: Error;
    info: any;
  }
}

export class WikiInfo extends React.Component<WikiInfoProps, WikiInfoState> {
  state: WikiInfoState = {}

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info } }))
  }

  shouldComponentUpdate (nextProps: WikiInfoProps) {
    const { currentId } = this.props

    return nextProps.currentId !== currentId
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
      l10n,
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
      wiki,
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

    return (
      <WikiInfoContent
        currentId={currentId}
        l10n={l10n}
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
        wiki={wiki}
        />
    )
  }
}
