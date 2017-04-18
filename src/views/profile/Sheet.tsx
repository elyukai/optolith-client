import * as React from 'react';
import SheetHeader from './SheetHeader';

interface HeaderValue {
	id: string;
	short: string;
	value?: number | string;
}

interface Props {
	children?: React.ReactNode;
	id: string;
	title: string;
	addHeaderInfo?: HeaderValue[];
}

export default function Sheet(props: Props) {
	const { children, id, title, addHeaderInfo } = props;
	return (
		<div className="sheet" id={id}>
			<SheetHeader title={title} add={addHeaderInfo} />
			{children}
		</div>
	);
}
