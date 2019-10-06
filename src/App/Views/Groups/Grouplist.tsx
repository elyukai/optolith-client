import * as React from "react";
import { ident } from "../../../Data/Function";
import { BorderButton } from "../Universal/BorderButton";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { TextField } from "../Universal/TextField";

export const Grouplist: React.FC = () => {
  return (
    <Page>
      <Options>
        <TextField
          hint="Suchen"
          value=""
          onChange={ident}
          fullWidth
          disabled
          />
        <BorderButton label="Erstellen" disabled />
      </Options>
      <Scroll className="list">
        <BorderButton label="Gruppe laden" />
      </Scroll>
    </Page>
  )
}
