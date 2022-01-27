import * as path from "path"
import * as React from "react"
import { fmap, fmapF } from "../../../Data/Functor"
import { Cons, head, notNull } from "../../../Data/List"
import { ensure, fromJust, isJust, orN } from "../../../Data/Maybe"
import { imgPathToBase64 } from "../../Actions/IOActions"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { showOpenDialog } from "../../Utilities/IOUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { AvatarWrapper } from "./AvatarWrapper"
import { BorderButton } from "./BorderButton"
import { Dialog } from "./Dialog"

interface Props {
  staticData: StaticDataRecord
  title?: string
  isOpen: boolean
  setPath (path: string): void
  close: () => void
}

const valid_extensions = [ "jpeg", "png", "jpg" ]
const valid_extnames = valid_extensions .map (ext => `.${ext}`)

export const AvatarChange: React.FC<Props> = props => {
  const { setPath, isOpen, staticData, title, close } = props
  const [ fileValid, setFileValid ] = React.useState (false)
  const [ data, setData ] = React.useState ("")
  const [ prevIsOpen, setPrevIsOpen ] = React.useState (isOpen)

  const handleSelectFile = React.useCallback (
    async () =>
      fmapF (showOpenDialog ({
              filters: [
                {
                  name: translate (staticData) ("profile.dialogs.changeheroavatar.imagefiletype"),
                  extensions: valid_extensions,
                },
                { name: "JPG", extensions: [ "jpeg", "jpg" ] },
                { name: "PNG", extensions: [ "png" ] },
              ],
            }))
            (pipe (
              ensure (notNull),
              fmap ((xs: Cons<string>) => pipe_ (
                xs,
                head,
                (path_to_image) => {
                  const new_data = imgPathToBase64 (path_to_image)
                  const ext = path.extname (path_to_image) .toLowerCase ()

                  if (valid_extnames .includes (ext) && isJust (new_data)) {
                    setFileValid (true)
                    setData (fromJust (new_data))
                  }
                  else {
                    setFileValid (false)
                    setData ("")
                  }

                  return path_to_image
                }
              ))
            )),
    [ staticData ]
  )

  const handleSubmit = React.useCallback (
    () => setPath (data),
    [ setPath, data ]
  )

  const handleClose = React.useCallback (
    () => {
      setFileValid (false)
      setData ("")
      close ()
    },
    [ setFileValid, setData, close ]
  )

  if (!isOpen && orN (prevIsOpen)) {
    setFileValid (false)
    setData ("")
    setPrevIsOpen (false)
  }

  return (
    <Dialog
      id="avatar-change"
      title={
        title === undefined
        ? translate (staticData) ("profile.dialogs.changeheroavatar.title")
        : title
      }
      buttons={[
        {
          disabled: !fileValid || data === "",
          label: translate (staticData) ("general.dialogs.applybtn"),
          onClick: handleSubmit,
        },
      ]}
      close={handleClose}
      isOpen={isOpen}
      >
      <BorderButton
        label={translate (staticData) ("profile.dialogs.changeheroavatar.selectfilebtn")}
        onClick={handleSelectFile}
        />
      <AvatarWrapper
        src={ensure ((unsafeUrl: string) => fileValid && unsafeUrl !== "") (data)}
        />
      {!fileValid && data !== ""
        ? (
          <p>{translate (staticData) ("profile.dialogs.changeheroavatar.invalidfilewarning")}</p>
        )
        : null}
    </Dialog>
  )
}
