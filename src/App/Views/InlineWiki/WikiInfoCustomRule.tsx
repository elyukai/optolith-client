import React, { useRef, useState } from "react"
import { isNothing, Maybe } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { WikiInfoSelector } from "./WikiInfo"

export interface WikiInfoCustomRuleStateProps {
  savedRule: string
}

export interface WikiInfoCustomRuleOwnProps {
  staticData: StaticDataRecord
  selector: Maybe<WikiInfoSelector>
}

export interface WikiInfoCustomRuleDispatchProps {
  saveRule (selector: WikiInfoSelector, rule: string): void
}

export type WikiInfoCustomRuleProps = WikiInfoCustomRuleStateProps & WikiInfoCustomRuleDispatchProps & WikiInfoCustomRuleOwnProps

export const WikiInfoCustomRule: React.FC<WikiInfoCustomRuleProps> = props => {
  const { staticData, selector, saveRule, savedRule } = props

  const [ isEditing, setIsEditing ] = useState<boolean> (false)

  const textareaRef = useRef<HTMLTextAreaElement> (null)

  if (isNothing (selector)) {
    return (
      <p>
        <strong>{`${translate (staticData) ("inlinewiki.rule")}: `}</strong>
        <i>{"This is a placeholder for the custom rule. Add the item to your list to add a rule."}</i>
      </p>
    )
  }

  const selectorVal = selector.value

  const ruleDisplay = () => {
    if (isEditing) {
      return (<></>)
    }

    if (savedRule === "") {
      return (
        <i>{"No rule specified."}</i>
      )
    }

    return (<>{savedRule}</>)
  }

  const handleSaveEditButton = () => {
    if (!textareaRef.current) {
      return
    }

    if (!isEditing) {
      textareaRef.current.value = savedRule
    }

    if (isEditing) {
      const savingRule = textareaRef.current.value

      saveRule (selectorVal, savingRule)
    }

    setIsEditing (!isEditing)
  }

  return (
    <div>
      <div>
        <i
          className="icon"
          style={{ float: "right", cursor: "pointer", marginTop: ".6rem" }}
          onClick={handleSaveEditButton}
        >
          {isEditing ? "\uE90a" : "\uE90c"}
        </i>

        <p>
          <strong>{`${translate (staticData) ("inlinewiki.rule")}: `}</strong>
          {ruleDisplay ()}
        </p>
      </div>

      <textarea
        ref={textareaRef}
        className={`${(isEditing ? "" : "hide")} d-block textfield`}
        style={{ width: "100%" }}
      />
    </div>
  )
}
