import * as React from "react";
import { equals } from "../../../Data/Eq";
import { cons, elemF, filter, find, flength, fnull, intercalate, List, map, notNull, toArray } from "../../../Data/List";
import { any, ensure, fromJust, fromMaybe, guardReplace, isJust, Just, Maybe, maybe, maybeToList, normalize, Nothing, or, orN } from "../../../Data/Maybe";
import { Accessors, fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator, StrictAccessors } from "../../../Data/Record";
import { classListMaybe } from "../../Utilities/CSS";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { Label } from "./Label";
import { Scroll } from "./Scroll";

type DropdownKey = string | number

export interface DropdownOption<A extends DropdownKey = DropdownKey> {
  "@@name": "DropdownOption"
  id: Maybe<A>
  name: string
  disabled: Maybe<boolean>
}

interface DropdownOptionAccessors extends Accessors<DropdownOption> {
  id:
  <A extends DropdownKey>
  (x: Record<Pick<OmitName<DropdownOption<A>>, "id"> & { "@@name": string }>) => Maybe<A>
}

interface DropdownOptionStrictAccessors extends StrictAccessors<DropdownOption> {
  id: <A extends DropdownKey> (x: Record<DropdownOption<A>>) => Maybe<A>
}

interface DropdownOptionCreator extends RecordCreator<DropdownOption> {
  <A extends DropdownKey = DropdownKey>
  (x: PartialMaybeOrNothing<OmitName<DropdownOption<A>>>): Record<DropdownOption<A>>
  readonly default: Record<DropdownOption>
  readonly AL: DropdownOptionAccessors
  readonly A: DropdownOptionStrictAccessors
  readonly is:
    <B, A extends DropdownKey> (x: B | Record<DropdownOption<A>>) => x is Record<DropdownOption<A>>
}

export const DropdownOption: DropdownOptionCreator =
  fromDefault ("DropdownOption") <DropdownOption<any>> ({
                id: Nothing,
                name: "",
                disabled: Nothing,
              })

const DOA = DropdownOption.A

export interface DropdownProps<A extends DropdownKey> {
  className?: string
  disabled?: boolean | Maybe<boolean>
  fullWidth?: boolean
  hint?: string
  label?: string
  options: List<Record<DropdownOption<A>>>
  required?: boolean
  value?: A | Maybe<A>
  values?: List<A>
  onChange? (option: Maybe<A>): void
  onChangeJust? (option: A): void
  onChangeList? (selected: List<A>): void
}

interface DropdownState {
  isOpen: boolean
  position: string
}

export class Dropdown<A extends DropdownKey>
  extends React.Component<DropdownProps<A>, DropdownState> {
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

  onChange = (option: Maybe<A> = Nothing) => {
    const { onChange, onChangeJust, onChangeList, values } = this.props

    if (typeof onChange === "function") {
      onChange (option)
    }

    if (typeof onChangeJust === "function" && isJust (option)) {
      onChangeJust (fromJust (option))
    }

    if (typeof onChangeList === "function" && values !== undefined && isJust (option)) {
      onChangeList (cons (values) (fromJust (option)))
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
    const {
      className,
      disabled,
      fullWidth,
      hint,
      label,
      options,
      required,
      value,
      values,
    } = this.props

    const { isOpen, position } = this.state

    const isMultiple = values !== undefined
    const normalizedValue = normalize (value)
    const normalizedValues = values === undefined ? List<A> () : values
    const normalizedDisabled = or (normalize (disabled))

    const style = isOpen ? (flength (options) < 6 ? flength (options) * 33 + 1 : 166) : 0

    const mselected =
      !isMultiple
        ? pipe_ (
            options,
            find<Record<DropdownOption<A>>> (pipe (DOA.id, equals (normalizedValue))),
            maybeToList
          )
        : filter<Record<DropdownOption<A>>> (pipe (DOA.id, any (elemF (normalizedValues))))
                                            (options)

    const valueText =
      pipe_ (
        mselected,
        ensure (notNull),
        maybe (renderMaybe (Maybe (hint)))
              (pipe (
                map (DOA.name),
                intercalate (", ")
              ))
      )

    const downElement = (
      <div style={{ height: style }} className="down">
        <div style={{ height: (style - 2) }}>
          <Scroll noInnerElement className={flength (options) > 5 ? "scroll-active" : ""}>
            {
              toArray (
                map<Record<DropdownOption<A>>, JSX.Element>
                  (option => {
                    const classNameInner =
                      classListMaybe (List (
                        guardReplace (equals (normalizedValue) (DOA.id (option))) ("active"),
                        guardReplace (or (DOA.disabled (option))) ("disabled")
                      ))

                    return (
                      <div
                        className={classNameInner}
                        key={fromMaybe<string | number> ("__DEFAULT__") (DOA.id (option))}
                        onClick={
                          !normalizedDisabled
                          && !or (DOA.disabled (option))
                          ? this.onChange.bind (undefined, DOA.id (option))
                          : undefined
                        }
                        >
                        {DOA.name (option)}
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
        className={
          classListMaybe (List (
            Just (position),
            Just ("dropdown"),
            Maybe (className),
            guardReplace (isOpen) ("active"),
            guardReplace (orN (fullWidth)) ("fullWidth"),
            guardReplace (normalizedDisabled) ("disabled"),
            guardReplace (orN (required) && fnull (mselected)) ("invalid")
          ))
        }
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
            className={
              classListMaybe (List (
                Just ("value"),
                guardReplace (fnull (mselected)) ("hint")
              ))
            }
            >
            {valueText}
          </div>
          {position === "bottom" && isOpen ? downElement : placeholder}
        </div>
      </div>
    )
  }
}

export const stringOfListToDropdown =
  (index: number) => (name: string) => DropdownOption ({ id: Just (index + 1), name })
