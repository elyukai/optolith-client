import { connect } from 'react-redux';
import { AppState } from '../reducers/appReducer';
import { getUpdateDownloadProgress } from '../selectors/stateSelectors';
import { Downloader, DownloaderDispatchProps, DownloaderOwnProps, DownloaderStateProps } from '../views/downloader/Downloader';

const mapStateToProps = (state: AppState) => ({
  progress: getUpdateDownloadProgress (state)
});

export const connectDownloaderContainer =
  connect<DownloaderStateProps, DownloaderDispatchProps, DownloaderOwnProps, AppState> (
    mapStateToProps
  );

export const DownloaderContainer = connectDownloaderContainer (Downloader);
