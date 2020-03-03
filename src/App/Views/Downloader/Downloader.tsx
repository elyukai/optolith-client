// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from "builder-util-runtime"
import * as React from "react"
import { Maybe, maybe } from "../../../Data/Maybe"
import { L10n } from "../../Models/Wiki/L10n"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { bytify } from "../../Utilities/IOUtils"
import { Dialog } from "../Universal/Dialog"
import { ProgressBar } from "../Universal/ProgressBar"

export interface DownloaderOwnProps {
  staticData: StaticDataRecord
}

export interface DownloaderStateProps {
  progress: Maybe<ProgressInfo>
}

export interface DownloaderDispatchProps {
}

export type DownloaderProps = DownloaderStateProps & DownloaderDispatchProps & DownloaderOwnProps

const emptyFn = (): void => undefined

export const Downloader: React.FC<DownloaderProps> = props => {
  const { staticData, progress: mprogress } = props

  const id = L10n.A.id (StaticData.A.ui (staticData))

  return maybe (<></>)
               ((progress: ProgressInfo) => (
                 <Dialog
                   id="downloader"
                   title={translate (staticData) ("settings.downloadingupdate.title")}
                   isOpen={typeof progress === "object"}
                   close={emptyFn}
                   noCloseButton
                   >
                   {typeof progress === "object"
                     ? (
                       <div>
                         <div className="update-info">
                           <div className="update-size">
                             {bytify (id) (progress.transferred)}
                             {" / "}
                             {bytify (id) (progress.total)}
                           </div>
                           <div className="update-speed">
                             {bytify (id) (progress.bytesPerSecond)}
                             {"/s"}
                           </div>
                         </div>
                         <ProgressBar
                           current={progress.percent}
                           max={100}
                           horizontal
                           fullWidth
                           />
                       </div>
                     )
                     : null}
                 </Dialog>
               ))
               (mprogress)
}
