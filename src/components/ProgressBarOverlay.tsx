import * as React from 'react';

interface Props {
	current: number;
	max: number;
	horizontal?: boolean;
}

export default function ProgressBarOverlay(props: Props) {
	const { current, max, horizontal } = props;

	const style = horizontal ? { width: current / max } : { height: current / max };

	return (
		<div className="progressbar-overlay" style={style}></div>
	);
}
