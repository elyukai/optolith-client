import * as React from "react";
import { fmapF } from "../../../Data/Functor";
import { InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { toInt } from "../../Utilities/NumberUtils";
import { isInteger, isNaturalNumber } from "../../Utilities/RegexUtils";
import { Dialog } from "../Universal/DialogNew";
import { TextField } from "../Universal/TextField";

interface OverviewAddAPProps {
  l10n: L10nRecord
  isOpened: boolean
  isRemovingEnabled: boolean
  addAdventurePoints (ap: number): void
  close (): void
}

interface OverviewAddAPState {
  value: string
}

export class OverviewAddAP extends React.Component<OverviewAddAPProps, OverviewAddAPState> {
  state = {
    value: "",
  }

  onChange = (event: InputTextEvent) => this.setState ({ value: event.target.value })
  addAP = () => fmapF (toInt (this.state.value)) (this.props.addAdventurePoints)

  componentWillReceiveProps (nextProps: OverviewAddAPProps) {
    if (!nextProps.isOpened && this.props.isOpened) {
      this.setState ({
        value: "",
      })
    }
  }

  render () {
    const { isRemovingEnabled, l10n } = this.props
    const { value } = this.state

    return (
      <Dialog
        {...this.props}
        id="overview-add-ap"
        title={translate (l10n) ("addadventurepoints")}
        buttons={[
          {
            disabled: isRemovingEnabled
              ? !isInteger (value)
              : (!isNaturalNumber (value) || value === "0"),
            label: translate (l10n) ("add"),
            onClick: this.addAP,
          },
          {
            label: translate (l10n) ("cancel"),
          },
        ]}
        >
        <TextField
          hint={translate (l10n) ("adventurepoints")}
          value={value}
          onChange={this.onChange}
          fullWidth
          valid={isRemovingEnabled ? isInteger (value) : isNaturalNumber (value) && value !== "0"}
          />
      </Dialog>
    )
  }
}
