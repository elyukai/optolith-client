import * as React from 'react';
import Scroll from '../../components/Scroll';
import AttributeCalc from './AttributeCalc';
import AttributeList from './AttributeList';
import AttributesPermanentList from './AttributesPermanentList';

interface Props {
	attributes: AttributeInstance[];
	el: ExperienceLevel;
	phase: number;
}

export default class Attribute extends React.Component<Props, undefined> {
	render() {
		const { attributes, el, phase } = this.props;

		const sum = attributes.reduce((a, b) => a + b.value, 0);
		const sumMax = sum >= el.maxTotalAttributeValues;
		const max = el.maxAttributeValue;

		return (
			<section id="attribute">
				<div className="page">
					<Scroll>
						<div className="counter">Punkte in Eigenschaften: {sum}</div>
						<AttributeList
							attributes={attributes}
							max={max}
							phase={phase}
							sumMax={sumMax}
							/>
						<AttributeCalc phase={phase} />
						<AttributesPermanentList phase={phase} />
					</Scroll>
				</div>
			</section>
		);
	}
}
