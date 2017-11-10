import * as React from 'react';
import { Dialog } from '../../components/DialogNew';
import { ProgressBar } from '../../components/ProgressBar';
import { _translate, UIMessages } from '../../utils/I18n';

export interface DownloaderOwnProps {
	locale: UIMessages;
}

export interface DownloaderStateProps {
	progress: number | undefined;
}

export interface DownloaderDispatchProps {
}

export type DownloaderProps = DownloaderStateProps & DownloaderDispatchProps & DownloaderOwnProps;

export function Downloader(props: DownloaderProps) {
	return (
		<Dialog
			id="downloader"
			title={_translate(props.locale, 'downloadupdate')}
			isOpened={typeof props.progress === 'number'}
			close={() => undefined}
			noCloseButton
			>
			{typeof props.progress === 'number' && <div>
				<ProgressBar
					current={props.progress}
					max={100}
					horizontal
					fullWidth
					/>
			</div>}
		</Dialog>
	);
}

