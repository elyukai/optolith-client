import * as React from 'react';
import { HeaderValue, SheetHeader } from './SheetHeader';

export interface SheetProps {
	children?: React.ReactNode;
	id: string;
	title: string;
	addHeaderInfo?: HeaderValue[];
}

export function Sheet(props: SheetProps) {
	const { children, id, title, addHeaderInfo } = props;
	return (
		<div className="sheet" id={id}>
			<SheetHeader title={title} add={addHeaderInfo} />
			{children}
		</div>
	);
}
