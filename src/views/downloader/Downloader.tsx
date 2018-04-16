import { ProgressInfo } from 'builder-util-runtime';
import * as React from 'react';
import { Dialog } from '../../components/DialogNew';
import { ProgressBar } from '../../components/ProgressBar';
import { _translate, UIMessages } from '../../utils/I18n';
import { bytify } from '../../utils/IOUtils';

export interface DownloaderOwnProps {
	locale: UIMessages;
}

export interface DownloaderStateProps {
	progress: ProgressInfo | undefined;
}

export interface DownloaderDispatchProps {
}

export type DownloaderProps = DownloaderStateProps & DownloaderDispatchProps & DownloaderOwnProps;

export function Downloader(props: DownloaderProps) {
	const { locale, progress } = props;
	const { id } = locale;
	return (
		<Dialog
			id="downloader"
			title={_translate(locale, 'downloadupdate')}
			isOpened={typeof progress === 'object'}
			close={() => undefined}
			noCloseButton
			>
			{typeof progress === 'object' && <div>
				<div className="update-info">
					<div className="update-size">{bytify(progress.transferred, id)} / {bytify(progress.total, id)}</div>
					<div className="update-speed">{bytify(progress.bytesPerSecond, id)}/s</div>
				</div>
				<ProgressBar
					current={progress.percent}
					max={100}
					horizontal
					fullWidth
					/>
			</div>}
		</Dialog>
	);
}

