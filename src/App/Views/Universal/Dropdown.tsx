import * as classNames from "classnames";
import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { find, flength, List, map, toArray } from "../../../Data/List";
import { alt, fromMaybe, isNothing, Maybe, normalize, Nothing, or } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { Label } from "./Label";
import { Scroll } from "./Scroll";

export interface DropdownOption {
  id: Maybe<number | string>
  name: string
  disabled: Maybe<boolean>
}

export const DropdownOption =
  fromDefault<DropdownOption> ({
    id: Nothing,
    name: "",
    disabled: Nothing,
  })

const { disabled: getDisabled, id, name } = DropdownOption.A

export interface DropdownProps {
  className?: string
  disabled?: boolean | Maybe<boolean>
  fullWidth?: boolean
  hint?: string
  label?: string
  options: List<Record<DropdownOption>>
  required?: boolean
  value: boolean | string | number | Maybe<boolean | string | number>
  onChange? (option: Maybe<number | string>): void
  onChangeJust? (option: number | string): void
}

interface DropdownState {
  isOpen: boolean
  position: string
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
  state = {
    isOpen: false,
    position: "bottom",
  }

  // tslint:disable-next-line:no-null-keyword
  containerRef: HTMLDivElement | null = null
  clickInside = false

  switch = () => {
    if (!this.state.isOpen && this.containerRef !== null) {
      const height = flength (this.props.options) < 6 ? flength (this.props.options) * 33 + 1 : 166

      const containerRect = this.containerRef.getBoundingClientRect ()

      if ((window.innerHeight - 32 - containerRect.top) < height) {
        this.setState (() => ({ isOpen: !this.state.isOpen, position: "top" }))
      }
      else {
        this.setState (() => ({ isOpen: !this.state.isOpen, position: "bottom" }))
      }
    }

    this.setState (() => ({ isOpen: !this.state.isOpen }))
  }

  onChange = (option: Maybe<number | string> = Nothing) => {
    const { onChange, onChangeJust } = this.props

    if (typeof onChange === "function") {
      onChange (option)
    }

    if (typeof onChangeJust === "function" && Maybe.isJust (option)) {
      onChangeJust (Maybe.fromJust (option))
    }

    this.setState ({ isOpen: false })
  }

  outsideClick = () => {
    if (!this.clickInside && this.state.isOpen) {
      this.setState ({ isOpen: false })
    }
  }

  insideFocus = () => this.clickInside = true
  insideBlur = () => this.clickInside = false

  componentDidMount () {
    window.addEventListener ("mousedown", this.outsideClick, false)
    window.addEventListener ("ontouchstart", this.outsideClick, false)
  }

  componentWillUnmount () {
    window.removeEventListener ("mousedown", this.outsideClick, false)
    window.removeEventListener ("ontouchstart", this.outsideClick, false)
  }

  render () {
    const { className, disabled, fullWidth, hint, label, options, required, value } = this.props
    const { isOpen, position } = this.state

    const normalizedValue = normalize (value)
    const normalizedDisabled = or (normalize (disabled))

    const style = isOpen ? (flength (options) < 6 ? flength (options) * 33 + 1 : 166) : 0

    const maybeCurrent =
      find<Record<DropdownOption>> (pipe (id, equals (normalizedValue))) (options)

    const valueText = alt (fmap (name) (maybeCurrent)) (Maybe (hint))

    const downElement = (
      <div style={{ height: style }} className="down">
        <div style={{ height: (style - 2) }}>
          <Scroll noInnerElement className={flength (options) > 5 ? "scroll-active" : ""}>
            {
              toArray (
                map<Record<DropdownOption>, JSX.Element>
                  (option => {
                    const classNameInner = classNames (
                      equals (normalizedValue) (id (option)) ? "active" : undefined,
                      or (getDisabled (option)) ? "disabled" : undefined
                    )

                    return (
                      <div
                        className={classNameInner}
                        key={fromMaybe<string | number> ("__DEFAULT__") (id (option))}
                        onClick={
                          !normalizedDisabled
                          && !or (getDisabled (option))
                          ? this.onChange.bind (undefined, id (option))
                          : undefined
                        }
                        >
                        {name (option)}
                      </div>
                    )
                  })
                  (options)
              )
            }
          </Scroll>
        </div>
      </div>
    )

    const placeholder = <div style={{ height: 0 }}></div>

    return (
      <div
        className={classNames (className, position, {
          dropdown: true,
          active: isOpen,
          fullWidth,
          disabled: normalizedDisabled,
          invalid: required === true && isNothing (maybeCurrent),
        })}
        ref={node => this.containerRef = node}
        >
        {typeof label === "string" ? <Label text={label} disabled={normalizedDisabled} /> : null}
        <div
          onMouseDown={this.insideFocus}
          onMouseUp={this.insideBlur}
          onTouchStart={this.insideFocus}
          onTouchEnd={this.insideBlur}
          >
          {position === "top" && isOpen ? downElement : placeholder}
          <div
            onClick={this.switch}
            className={classNames ("value", isNothing (maybeCurrent) ? "hint" : undefined)}
            >
            {fromMaybe ("") (valueText)}
          </div>
          {position === "bottom" && isOpen ? downElement : placeholder}
        </div>
      </div>
    )
  }
}
