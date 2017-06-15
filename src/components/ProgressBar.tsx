import * as classNames from 'classnames';
import * as React from 'react';
import { ProgressBarOverlay, ProgressBarOverlayProps } from './ProgressBarOverlay';

export interface ProgressBarProps extends ProgressBarOverlayProps {
	className?: string;
}

export function ProgressBar(props: ProgressBarProps) {
	const { className, horizontal, ...other } = props;
	return (
		<div className={classNames('progressbar', className, { horizontal })}>
			<ProgressBarOverlay horizontal={horizontal} {...other} />
		</div>
	);
}
