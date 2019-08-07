import * as path from "path";
import * as React from "react";
import { pathToFileURL } from "url";
import { fmap } from "../../../Data/Functor";
import { head, notNull } from "../../../Data/List";
import { ensure, orN } from "../../../Data/Maybe";
import { runIO } from "../../../System/IO";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { showOpenDialog } from "../../Utilities/IOUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { isURLValid } from "../../Utilities/RegexUtils";
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

const valid_extensions = ["jpeg", "png", "jpg"]
const valid_extnames = valid_extensions .map (ext => `.${ext}`)

export class AvatarChange extends React.Component<AvatarChangeProps, AvatarChangeState> {
  state = {
    fileValid: false,
    url: "",
  }

  selectFile = () => {
    pipe_ (
      showOpenDialog ({
        filters: [{ name: translate (this.props.l10n) ("image"), extensions: valid_extensions }],
      }),
      fmap (pipe (
        ensure (notNull),
        fmap (pipe (
          head,
          path_to_image => {
            const url = pathToFileURL (path_to_image) .toString ()
            const ext = path .extname (path_to_image) .toLowerCase ()

            if (valid_extnames .includes (ext) && isURLValid (url)) {
              this.setState ({ fileValid: true, url })
            }
            else {
              this.setState ({ fileValid: false, url: "" })
            }

            return path_to_image
          }
        ))
      )),
      runIO
    )
  }

  load = () => {
    const { setPath } = this.props
    const { url } = this.state
    setPath (url)
  }

  componentWillReceiveProps (nextProps: AvatarChangeProps) {
    if (nextProps.isOpen === false && orN (this.props.isOpen)) {
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
