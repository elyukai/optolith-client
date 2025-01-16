import { createRef, RefObject } from "react"
import * as React from "react"
import { List } from "../../../../Data/List"
import { Record } from "../../../../Data/Record"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import {
  RuleContainer,
  RuleDictionary,
} from "../../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../../Utilities/I18n"
import { Markdown } from "../../Universal/Markdown"
import { Sheet } from "../Sheet"
import { SheetWrapper } from "../SheetWrapper"

interface Props {
  attributes: List<Record<AttributeCombined>>
  staticData: StaticDataRecord
  useParchment: boolean
  rules: RuleContainer
}

export class RulesSheet extends React.Component<Props> {
  private readonly tableRef: RefObject<HTMLTableElement>

  private createdWrappers: HTMLDivElement[]

  constructor (props: Props) {
    super (props)
    this.tableRef = createRef<HTMLTableElement> ()
    this.createdWrappers = []
  }

  componentDidMount () {
    this.clearCreatedWrappers ()
    const table = this.tableRef.current
    if (!table) {
      return
    }

    const maxHeight = this.getMaxHeightForTableBody (table)

    const tablebody = table.querySelector ("tbody")
    if (!tablebody) {
      return
    }

    const height = tablebody.clientHeight
    if (height < maxHeight) {
      return
    }

    const rows = this.getRows (tablebody)

    this.recreateTableOnMultipleSheets (table, tablebody, rows, maxHeight)
  }

  componentWillUnmount () {
    this.clearCreatedWrappers ()
  }

  private recreateTableOnMultipleSheets (
    table: HTMLTableElement,
    tablebody: HTMLTableSectionElement,
    rows: { row: HTMLTableRowElement; height: number }[],
    maxHeight: number
  ) {
    const originalWrapper = table.closest (".sheet-wrapper")
    if (!originalWrapper) {
      return
    }
    const wrapperParent = originalWrapper.parentElement
    if (!wrapperParent) {
      return
    }

    const cloneWrapper = originalWrapper.cloneNode (true)

    let currentHeight = 0
    let currentTableBody = tablebody

    for (const row of rows) {
      const newHeight = currentHeight + row.height
      if (newHeight > maxHeight) {
        // @ts-ignore
        const newWrapper: HTMLDivElement = cloneWrapper.cloneNode (true)
        const newTableBody: HTMLTableSectionElement | null = newWrapper.querySelector ("table.rules tbody")

        if (!newTableBody) {
          throw new Error ("No tbody found.")
        }

        wrapperParent.append (newWrapper)
        this.createdWrappers.push (newWrapper)

        currentHeight = 0
        currentTableBody = newTableBody
      }

      currentHeight += row.height
      currentTableBody.append (row.row)
    }
  }

  private getRows (tablebody: HTMLTableSectionElement) {
    const rows: {
      row: HTMLTableRowElement
      height: number
    }[] = []

    for (let i = tablebody.rows.length; i >= 0; i--) {
      const row = tablebody.rows.item (i)
      if (!row) {
        continue
      }

      rows.push ({
        row,
        height: row.clientHeight,
      })
      row.remove ()
    }

    return rows.reverse ()
  }

  render () {
    const {
      attributes,
      staticData,
      useParchment,
      rules,
    } = this.props

    return (
      <SheetWrapper>
        <Sheet
          id="rule-sheet"
          title={translate (staticData) ("sheets.rulessheet.title")}
          attributes={attributes}
          staticData={staticData}
          useParchment={useParchment}
          >
          <table className="rules" ref={this.tableRef}>
            <thead>
            <tr>
              <th>{translate (staticData) ("sheets.rulessheet.header.name")}</th>
              <th>{translate (staticData) ("sheets.rulessheet.header.rule")}</th>
            </tr>
            </thead>
            <tbody>
            {this.displayRules ("advantages", translate (staticData) ("sheets.rulessheet.advantages"), rules.advantages)}
            {this.displayRules ("disadvantages", translate (staticData) ("sheets.rulessheet.disadvantages"), rules.disadvantages)}
            {this.displayRules ("specialAbilities", translate (staticData) ("sheets.rulessheet.specialabilities"), rules.specialAbilities)}
            </tbody>
          </table>

        </Sheet>
      </SheetWrapper>
    )
  }

  displayRules (
    ruleKey: string,
    displayName: string,
    dictionary: RuleDictionary
  ) {
    if (!Object.keys (dictionary).length) {
      return null
    }

    const rows = []
    for (const dictionaryKey in dictionary) {
      const name = dictionaryKey
      const rule = dictionary[dictionaryKey]

      rows.push (
        <tr key={`${ruleKey}_${dictionaryKey}`}>
          <td>{name}</td>
          <td>
            <Markdown
              source={rule}
              noWrapper
              />
          </td>
        </tr>
      )
    }

    return [
      (
        <tr className="category-display" key={`${ruleKey}_displayName`}>
          <td colSpan={2}>{displayName}</td>
        </tr>
      ),
      ...rows,
    ]
  }

  private getMaxHeightForTableBody (table: HTMLTableElement): number {
    // This is a number, chosen to account for margins, etc.
    const ADDITIONAL_OFFSET = 40

    const sheetWrapper = table.closest (".sheet")

    if (!sheetWrapper) {
      return table.clientHeight
    }

    const sheet = table.closest (".sheet")
    if (!sheet) {
      return table.clientHeight
    }
    const sheetPadding = parseFloat (window.getComputedStyle (sheet, null).getPropertyValue ("padding-left"))

    const sheetHeight = sheetWrapper.clientHeight - (sheetPadding * 2)
    const header = sheetWrapper.querySelector (".sheet-header")
    if (!header) {
      return table.clientHeight
    }
    const headerHeight = header.clientHeight

    if (!table.tHead) {
      return table.clientHeight
    }
    const tableHeaderHeight = table.tHead.clientHeight

    const result = sheetHeight - headerHeight - tableHeaderHeight - ADDITIONAL_OFFSET

    console.log (sheetHeight, headerHeight, tableHeaderHeight, result)

    return result
  }

  private clearCreatedWrappers () {
    this.createdWrappers.forEach (elem => {
      elem.remove ()
    })

    this.createdWrappers = []
  }
}
