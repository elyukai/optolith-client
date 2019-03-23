import { connect } from 'react-redux';
import { Downloader, DownloaderDispatchProps, DownloaderOwnProps, DownloaderStateProps } from '../../Views/downloader/Downloader';
import { AppState } from '../Reducers/appReducer';
import { getUpdateDownloadProgress } from '../Selectors/stateSelectors';

const mapStateToProps = (state: AppState) => ({
  progress: getUpdateDownloadProgress (state)
});

const connectDownloader =
  connect<DownloaderStateProps, DownloaderDispatchProps, DownloaderOwnProps, AppState> (
    mapStateToProps
  );

export const DownloaderContainer = connectDownloader (Downloader);
