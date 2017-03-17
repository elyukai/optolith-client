import classNames from 'classnames';
import * as React from 'react';
import * as ProfessionActions from '../../actions/ProfessionActions';
import * as ProfessionVariantActions from '../../actions/ProfessionVariantActions';
import BorderButton from '../../components/BorderButton';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import CultureStore from '../../stores/CultureStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';

interface Props {
	currentID: string | null;
	currentVID: string | null;
	profession: ProfessionInstance;
	sex: 'm' | 'f';
	showAddSlidein(): void;
}

export default class ProfessionsListItem extends React.Component<Props, undefined> {
	selectProfession = () => ProfessionActions.selectProfession(this.props.profession.id);
	selectProfessionVariant = (id: string | null) => ProfessionVariantActions.selectProfessionVariant(id);

	render() {

		const { showAddSlidein, currentID, currentVID, profession, sex } = this.props;

		let variants;
		if (profession.id === currentID && profession.variants.length > 0) {
			const allVariants = ProfessionVariantStore.getAllValid(profession.variants);
			if (allVariants.length > 0) {
				const variantList: Array<{ name: string; value: string | null; }> = allVariants.map(e => {
					const { ap, id } = e;
					let { name } = e;
					if (typeof name === 'object') {
						name = name[sex];
					}
					return {
						name: `${name} (${profession.ap + ap} AP)`,
						value: id,
					};
				});
				variantList.splice(0, 0, {
					name: 'Keine Variante',
					value: null,
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
			<li
				className={classNames({
					'active': profession.id === currentID,
				})}
				>
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
