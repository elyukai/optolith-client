import * as React from 'react';
import { Aside } from '../../components/Aside';
import { ErrorMessage } from '../../components/ErrorMessage';
import { UIMessagesObject } from '../../types/ui';
import { Maybe } from '../../Utilities/dataUtils';
import { WikiInfoContent, WikiInfoContentStateProps } from './WikiInfoContent';

export interface WikiInfoOwnProps {
  currentId: Maybe<string>;
  locale: UIMessagesObject;
  noWrapper?: boolean;
}

export interface WikiInfoDispatchProps {}

export type WikiInfoProps = WikiInfoContentStateProps & WikiInfoDispatchProps & WikiInfoOwnProps;

export interface WikiInfoState {
  hasError?: {
    error: Error;
    info: any;
  };
}

export class WikiInfo extends React.Component<WikiInfoProps, WikiInfoState> {
  state: WikiInfoState = {};

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info }}));
  }

  shouldComponentUpdate (nextProps: WikiInfoProps) {
    return nextProps.currentId !== this.props.currentId || nextProps.list !== this.props.list;
  }

  componentWillReceiveProps (nextProps: WikiInfoProps) {
    if (nextProps.currentId !== this.props.currentId && this.state.hasError) {
      this.setState (() => ({ hasError: undefined }));
    }
  }

  render () {
    const { noWrapper } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      const currentElement = (
        <ErrorMessage
          stack={hasError.error.stack!}
          componentStack={hasError.info.componentStack}
          />
      );

      return noWrapper ? currentElement : <Aside>{currentElement}</Aside>;
    }

    return <WikiInfoContent {...this.props} />;
  }
}
