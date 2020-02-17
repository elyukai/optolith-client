import * as React from "react"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { ndash } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  staticData: StaticDataRecord
}

export const SkillsSheetQualityLevels: React.FC<Props> = ({ staticData }) => (
  <TextBox
    className="quality-levels"
    label={translate (staticData) ("sheets.gamestatssheet.qualitylevels.title")}
    >
    <table>
      <thead>
        <tr>
          <th>
            <div>
              {translate (staticData) ("sheets.gamestatssheet.qualitylevels.labels.skillpoints")}
            </div>
          </th>
          <th>
            <div>
              {translate (staticData) ("sheets.gamestatssheet.qualitylevels.labels.qualitylevel")}
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
