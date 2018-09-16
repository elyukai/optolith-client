import * as classNames from 'classnames';
import * as React from 'react';
import { List, Maybe, Nothing } from '../utils/dataUtils';
import { Label } from './Label';
import { Scroll } from './Scroll';

export interface DropdownProps {
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  hint?: string;
  label?: string;
  options: List<{
    id: Maybe<number | string>;
    name: string;
    disabled?: boolean;
  }>;
  required?: boolean;
  value: Maybe<boolean | string | number>;
  onChange? (option: Maybe<number | string>): void;
}

interface DropdownState {
  isOpen: boolean;
  position: string;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
  state = {
    isOpen: false,
    position: 'bottom',
  };

  // tslint:disable-next-line:no-null-keyword
  containerRef: HTMLDivElement | null = null;
  clickInside = false;

  switch = () => {
    if (!this.state.isOpen && this.containerRef !== null) {
      const height = this.props.options.length () < 6 ? this.props.options.length () * 33 + 1 : 166;

      const containerRect = this.containerRef.getBoundingClientRect ();

      if ((window.innerHeight - 32 - containerRect.top) < height) {
        this.setState (() => ({ isOpen: !this.state.isOpen, position: 'top' }));
      }
      else {
        this.setState (() => ({ isOpen: !this.state.isOpen, position: 'bottom' }));
      }
    }

    this.setState (() => ({ isOpen: !this.state.isOpen }));
  }

  onChange = (option: Maybe<number | string> = Nothing ()) => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange (option);
    }

    this.setState ({ isOpen: false });
  }

  outsideClick = () => {
    if (!this.clickInside && this.state.isOpen) {
      this.setState ({ isOpen: false });
    }
  }

  insideFocus = () => this.clickInside = true;
  insideBlur = () => this.clickInside = false;

  componentDidMount () {
    window.addEventListener ('mousedown', this.outsideClick, false);
    window.addEventListener ('ontouchstart', this.outsideClick, false);
  }

  componentWillUnmount () {
    window.removeEventListener ('mousedown', this.outsideClick, false);
    window.removeEventListener ('ontouchstart', this.outsideClick, false);
  }

  render () {
    const { className, disabled, fullWidth, hint, label, options, required, value } = this.props;
    const { isOpen, position } = this.state;

    const style = isOpen ? (options.length () < 6 ? options.length () * 33 + 1 : 166) : 0;

    const maybeCurrent = options.find (e => value.equals (e.id));
    const valueText = maybeCurrent
      .fmap (current => current.name)
      .alt (Maybe.fromNullable (hint));

    const downElement = (
      <div style={{ height: style }} className="down">
        <div style={{ height: (style - 2) }}>
          <Scroll noInnerElement className={options.length () > 5 ? 'scroll-active' : ''}>
            {
              options
                .map (option => {
                  const classNameInner = classNames (
                    value.equals (option.id) && 'active',
                    option.disabled && 'disabled'
                  );

                  return (
                    <div
                      className={classNameInner}
                      key={Maybe.fromMaybe<string | number> ('__DEFAULT__') (option.id)}
                      onClick={
                        !disabled && !option.disabled
                          ? this.onChange.bind (undefined, option.id)
                          : undefined}
                      >
                      {option.name}
                    </div>
                  );
                })
                .toArray ()
            }
          </Scroll>
        </div>
      </div>
    );

    const placeholder = <div style={{ height: 0 }}></div>;

    return (
      <div
        className={classNames (className, position, {
          dropdown: true,
          active: isOpen,
          fullWidth,
          disabled,
          invalid: required && Maybe.isNothing (maybeCurrent),
        })}
        ref={node => this.containerRef = node}
        >
        {label && <Label text={label} disabled={disabled} />}
        <div
          onMouseDown={this.insideFocus}
          onMouseUp={this.insideBlur}
          onTouchStart={this.insideFocus}
          onTouchEnd={this.insideBlur}
          >
          {position === 'top' && isOpen ? downElement : placeholder}
          <div
            onClick={this.switch}
            className={classNames ('value', Maybe.isNothing (maybeCurrent) && 'hint')}
            >
            {Maybe.fromMaybe ('') (valueText)}
          </div>
          {position === 'bottom' && isOpen ? downElement : placeholder}
        </div>
      </div>
    );
  }
}
