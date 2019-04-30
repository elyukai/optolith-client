// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from "builder-util-runtime";
import * as React from "react";
import { Maybe, maybeR } from "../../../Data/Maybe";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { bytify } from "../../Utilities/IOUtils";
import { Dialog } from "../Universal/DialogNew";
import { ProgressBar } from "../Universal/ProgressBar";

export interface DownloaderOwnProps {
  l10n: L10nRecord
}

export interface DownloaderStateProps {
  progress: Maybe<ProgressInfo>
}

export interface DownloaderDispatchProps {
}

export type DownloaderProps = DownloaderStateProps & DownloaderDispatchProps & DownloaderOwnProps

export function Downloader (props: DownloaderProps) {
  const { l10n, progress: mprogress } = props

  const id = L10n.A.id (l10n)

  return maybeR (null)
                ((progress: ProgressInfo) => (
                  <Dialog
                    id="downloader"
                    title={translate (l10n) ("downloadupdate")}
                    isOpen={typeof progress === "object"}
                    close={() => undefined}
                    noCloseButton
                    >
                    {typeof progress === "object"
                      ? <div>
                        <div className="update-info">
                          <div className="update-size">
                            {bytify (id) (progress.transferred)} / {bytify (id) (progress.total)}
                          </div>
                          <div className="update-speed">
                            {bytify (id) (progress.bytesPerSecond)}/s
                          </div>
                        </div>
                        <ProgressBar
                          current={progress.percent}
                          max={100}
                          horizontal
                          fullWidth
                          />
                      </div>
                      : null}
                  </Dialog>
                ))
                (mprogress)
}
