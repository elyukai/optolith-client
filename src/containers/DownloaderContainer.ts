import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getUpdateDownloadProgress } from '../selectors/stateSelectors';
import { Downloader, DownloaderDispatchProps, DownloaderOwnProps, DownloaderStateProps } from '../views/downloader/Downloader';

function mapStateToProps(state: AppState) {
	return {
		progress: getUpdateDownloadProgress(state)
	};
}

export const DownloaderContainer = connect<DownloaderStateProps, DownloaderDispatchProps, DownloaderOwnProps>(mapStateToProps)(Downloader);
