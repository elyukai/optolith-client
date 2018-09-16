import * as classNames from 'classnames';
import * as React from 'react';

export interface TextProps {
  children?: React.ReactNode;
  className?: string;
  [id: string]: any;
}

export class Text extends React.Component<TextProps, {}> {
  render() {
    const { children, className, ...other } = this.props;
    return (
      <div {...other} className={classNames('text', className)}>
        {children}
      </div>
    );
  }
}
