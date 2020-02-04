import * as React from "react";
import { Scroll } from "./Scroll";

interface Props {
  stack: string
  componentStack: string
}

export const ErrorMessage: React.FC<Props> = ({ componentStack, stack }) => (
  <Scroll className="error-message">
    <h4>{"Error"}</h4>
    <p>{stack}</p>
    <h4>{"Component Stack"}</h4>
    <p>{componentStack}</p>
  </Scroll>
)
