import AttributeCalc from './AttributeCalc';
import AttributeList from './AttributeList';
import * as React from 'react';
import Scroll from '../../components/Scroll';

interface Props {
	attributes: Attribute[];
	baseValues: {
		[id: string]: number
	};
	el: ExperienceLevel;
	phase: number;
	sum: number;
}

export default class Attribute extends React.Component<Props, undefined> {
	render() {
		const { baseValues, el, sum, ...other } = this.props;

		const sumMax = sum >= el.maxTotalAttributeValues;
		const max = el.maxAttributeValue;

		return (
			<section id="attribute">
				<div className="page">
					<Scroll>
						<div className="counter">Punkte in Eigenschaften: {sum}</div>
						<AttributeList {...other} max={max} sumMax={sumMax} />
						<AttributeCalc {...other} baseValues={baseValues} />
					</Scroll>
				</div>
			</section>
		);
	}
}
