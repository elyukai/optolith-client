import * as React from "react";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { ndash } from "../../../Utilities/Chars";
import { translate } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface SkillsSheetQualityLevelsProps {
  l10n: L10nRecord
}

export const SkillsSheetQualityLevels = ({ l10n }: SkillsSheetQualityLevelsProps) => (
  <TextBox
    className="quality-levels"
    label={translate (l10n) ("qualitylevels")}
    >
    <table>
      <thead>
        <tr>
          <th>
            <div>
              {translate (l10n) ("skillpoints.splitted")}
            </div>
          </th>
          <th>
            <div>
              {translate (l10n) ("qualitylevel.splitted")}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{`0${ndash}3`}</td>
          <td>{"1"}</td>
        </tr>
        <tr>
          <td>{`4${ndash}6`}</td>
          <td>{"2"}</td>
        </tr>
        <tr>
          <td>{`7${ndash}9`}</td>
          <td>{"3"}</td>
        </tr>
        <tr>
          <td>{`10${ndash}12`}</td>
          <td>{"4"}</td>
        </tr>
        <tr>
          <td>{`13${ndash}15`}</td>
          <td>{"5"}</td>
        </tr>
        <tr>
          <td>{`16+`}</td>
          <td>{"6"}</td>
        </tr>
      </tbody>
    </table>
  </TextBox>
)
