import BorderButton from '../../components/BorderButton';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

class SkillListItem extends Component {

	static propTypes = {
		activate: PropTypes.func,
		activateDisabled: PropTypes.bool,
		addPoint: PropTypes.func,
		addDisabled: PropTypes.bool,
		check: PropTypes.array,
		checkDisabled: PropTypes.bool,
		checkmod: PropTypes.string,
		group: PropTypes.string,
		ic: PropTypes.number,
		isNotActive: PropTypes.bool,
		name: PropTypes.string,
		removePoint: PropTypes.func,
		removeDisabled: PropTypes.bool,
		sr: PropTypes.number,
		typ: PropTypes.bool,
		untyp: PropTypes.bool
	};

	render() {

		const { typ, untyp, group, name, sr, children, check, checkDisabled, checkmod, ic, isNotActive, activate, activateDisabled, addPoint, addDisabled, removePoint, removeDisabled } = this.props;

		const className = classNames({
			'typ': typ,
			'untyp': untyp
		});
		
		const groupElement = group ? (
			<td className="type">{group}</td>
		) : null;

		const fwElement = sr || sr === 0 ? (
			<td className="fw">{sr}</td>
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

		const checkElement = !checkDisabled ? (
			<td className="check">{check ? `${check.map(attr => ATTR[attr]).join('/')} ${checkmod ? `(+${checkmod})` : ''}` : null}</td>
		) : null;

		const COMP = ['A', 'B', 'C', 'D', 'E'];
		
		const sktElement = (
			<td className="skt">{ic ? COMP[ic - 1] : ''}</td>
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
				{ removePoint ? <BorderButton label="-" onClick={removePoint} disabled={removeDisabled} /> : null }
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
