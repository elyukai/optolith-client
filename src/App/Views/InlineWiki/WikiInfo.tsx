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
    this.setState (() => ({ hasError: { error, info }}))
  }

  shouldComponentUpdate (nextProps: WikiInfoProps) {
    return nextProps.currentId !== this.props.currentId
  }

  componentWillReceiveProps (nextProps: WikiInfoProps) {
    if (nextProps.currentId !== this.props.currentId && this.state.hasError) {
      this.setState (() => ({ hasError: undefined }))
    }
  }

  render () {
    const { noWrapper } = this.props
    const { hasError } = this.state

    if (hasError) {
      const currentElement = (
        <ErrorMessage
          stack={hasError.error.stack!}
          componentStack={hasError.info.componentStack}
          />
      )

      return orN (noWrapper) ? currentElement : <Aside>{currentElement}</Aside>
    }

    return <WikiInfoContent {...this.props} />
  }
}
