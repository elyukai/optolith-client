import { getAE, getKP } from '../../utils/secondaryAttributes';
import * as React from 'react';
import AttributeBorder from './AttributeBorder';
import IconButton from '../../components/IconButton';
import NumberBox from '../../components/NumberBox';

interface Props {
	phase: number;
}

export default class AttributesPermanentList extends React.Component<Props, undefined> {
	render() {
		const { phase } = this.props;
		const AE = getAE();
		const KP = getKP();

		return (
			<div className="permanent">
				<AttributeBorder value={0}>
					<NumberBox max={1} />
				</AttributeBorder>
				<AttributeBorder value={0}>
					<NumberBox max={1} />
				</AttributeBorder>
			</div>
		);
	}
}
