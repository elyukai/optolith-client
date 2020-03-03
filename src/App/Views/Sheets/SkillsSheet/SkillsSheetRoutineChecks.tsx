import * as React from "react"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { minus } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { sign, signNeg } from "../../../Utilities/NumberUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  staticData: StaticDataRecord
}

export const SkillsSheetRoutineChecks: React.FC<Props> = ({ staticData }) => (
  <TextBox
    className="routine-checks"
    label={translate (staticData) ("sheets.gamestatssheet.routinechecks.title")}
    >
    <p>{translate (staticData) ("sheets.gamestatssheet.routinechecks.textRow1")}</p>
    <p>{translate (staticData) ("sheets.gamestatssheet.routinechecks.textRow2")}</p>
    <p>{translate (staticData) ("sheets.gamestatssheet.routinechecks.textRow3")}</p>
    <p>{translate (staticData) ("sheets.gamestatssheet.routinechecks.textRow4")}</p>
    <table>
      <thead>
        <tr>
          <th>{translate (staticData) ("sheets.gamestatssheet.routinechecks.labels.checkmod")}</th>
          <th>{translate (staticData) ("sheets.gamestatssheet.routinechecks.labels.neededsr")}</th>
          <th>{translate (staticData) ("sheets.gamestatssheet.routinechecks.labels.checkmod")}</th>
          <th>{translate (staticData) ("sheets.gamestatssheet.routinechecks.labels.neededsr")}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{translate (staticData) ("sheets.gamestatssheet.routinechecks.from3on")}</td>
          <td>{1}</td>
          <td>{signNeg (-1)}</td>
          <td>{13}</td>
        </tr>
        <tr>
          <td>{sign (2)}</td>
          <td>{4}</td>
          <td>{sign (-2)}</td>
          <td>{16}</td>
        </tr>
        <tr>
          <td>{sign (1)}</td>
          <td>{7}</td>
          <td>{sign (-3)}</td>
          <td>{19}</td>
        </tr>
        <tr>
          <td>{`+/${minus}0`}</td>
          <td>{10}</td>
          <td />
          <td />
        </tr>
      </tbody>
    </table>
  </TextBox>
)
