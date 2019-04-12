import { remote } from "electron";
import * as React from "react";
import { ensure } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { AvatarWrapper } from "./AvatarWrapper";
import { BorderButton } from "./BorderButton";
import { Dialog, DialogProps } from "./DialogNew";

export interface AvatarChangeProps extends DialogProps {
  l10n: L10nRecord
  title?: string
  setPath (path: string): void
}

export interface AvatarChangeState {
  url: string
  fileValid: boolean
}

export class AvatarChange extends React.Component<AvatarChangeProps, AvatarChangeState> {
  state = {
    fileValid: false,
    url: "",
  }

  selectFile = () => {
    const extensions = ["jpeg", "png", "jpg"]
    remote.dialog.showOpenDialog (
      remote.getCurrentWindow (),
      {
        filters: [{ name: translate (this.props.l10n) ("image"), extensions }],
      },
      fileNames => {
        if (fileNames !== null && fileNames.length > 0) {
          const fileName = fileNames[0]
          const splitted = fileName.split (".")
          if (extensions.includes (splitted[splitted.length - 1])) {
            this.setState ({ fileValid: true, url: `file://${fileName.replace (/\\/g, "/")}` })
          }
          else {
            this.setState ({ fileValid: false, url: "" })
          }
        }
      }
    )
  }

  load = () => {
    const { setPath } = this.props
    const { url } = this.state
    setPath (url)
  }

  componentWillReceiveProps (nextProps: AvatarChangeProps) {
    if (nextProps.isOpened === false && this.props.isOpened === true) {
      this.setState ({
        fileValid: false,
        url: "",
      })
    }
  }

  render () {
    const { l10n, title } = this.props
    const { fileValid, url } = this.state

    return (
      <Dialog
        {...this.props}
        id="avatar-change"
        title={title !== undefined ? title : translate (l10n) ("changeheroavatar")}
        buttons={[
          {
            disabled: !fileValid || url === "",
            label: translate (l10n) ("apply"),
            onClick: this.load,
          },
        ]}
        >
        <BorderButton
          label={translate (l10n) ("selectfile")}
          onClick={this.selectFile}
          />
        <AvatarWrapper
          src={ensure ((unsafeUrl: string) => fileValid && unsafeUrl !== "") (url)}
          />
        {!fileValid && url !== "" ? (
          <p>{translate (l10n) ("changeheroavatar.invalidfile")}</p>
        ) : null}
      </Dialog>
    )
  }
}
