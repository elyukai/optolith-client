import BorderButton from '../../components/BorderButton';
import CultureStore from '../../stores/CultureStore';
import Profession, { ProfessionInstance } from '../../utils/data/Profession';
import ProfessionActions from '../../_actions/ProfessionActions';
import ProfessionVariantActions from '../../_actions/ProfessionVariantActions';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

interface Props {
	currentID: string;
	currentVID: string;
	profession: ProfessionInstance;
	sex: string;
	showAddSlidein: () => void;
}

export default class ProfessionsListItem extends Component<Props, any> {

	static propTypes = {
		currentID: PropTypes.string,
		currentVID: PropTypes.string,
		profession: PropTypes.instanceOf(Profession).isRequired,
		sex: PropTypes.string.isRequired,
		showAddSlidein: PropTypes.func.isRequired
	};

	selectProfession = () => ProfessionActions.selectProfession(this.props.profession.id);
	selectProfessionVariant = id => ProfessionVariantActions.selectProfessionVariant(id);

	render() {

		const { showAddSlidein, currentID, currentVID, profession, sex } = this.props;

		const className = classNames({
			'active': profession.id === currentID
		});

		var variants;
		if (profession.id === currentID && profession.variants.length > 0) {
			var allVariants = ProfessionVariantStore.getAll().filter(e => {
				if (profession.variants.includes(e.id)) {
					if (e.reqs_p !== null) {
						return e.reqs_p.every(req => {
							if (req[0] === 'c') {
								let cultureID = CultureStore.getCurrentID();
								return req[1].includes(cultureID);
							} else if (req[0] === 'g') {
								let gender = ProfileStore.getSex();
								return gender === req[1];
							}
							return false;
						});
					}
					return true;
				}
				return false;
			});
			if (allVariants.length > 0) {
				allVariants = allVariants.map(e => {
					let { ap, id, name } = e;
					if (typeof name === 'object') {
						name = name[sex];
					}
					return {
						name: `${name} (${profession.ap + ap} AP)`,
						value: id
					};
				});
				allVariants.splice(0, 0, {
					name: 'Keine Variante',
					value: null
				});
				variants = (
					<RadioButtonGroup active={currentVID} onClick={this.selectProfessionVariant} array={allVariants} />
				);
			}
		}

		let { name, subname } = profession;

		if (typeof name === 'object') {
			name = name[sex];
		}
		if (typeof subname === 'object') {
			subname = subname[sex];
		}

		return (
			<li className={className}>
				<div className="left">
					<h2>{name} ({profession.ap} AP)</h2>
					{subname ? <h3>{subname}</h3> : null}
					{variants}
				</div>
				<div className="right">
					{
						profession.id === currentID ? (
							<BorderButton
								label="Weiter"
								onClick={showAddSlidein}
								primary
								/>
						) : (
							<BorderButton
								label="Auswählen"
								onClick={this.selectProfession}
								/>
						)
					}
				</div>
			</li>
		);
	}
}
