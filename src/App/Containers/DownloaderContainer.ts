import { connect } from "react-redux"
import { AppStateRecord } from "../Models/AppState"
import { getUpdateDownloadProgress } from "../Selectors/stateSelectors"
import { Downloader, DownloaderDispatchProps, DownloaderOwnProps, DownloaderStateProps } from "../Views/Downloader/Downloader"

const mapStateToProps = (state: AppStateRecord): DownloaderStateProps => ({
  progress: getUpdateDownloadProgress (state),
})

const connectDownloader =
  connect<DownloaderStateProps, DownloaderDispatchProps, DownloaderOwnProps, AppStateRecord> (
    mapStateToProps
  )

export const DownloaderContainer = connectDownloader (Downloader)
