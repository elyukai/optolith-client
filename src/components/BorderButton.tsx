import * as React from 'react';
import Button from './Button';
import Text from './Text';

interface Props {
	children?: React.ReactNode;
	label: string;
	[propType: string]: any;
}

export default (props: Props) => {
	const { children, label, ...other } = props;

	return (
		<Button {...other}>
			<Text>{label || children}</Text>
		</Button>
	);
};
