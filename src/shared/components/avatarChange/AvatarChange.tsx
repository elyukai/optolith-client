// import { useCallback, useState } from "react"
// import { useTranslate } from "../../../main_window/hooks/translate.ts"
// import { AvatarWrapper } from "../avatarWrapper/AvatarWrapper.tsx"
// import { Button } from "../button/Button.tsx"
// import { Dialog } from "../dialog/Dialog.tsx"
import "./AvatarChange.scss"

// type Props = {
//   title?: string
//   isOpen: boolean
//   setPath: (path: string) => void
//   close: () => void
// }

// const validExtensions = [ "jpeg", "png", "jpg" ]
// const validExtnames = validExtensions.map(ext => `.${ext}`)

// export const AvatarChange: React.FC<Props> = props => {
//   const { setPath, isOpen, title, close } = props
//   const [ fileValid, setFileValid ] = useState(false)
//   const [ data, setData ] = useState("")
//   const [ prevIsOpen, setPrevIsOpen ] = useState(isOpen)

//   const translate = useTranslate()

//   const handleSelectFile = useCallback(
//     async () =>
//       fmapF(showOpenDialog({
//               filters: [
//                 {
//                   name: translate("profile.dialogs.changeheroavatar.imagefiletype"),
//                   extensions: validExtensions,
//                 },
//                 { name: "JPG", extensions: [ "jpeg", "jpg" ] },
//                 { name: "PNG", extensions: [ "png" ] },
//               ],
//             }))
//             (pipe(
//               ensure(notNull),
//               fmap((xs: Cons<string>) => pipe_(
//                 xs,
//                 head,
//                 path_to_image => {
//                   const new_data = imgPathToBase64(path_to_image)
//                   const ext = path.extname(path_to_image) .toLowerCase()

//                   if (validExtnames .includes(ext) && isJust(new_data)) {
//                     setFileValid(true)
//                     setData(fromJust(new_data))
//                   }
//                   else {
//                     setFileValid(false)
//                     setData("")
//                   }

//                   return path_to_image
//                 }
//               ))
//             )),
//     [ staticData ]
//   )

//   const handleSubmit = useCallback(
//     () => setPath(data),
//     [ setPath, data ]
//   )

//   const handleClose = useCallback(
//     () => {
//       setFileValid(false)
//       setData("")
//       close()
//     },
//     [ setFileValid, setData, close ]
//   )

//   if (!isOpen && orN(prevIsOpen)) {
//     setFileValid(false)
//     setData("")
//     setPrevIsOpen(false)
//   }

//   return (
//     <Dialog
//       id="avatar-change"
//       title={
//         title === undefined
//         ? translate("profile.dialogs.changeheroavatar.title")
//         : title
//       }
//       buttons={[
//         {
//           disabled: !fileValid || data === "",
//           label: translate("general.dialogs.applybtn"),
//           onClick: handleSubmit,
//         },
//       ]}
//       close={handleClose}
//       isOpen={isOpen}
//       >
//       <Button onClick={handleSelectFile}>
//         {translate("profile.dialogs.changeheroavatar.selectfilebtn")}
//       </Button>
//       <AvatarWrapper
//         src={ensure((unsafeUrl: string) => fileValid && unsafeUrl !== "")(data)}
//         />
//       {!fileValid && data !== ""
//         ? (
//           <p>{translate("profile.dialogs.changeheroavatar.invalidfilewarning")}</p>
//         )
//         : null}
//     </Dialog>
//   )
// }
