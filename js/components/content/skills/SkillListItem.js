import BorderButton from '../../layout/BorderButton';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

class SkillListItem extends Component {

	static propTypes = {
		typ: PropTypes.bool,
		untyp: PropTypes.bool,
		group: PropTypes.string,
		name: PropTypes.string,
		fw: PropTypes.number,
		children: PropTypes.node,
		check: PropTypes.array,
		checkmod: PropTypes.string,
		skt: PropTypes.number,
		isNotActive: PropTypes.bool,
		activate: PropTypes.func,
		activateDisabled: PropTypes.bool,
		addPoint: PropTypes.func,
		addDisabled: PropTypes.bool,
		removePoint: PropTypes.func,
		removeDisabled: PropTypes.bool
	};

	constructor(props) {
		super(props);
	}

	render() {

		const { typ, untyp, group, name, fw, children, check, checkmod, skt, isNotActive, activate, activateDisabled, addPoint, addDisabled, removePoint, removeDisabled } = this.props;

		const className = classNames({
			'typ': typ,
			'untyp': untyp
		});
		
		const groupElement = group ? (
			<td className="type">{group}</td>
		) : null;

		const fwElement = fw || fw === 0 ? (
			<td className="fw">{fw}</td>
		) : !addPoint && !isNotActive ? (
			<td className="fw"></td>
		) : null;

		const ATTR = {
			ATTR_1: 'MU',
			ATTR_2: 'KL',
			ATTR_3: 'IN',
			ATTR_4: 'CH',
			ATTR_5: 'FF',
			ATTR_6: 'GE',
			ATTR_7: 'KO',
			ATTR_8: 'KK'
		};

		const checkElement = (
			<td className="check">{check ? `${check.map(attr => ATTR[attr]).join('/')} ${checkmod ? `(+${checkmod})` : ''}` : null}</td>
		);

		const COMP = ['A', 'B', 'C', 'D', 'E'];
		
		const sktElement = (
			<td className="skt">{skt ? COMP[skt - 1] : ''}</td>
		);
		
		const btnElement = isNotActive ? (
			<td className="inc">
				<BorderButton
					label="Aktivieren"
					onClick={activate}
					disabled={activateDisabled}
					/>
			</td>
		) : (
			<td className="inc">
				{ addPoint ? <BorderButton label="+" onClick={addPoint} disabled={addDisabled} /> : null }
				<BorderButton label="-" onClick={removePoint} disabled={removeDisabled} />
			</td>
		);

		return (
			<tr className={className}>
				{groupElement}
				<td className="name"><h2>{name}</h2></td>
				{fwElement}
				{children}
				{checkElement}
				{sktElement}
				{btnElement}
			</tr>
		);
	}
}

export default SkillListItem;
