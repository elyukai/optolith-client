import * as React from "react"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { minus } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { sign, signNeg } from "../../../Utilities/NumberUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  l10n: L10nRecord
}

export const SkillsSheetRoutineChecks: React.FC<Props> = ({ l10n }) => (
  <TextBox
    className="routine-checks"
    label={translate (l10n) ("sheets.gamestatssheet.routinechecks.title")}
    >
    <p>{translate (l10n) ("sheets.gamestatssheet.routinechecks.textRow1")}</p>
    <p>{translate (l10n) ("sheets.gamestatssheet.routinechecks.textRow2")}</p>
    <p>{translate (l10n) ("sheets.gamestatssheet.routinechecks.textRow3")}</p>
    <p>{translate (l10n) ("sheets.gamestatssheet.routinechecks.textRow4")}</p>
    <table>
      <thead>
        <tr>
          <th>
            <div>
              {translate (l10n) ("sheets.gamestatssheet.routinechecks.labels.checkmod")}
            </div>
          </th>
          <th>
            <div>
              {translate (l10n) ("sheets.gamestatssheet.routinechecks.labels.neededsr")}
            </div>
          </th>
          <th>
            <div>
              {translate (l10n) ("sheets.gamestatssheet.routinechecks.labels.checkmod")}
            </div>
          </th>
          <th>
            <div>
              {translate (l10n) ("sheets.gamestatssheet.routinechecks.labels.neededsr")}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{translate (l10n) ("sheets.gamestatssheet.routinechecks.from3on")}</td>
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
