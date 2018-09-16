import * as classNames from 'classnames';
import * as React from 'react';

export interface ListItemProps {
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  important?: boolean;
  insertTopMargin?: boolean;
  noIncrease?: boolean;
  recommended?: boolean;
  unrecommended?: boolean;
  onClick?(): void;
}

export class ListItem extends React.Component<ListItemProps, {}> {
  render() {
    const { active, children, className, disabled, important, insertTopMargin, noIncrease, recommended, unrecommended, ...other } = this.props;
    return (
      <li {...other} className={classNames(className, {
        'active': active,
        'imp': important,
        'typ': recommended,
        'untyp': unrecommended,
        'no-increase': noIncrease,
        'top-margin': insertTopMargin,
        disabled
      })}>
        {insertTopMargin && <div className="separator"></div>}
        {children}
      </li>
    );
  }
}
