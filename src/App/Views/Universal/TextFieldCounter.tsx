import * as React from "react";
import { isNumber } from "../../Utilities/typeCheckUtils";

interface TextFieldCounterProps {
  current: number | undefined
  max: number | undefined
}

export const TextFieldCounter: React.FC<TextFieldCounterProps> = ({ current, max }) =>
  isNumber (max)
    ? (
      <div>
        {current}
        {" / "}
        {max}
      </div>
    )
    : null
