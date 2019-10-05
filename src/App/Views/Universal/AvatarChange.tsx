import * as path from "path";
import * as React from "react";
import { fmap, fmapF } from "../../../Data/Functor";
import { head, notNull } from "../../../Data/List";
import { ensure, fromJust, isJust, Just, orN } from "../../../Data/Maybe";
import { imgPathToBase64 } from "../../Actions/IOActions";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { showOpenDialog } from "../../Utilities/IOUtils";
import { pipe } from "../../Utilities/pipe";
import { AvatarWrapper } from "./AvatarWrapper";
import { BorderButton } from "./BorderButton";
import { Dialog } from "./Dialog";

export interface AvatarChangeProps {
  l10n: L10nRecord
  title?: string
  isOpen: boolean
  setPath (path: string): void
  close: () => void
}

export interface AvatarChangeState {
  url: string
  fileValid: boolean
}

const valid_extensions = ["jpeg", "png", "jpg"]
const valid_extnames = valid_extensions .map (ext => `.${ext}`)

export const AvatarChange: React.FC<AvatarChangeProps> = props => {
  const { setPath, isOpen, l10n, title, close } = props
  const [fileValid, setFileValid] = React.useState (false)
  const [url, setUrl] = React.useState ("")
  const [prevIsOpen, setPrevIsOpen] = React.useState (isOpen)

  const handleSelectFile = React.useCallback (
    async () =>
      fmapF (showOpenDialog ({
              filters: [
                { name: translate (l10n) ("image"), extensions: valid_extensions },
                { name: "JPG", extensions: ["jpeg", "jpg"] },
                { name: "PNG", extensions: ["png"] },
              ],
            }))
            (pipe (
              ensure (notNull),
              fmap (pipe (
                head,
                path_to_image => {
                  const new_url = imgPathToBase64 (Just (path_to_image))
                  const ext = path.extname (path_to_image) .toLowerCase ()

                  if (valid_extnames .includes (ext) && isJust (new_url)) {
                    setFileValid (true)
                    setUrl (fromJust (new_url))
                  }
                  else {
                    setFileValid (false)
                    setUrl ("")
                  }

                  return path_to_image
                }
              ))
            )),
    [l10n]
  )

  const handleSubmit = React.useCallback (
    () => setPath (url),
    [setPath, url]
  )

  const handleClose = React.useCallback (
    () => {
      setFileValid (false)
      setUrl ("")
      close ()
    },
    [setFileValid, setUrl, close]
  )

  if (!isOpen && orN (prevIsOpen)) {
    setFileValid (false)
    setUrl ("")
    setPrevIsOpen (false)
  }

  console.log (fileValid, url)

  return (
    <Dialog
      id="avatar-change"
      title={title === undefined ? translate (l10n) ("changeheroavatar") : title}
      buttons={[
        {
          disabled: !fileValid || url === "",
          label: translate (l10n) ("apply"),
          onClick: handleSubmit,
        },
      ]}
      close={handleClose}
      isOpen={isOpen}
      >
      <BorderButton
        label={translate (l10n) ("selectfile")}
        onClick={handleSelectFile}
        />
      <AvatarWrapper
        src={ensure ((unsafeUrl: string) => fileValid && unsafeUrl !== "") (url)}
        />
      {!fileValid && url !== ""
        ? (
          <p>{translate (l10n) ("changeheroavatar.invalidfile")}</p>
        )
        : null}
    </Dialog>
  )
}
