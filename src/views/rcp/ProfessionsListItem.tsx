import classNames from 'classnames';
import * as React from 'react';
import * as ProfessionActions from '../../actions/ProfessionActions';
import * as ProfessionVariantActions from '../../actions/ProfessionVariantActions';
import { BorderButton } from '../../components/BorderButton';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { ProfessionVariantStore } from '../../stores/ProfessionVariantStore';
import { ProfessionInstance } from '../../types/data.d';

interface Props {
	currentID?: string;
	currentVID?: string;
	profession: ProfessionInstance;
	sex: 'm' | 'f';
	showAddSlidein(): void;
}

export class ProfessionsListItem extends React.Component<Props, undefined> {
	selectProfession = () => ProfessionActions.selectProfession(this.props.profession.id);
	selectProfessionVariant = (id?: string) => ProfessionVariantActions.selectProfessionVariant(id);

	render() {

		const { showAddSlidein, currentID, currentVID, profession, sex } = this.props;

		let variants;
		if (profession.id === currentID && profession.variants.length > 0) {
			const allVariants = ProfessionVariantStore.getAllValid(profession.variants);
			if (allVariants.length > 0) {
				const variantList: Array<{ name: string; value?: string; }> = allVariants.map(e => {
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

				variantList.unshift({
					name: 'Keine Variante',
					value: undefined
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
