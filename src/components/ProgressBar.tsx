import classNames from 'classnames';
import * as React from 'react';
import ProgressBarOverlay from './ProgressBarOverlay';

interface Props {
	className?: string;
	current: number;
	max: number;
	horizontal?: boolean;
}

export default function ProgressBar(props: Props) {
	const { className, horizontal, ...other } = props;
	return (
		<div className={classNames('progressbar', className, { horizontal })}>
			<ProgressBarOverlay horizontal={horizontal} {...other} />
		</div>
	);
}
