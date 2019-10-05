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
import { Dialog, DialogProps } from "./Dialog";

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

export const AvatarChange: React.FC<AvatarChangeProps> = props => {
  const { setPath, isOpen, l10n, title } = props
  const [fileValid, setFileValid] = React.useState (false)
  const [url, setUrl] = React.useState ("")
  const [prevIsOpen, setPrevIsOpen] = React.useState (isOpen)

  const handleSelectFile = React.useCallback (
    () => {
      pipe_ (
        showOpenDialog ({
          filters: [{ name: translate (l10n) ("image"), extensions: valid_extensions }],
        }),
        fmap (pipe (
          ensure (notNull),
          fmap (pipe (
            head,
            path_to_image => {
              const new_url = pathToFileURL (path_to_image) .toString ()
              const ext = path .extname (path_to_image) .toLowerCase ()

              if (valid_extnames .includes (ext) && isURLValid (new_url)) {
                setFileValid (true)
                setUrl (new_url)
              }
              else {
                setFileValid (false)
                setUrl ("")
              }

              return path_to_image
            }
          ))
        )),
        runIO
      )
    },
    [l10n]
  )

  const handleSubmit = React.useCallback (
    () => setPath (url),
    [setPath, url]
  )

  if (!isOpen && orN (prevIsOpen)) {
    setFileValid (false)
    setUrl ("")
    setPrevIsOpen (false)
  }

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
      close={close}
      isOpen={isOpen}
      >
      <BorderButton
        label={translate (l10n) ("selectfile")}
        onClick={handleSelectFile}
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
