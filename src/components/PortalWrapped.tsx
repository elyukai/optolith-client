import classNames = require('classnames');
import * as React from 'react';
import * as Portal from 'react-portal';

interface CallBackProps extends React.Props<any> {
  closePortal(): void;
}

interface ReactPortalProps {
  isOpened?: boolean;
  openByClickOn?: React.ReactElement<CallBackProps>;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  onOpen?(node: HTMLDivElement): void;
  beforeClose?(node: HTMLDivElement, resetPortalState: () => void): void;
  onClose?(): void;
  onUpdate?(): void;
}

export interface PortalWrappedOwnProps extends ReactPortalProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export interface PortalWrappedStateProps {
  theme: string;
}

export interface PortalWrappedDispatchProps {}

export type PortalWrappedProps = PortalWrappedStateProps & PortalWrappedDispatchProps & PortalWrappedOwnProps;

export function PortalWrapped(props: PortalWrappedProps) {
  const { children, className, theme, id, ...other } = props;
  return (
    <Portal {...other}>
      <div className={classNames(className, `theme-${theme}`)} id={id}>
        {children}
      </div>
    </Portal>
  );
}
