import { toKebabCase } from "@elyukai/utils/string"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import headerIcon from "../../../../../assets/images/icon.svg"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import "./SheetHeader.css"
import { SheetHeaderAttribute, type HeaderValue } from "./SheetHeaderAttribute.tsx"

interface Props {
  add?: HeaderValue[]
  title: string
}

export const SheetHeader: FC<Props> = observer(function SheetHeader(props) {
  const { add = [], title } = props

  const translate = useTranslate()
  const { attributes } = useCharacterState()

  const list = attributes.map((attr): HeaderValue => ({
    id: attr.id,
    label: attr.abbreviation,
    value: attr.value,
    color: toKebabCase(attr.color.kind),
  }))

  return (
    <div className="sheet-header">
      <div className="sheet-title">
        <h1>{translate("Character Sheet")}</h1>
        <p>{title}</p>
        <img src={headerIcon} alt="" />
      </div>
      <div className="sheet-header__values">
        <div className="sheet-header__values-row">
          {add.map(attr => (
            <SheetHeaderAttribute key={attr.id} {...attr} />
          ))}
        </div>
        <div className="sheet-header__values-row">
          {list.map(attr => (
            <SheetHeaderAttribute key={attr.id} {...attr} />
          ))}
        </div>
      </div>
    </div>
  )
})
