import * as React from "react";
import { fromJust, isJust } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { toInt } from "../../Utilities/NumberUtils";
import { isNaturalNumber } from "../../Utilities/RegexUtils";
import { Dialog, DialogProps } from "../Universal/DialogNew";
import { TextField } from "../Universal/TextField";

export interface AttributesRemovePermanentProps extends DialogProps {
  l10n: L10nRecord
  remove (value: number): void
}

export interface AttributesRemovePermanentState {
  value: string
}

export class AttributesRemovePermanent
  extends React.Component<AttributesRemovePermanentProps, AttributesRemovePermanentState> {
  state = {
    value: "",
  }

  handleChange = (value: string) => this.setState ({ value })

  remove = () => {
    const mvalue = toInt (this.state.value)

    if (isJust (mvalue)) {
      this.props.remove (fromJust (mvalue))
    }
  }

  render () {
    const { l10n, ...other } = this.props
    const { value } = this.state

    return (
      <Dialog
        {...other}
        id="overview-add-ap"
        title={translate (l10n) ("removeenergypointslostpermanently")}
        buttons={[
          {
            disabled: !isNaturalNumber (this.state.value),
            label: translate (l10n) ("remove"),
            onClick: this.remove,
          },
          {
            label: translate (l10n) ("cancel"),
          },
        ]}>
        <TextField
          hint={translate (l10n) ("removeenergypointslostpermanentlyinputhint")}
          value={value}
          onChange={this.handleChange}
          fullWidth
          autoFocus
          />
      </Dialog>
    )
  }
}
