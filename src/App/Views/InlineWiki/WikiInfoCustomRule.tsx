import React, { useState } from "react"
import { isNothing, Maybe } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { Dialog } from "../Universal/Dialog"
import { Markdown } from "../Universal/Markdown"
import { TextArea } from "../Universal/TextArea"
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
  const [ rule, setRule ] = useState<string> (savedRule)

  if (isNothing (selector)) {
    return (
      <p>
        <strong>{`${translate (staticData) ("inlinewiki.rule")}: `}</strong>
        <i>{translate (staticData) ("inlinewiki.custom.inactive")}</i>
      </p>
    )
  }

  const ruleDisplay = () => {
    if (savedRule === "") {
      return `*${translate (staticData) ("inlinewiki.custom.norule")}*`
    }

    return savedRule
  }

  const startEditing = () => {
    if (isEditing) {
      return
    }

    setRule (savedRule)
    setIsEditing (true)
  }

  const saveEdit = () => {
    if (!isEditing) {
      return
    }

    saveRule (selector.value, rule)
  }
  const closeDialog = () => {
    if (!isEditing) {
      return
    }

    if (!rule) {
      setRule (savedRule)
    }

    setIsEditing (false)
  }

  return (
    <div>
      <div>
        <i
          className="icon"
          style={{ float: "right", cursor: "pointer", marginTop: ".6rem", userSelect: "none" }}
          onClick={startEditing}
          >
          {"\uE90c"}
        </i>

        <p>
          <Markdown
            source={`**${translate (staticData) ("inlinewiki.rule")}:** ${ruleDisplay ()}`}
            noWrapper
          />
        </p>
      </div>

      <Dialog
        id="edit-custom-rule"
        close={closeDialog}
        isOpen={isEditing}
        title={translate (staticData) ("inlinewiki.custom.dialog.title")}
        buttons={[
          {
            autoWidth: true,
            label: translate (staticData) ("inlinewiki.custom.dialog.saveBtn"),
            disabled: false,
            onClick: saveEdit,
          },
        ]}
        >
        <small>{translate (staticData) ("inlinewiki.custom.dialog.markdownInfo")}</small>
        <TextArea
          value={rule}
          onChange={setRule}
          fullWidth
          autoFocus
          resize="vertical"
          />
      </Dialog>
    </div>
  )
}
