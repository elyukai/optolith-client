import { useCallback, useEffect, useRef, useState } from "react"
import { arrayFromNonNullable } from "../../utils/array.ts"
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import { Label } from "../label/Label.tsx"
import { Scroll } from "../scroll/Scroll.tsx"
import "./Dropdown.scss"
import { DropdownItem, DropdownOption } from "./DropdownItem.tsx"

type Props<A> = {
  className?: string
  disabled?: boolean
  fullWidth?: boolean
  hint?: string
  label?: string
  options: DropdownOption<A>[]
  required?: boolean
  value?: A
  values?: A[]
  onChange?(option: A): void
  onChangeList?(selected: A[]): void
  equals?(a: A, b: A): boolean
  getKey(option: DropdownOption<A>): string | number | undefined
}

/**
 * Create a dropdown option from a string and its index in a list.
 */
export const optionFromIndexed = (name: string, index: number): DropdownOption<number> => ({
  id: index + 1,
  name,
})

/**
 * A dropdown with a list of options.
 */
export function Dropdown<A>(props: Props<A>): ReturnType<FCC<Props<A>>> {
  const {
    className,
    disabled,
    fullWidth,
    hint,
    label,
    onChange,
    onChangeList,
    options,
    required,
    value,
    values,
    equals,
    getKey,
  } = props

  const [isOpen, setOpen] = useState(false)
  const [position, setPosition] = useState<"top" | "bottom">("bottom")
  const containerRef = useRef<HTMLDivElement | null>(null)

  const overlayHeight = Math.min(options.length, 5) * 33 + 7

  const handleSwitch = useCallback(() => {
    if (containerRef.current !== null) {
      const containerRect = containerRef.current.getBoundingClientRect()

      if (window.innerHeight - 32 - containerRect.top < overlayHeight) {
        setPosition("top")
      } else {
        setPosition("bottom")
      }
    }

    setOpen(hasBeenOpen => !hasBeenOpen)
  }, [overlayHeight])

  const handleChange = useCallback(
    (option: A) => {
      if (typeof onChange === "function") {
        onChange(option)
      }

      if (typeof onChangeList === "function" && values !== undefined && option !== undefined) {
        onChangeList([...values, option])
      }

      setOpen(false)
    },
    [onChange, onChangeList, values],
  )

  const handleOutsideClick = useCallback(
    (e: Event) => {
      if (
        isOpen &&
        containerRef.current !== null &&
        e.target !== null &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    },
    [isOpen],
  )

  useEffect(() => {
    window.addEventListener("mousedown", handleOutsideClick, false)
    window.addEventListener("ontouchstart", handleOutsideClick, false)

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick, false)
      window.removeEventListener("ontouchstart", handleOutsideClick, false)
    }
  }, [handleOutsideClick])

  const isMultiple = values !== undefined
  const normalizedDisabled = disabled === true

  const style = isOpen ? overlayHeight : 0

  const selected = isMultiple
    ? options.filter(option => values.includes(option.id))
    : arrayFromNonNullable(options.find(option => option.id === value))

  const valueText =
    selected.length === 0 ? hint ?? null : selected.map(option => option.name).join(", ")

  const downElement = (
    <div style={{ height: style }} className="down">
      <div style={{ height: style - 2 }}>
        <Scroll noInnerElement className={options.length > 5 ? "scroll-active" : ""}>
          <ul className="dropdown-options">
            {options.map(option => (
              <DropdownItem
                key={getKey(option) ?? "__DEFAULT__"}
                active={value}
                disabled={normalizedDisabled}
                onChange={handleChange}
                option={option}
                equals={equals}
              />
            ))}
          </ul>
        </Scroll>
      </div>
    </div>
  )

  const placeholder = <div style={{ height: 0 }} />

  return (
    <div
      className={classList(position, "dropdown", className, {
        active: isOpen,
        disabled: normalizedDisabled,
        fullWidth: fullWidth === true,
        invalid: required === true && selected.length === 0,
      })}
      ref={containerRef}
    >
      {typeof label === "string" ? <Label text={label} disabled={normalizedDisabled} /> : null}
      <div>
        {position === "top" && isOpen ? downElement : placeholder}
        <div className={classList("value", { hint: selected.length === 0 })} onClick={handleSwitch}>
          {valueText}
        </div>
        {position === "bottom" && isOpen ? downElement : placeholder}
      </div>
    </div>
  )
}
