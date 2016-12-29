import { AttributeInstance } from '../../utils/data/Attribute';
import AttributeCalc from './AttributeCalc';
import AttributeList from './AttributeList';
import React, { Component, PropTypes } from 'react';
import Scroll from '../../components/Scroll';

interface Props {
	attributes: AttributeInstance[];
	baseValues: {
		[id: string]: number
	};
	el: {
		max_attr: number;
		max_attrsum: number;
	};
	phase: number;
	sum: number;
}

export default class Attribute extends Component<Props, any> {

	static propTypes = {
		attributes: PropTypes.array.isRequired,
		baseValues: PropTypes.object.isRequired,
		el: PropTypes.object.isRequired,
		phase: PropTypes.number.isRequired,
		sum: PropTypes.number.isRequired
	};

	render() {

		const { baseValues, el, sum, ...other } = this.props;

		const sumMax = sum >= el.max_attrsum;
		const max = el.max_attr;

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
