import * as React from 'react';
import Scroll from '../../components/Scroll';
import AttributeCalc from './AttributeCalc';
import AttributeList from './AttributeList';
import AttributesPermanentList from './AttributesPermanentList';

interface Props {
	attributes: AttributeInstance[];
	el: ExperienceLevel;
	phase: number;
	sum: number;
}

export default class Attribute extends React.Component<Props, undefined> {
	render() {
		const { el, sum, ...other } = this.props;

		const sumMax = sum >= el.maxTotalAttributeValues;
		const max = el.maxAttributeValue;

		return (
			<section id="attribute">
				<div className="page">
					<Scroll>
						<div className="counter">Punkte in Eigenschaften: {sum}</div>
						<AttributeList {...other} max={max} sumMax={sumMax} />
						<AttributeCalc {...other} />
						<AttributesPermanentList phase={other.phase} />
					</Scroll>
				</div>
			</section>
		);
	}
}
