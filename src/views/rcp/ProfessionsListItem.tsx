import * as ProfessionActions from '../../actions/ProfessionActions';
import * as ProfessionVariantActions from '../../actions/ProfessionVariantActions';
import * as React from 'react';
import BorderButton from '../../components/BorderButton';
import classNames from 'classnames';
import CultureStore from '../../stores/CultureStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';

interface Props {
	currentID: string | null;
	currentVID: string | null;
	profession: ProfessionInstance;
	sex: 'm' | 'f';
	showAddSlidein: () => void;
}

export default class ProfessionsListItem extends React.Component<Props, undefined> {
	selectProfession = () => ProfessionActions.selectProfession(this.props.profession.id);
	selectProfessionVariant = (id: string | null) => ProfessionVariantActions.selectProfessionVariant(id);

	render() {

		const { showAddSlidein, currentID, currentVID, profession, sex } = this.props;

		const className = classNames({
			'active': profession.id === currentID
		});

		let variants;
		if (profession.id === currentID && profession.variants.length > 0) {
			const allVariants = ProfessionVariantStore.getAll().filter(e => {
				if (profession.variants.includes(e.id)) {
					if (e.dependencies !== null) {
						return e.dependencies.every(req => {
							if (req.id === 'CULTURE') {
								const cultureID = CultureStore.getCurrentID() as string;
								return (req.value as string[]).includes(cultureID);
							} else if (req.id === 'SEX') {
								const sex = ProfileStore.getSex();
								return sex === req.value;
							}
							return false;
						});
					}
					return true;
				}
				return false;
			});
			if (allVariants.length > 0) {
				const variantList: { name: string; value: string | null; }[] = allVariants.map(e => {
					const { ap, id } = e;
					let { name } = e;
					if (typeof name === 'object') {
						name = name[sex];
					}
					return {
						name: `${name} (${profession.ap + ap} AP)`,
						value: id
					};
				});
				variantList.splice(0, 0, {
					name: 'Keine Variante',
					value: null
				});
				variants = (
					<RadioButtonGroup
						active={currentVID}
						onClick={this.selectProfessionVariant}
						array={variantList}
						/>
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
