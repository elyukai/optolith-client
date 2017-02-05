import IconButton from '../../components/IconButton';
import { get } from '../../stores/ListStore';
import * as React from 'react';
import classNames from 'classnames';
import createOverlay from '../../utils/createOverlay';
import SkillInfo from './SkillInfo';

interface Props {
	activate?: (id: string) => void;
	activateDisabled?: boolean;
	addDisabled?: boolean;
	addPoint?: (id: string) => void;
	check?: string[];
	checkDisabled?: boolean;
	checkmod?: string;
	ic?: number;
	id: string;
	isNotActive?: boolean;
	name: string;
	removeDisabled?: boolean;
	removePoint?: (id: string) => void;
	sr?: number;
	typ?: boolean;
	untyp?: boolean;
}

export default class SkillListItem extends React.Component<Props, undefined> {
	showInfo = () => createOverlay(<SkillInfo id={this.props.id} />);

	render() {
		const { typ, untyp, name, sr, children, check, checkDisabled, checkmod, ic, isNotActive, activate, activateDisabled, addPoint, addDisabled, removePoint, removeDisabled } = this.props;

		const className = classNames({
			'list-item': true,
			'typ': typ,
			'untyp': untyp
		});

		// const groupElement = group ? (
		// 	<p className="group">{group}</p>
		// ) : null;

		const values: JSX.Element[] = [];

		if (sr || sr === 0) {
			values.push(<div key="sr" className="sr">{sr}</div>)
		}
		else if (!addPoint && !isNotActive) {
			values.push(<div key="sr"  className="sr empty"></div>)
		}

		if (!checkDisabled) {
			if (check) {
				check.forEach((attr, index) => values.push(
					<div key={attr + index} className={'check ' + attr}>{(get(attr) as Attribute).short}</div>
				));
				if (checkmod) {
					values.push(<div key="mod" className="check mod">+{checkmod}</div>);
				}
			}
		}

		const COMP = ['A', 'B', 'C', 'D', 'E'];

		if (ic) {
			values.push(<div key="ic" className="ic">{COMP[ic - 1]}</div>);
		}

		const btnElement = isNotActive ? (
			<div className="btns">
				<IconButton icon="&#xE03B;" onClick={activate} disabled={activateDisabled} />
			</div>
		) : (
			<div className="btns">
				{ addPoint ? <IconButton icon="&#xE145;" onClick={addPoint} disabled={addDisabled} flat /> : null }
				{ removePoint ? (
					<IconButton
						icon={ic && sr === 0 && !removeDisabled || !ic ? '\uE872' : '\uE15B'}
						onClick={removePoint}
						disabled={removeDisabled}
						flat
						/>
				) : null }
				<IconButton icon="&#xE88F;" flat onClick={this.showInfo} />
			</div>
		);

		return (
			<div className={className}>
				<div className="name">
					<h4>{name}</h4>
				</div>
				<div className="hr"></div>
				<div className="values">
					{values}
					{children}
				</div>
				{btnElement}
			</div>
		);
	}
}
