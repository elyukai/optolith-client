import * as React from "react"
import { not } from "../../../Data/Bool"
import { equals } from "../../../Data/Eq"
import { cons, elemF, filter, find, flength, fnull, intercalate, List, map, notNull, toArray } from "../../../Data/List"
import { any, ensure, fromJust, fromMaybe, guardReplace, isJust, Just, Maybe, maybe, maybeToList, normalize, Nothing, or, orN } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { DropdownKey, DropdownOption } from "../../Models/View/DropdownOption"
import { classListMaybe } from "../../Utilities/CSS"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { DropdownItem } from "./DropdownItem"
import { Label } from "./Label"
import { Scroll } from "./Scroll"

const DOA = DropdownOption.A

interface Props<A extends DropdownKey> {
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

interface DropdownFC extends React.FunctionComponent<Props<DropdownKey>> {
  <A extends DropdownKey> (props: React.PropsWithChildren<Props<A>>): React.ReactElement | null
}

export const Dropdown: DropdownFC = <A extends DropdownKey> (props: Props<A>) => {
  const {
    className,
    disabled,
    fullWidth,
    hint,
    label,
    onChange,
    onChangeJust,
    onChangeList,
    options,
    required,
    value,
    values,
  } = props

  const [ isOpen, setOpen ] = React.useState (false)
  const [ position, setPosition ] = React.useState<"top" | "bottom"> ("bottom")
  const containerRef = React.useRef<HTMLDivElement | null> (null)

  const handleSwitch = React.useCallback (
    () => {
      if (!isOpen && containerRef.current !== null) {
        const height = flength (options) < 6 ? flength (options) * 33 + 1 : 166

        const containerRect = containerRef.current.getBoundingClientRect ()

        if ((window.innerHeight - 32 - containerRect.top) < height) {
          setPosition ("top")
        }
        else {
          setPosition ("bottom")
        }
      }

      setOpen (not)
    },
    [ isOpen, options ]
  )

  const handleChange = React.useCallback (
    (option: Maybe<A> = Nothing) => {
      if (typeof onChange === "function") {
        onChange (option)
      }

      if (typeof onChangeJust === "function" && isJust (option)) {
        onChangeJust (fromJust (option))
      }

      if (typeof onChangeList === "function" && values !== undefined && isJust (option)) {
        onChangeList (cons (values) (fromJust (option)))
      }

      setOpen (false)
    },
    [ onChange, onChangeJust, onChangeList, values ]
  )

  const handleOutsideClick = React.useCallback (
    (e: Event) => {
      if (isOpen
          && containerRef.current !== null
          && e.target !== null
          && !containerRef.current.contains (e.target as Node)) {
        setOpen (false)
      }
    },
    [ isOpen ]
  )

  React.useEffect (
    () => {
      window.addEventListener ("mousedown", handleOutsideClick, false)
      window.addEventListener ("ontouchstart", handleOutsideClick, false)

      return () => {
        window.removeEventListener ("mousedown", handleOutsideClick, false)
        window.removeEventListener ("ontouchstart", handleOutsideClick, false)
      }
    },
    [ handleOutsideClick ]
  )

  const isMultiple = values !== undefined
  const normalizedValue = normalize (value)
  const normalizedValues = values === undefined ? List<A> () : values
  const normalizedDisabled = or (normalize (disabled))

  const style = isOpen ? (flength (options) < 6 ? flength (options) * 33 + 1 : 166) : 0

  const mselected =
    isMultiple
      ? filter<Record<DropdownOption<A>>> (pipe (DOA.id, any (elemF (normalizedValues))))
                                          (options)
      : pipe_ (
          options,
          find<Record<DropdownOption<A>>> (pipe (DOA.id, equals (normalizedValue))),
          maybeToList
        )

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
                (option => (
                  <DropdownItem
                    key={fromMaybe<string | number> ("__DEFAULT__") (DOA.id (option))}
                    active={normalizedValue}
                    disabled={normalizedDisabled}
                    onChange={handleChange}
                    option={option}
                    />
                ))
                (options)
            )
          }
        </Scroll>
      </div>
    </div>
  )

  const placeholder = <div style={{ height: 0 }} />

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
      ref={containerRef}
      >
      {typeof label === "string" ? <Label text={label} disabled={normalizedDisabled} /> : null}
      <div>
        {position === "top" && isOpen ? downElement : placeholder}
        <div
          onClick={handleSwitch}
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

export const stringOfListToDropdown =
  (index: number) => (name: string) => DropdownOption ({ id: Just (index + 1), name })
