import * as React from "react";
import { InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { BorderButton } from "../Universal/BorderButton";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { TextField } from "../Universal/TextField";

export class Grouplist extends React.Component {
  filter = (event: InputTextEvent) => event.target.value

  render () {
    return (
      <Page>
        <Options>
          <TextField hint="Suchen" value={""} onChange={this.filter} fullWidth disabled />
          <BorderButton label="Erstellen" disabled />
        </Options>
        <Scroll className="list">
          <BorderButton label="Gruppe laden" />
        </Scroll>
      </Page>
    )
  }
}
