import * as React from "react";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { minus } from "../../../Utilities/Chars";
import { translate } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface SkillsSheetRoutineChecksProps {
  l10n: L10nRecord
}

export const SkillsSheetRoutineChecks = ({ l10n }: SkillsSheetRoutineChecksProps) => (
  <TextBox
    className="routine-checks"
    label={translate (l10n) ("routinechecks")}
    >
    <p>{translate (l10n) ("routinechecks.text1")}</p>
    <p>{translate (l10n) ("routinechecks.text2")}</p>
    <p>{translate (l10n) ("routinechecks.text3")}</p>
    <p>{translate (l10n) ("routinechecks.text4")}</p>
    <table>
      <thead>
        <tr>
          <th>
            <div>
              {translate (l10n) ("checkmod")}
            </div>
          </th>
          <th>
            <div>
              {translate (l10n) ("neededsr")}
            </div>
          </th>
          <th>
            <div>
              {translate (l10n) ("checkmod")}
            </div>
          </th>
          <th>
            <div>
              {translate (l10n) ("neededsr")}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{translate (l10n) ("from")} +3</td>
          <td>1</td>
          <td>{minus}1</td>
          <td>13</td>
        </tr>
        <tr>
          <td>+2</td>
          <td>4</td>
          <td>{minus}2</td>
          <td>16</td>
        </tr>
        <tr>
          <td>+1</td>
          <td>7</td>
          <td>{minus}3</td>
          <td>19</td>
        </tr>
        <tr>
          <td>+/{minus}0</td>
          <td>10</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </TextBox>
)
