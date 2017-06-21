import * as React from 'react';
import * as SheetActions from '../../actions/SheetActions';
import { Checkbox } from '../../components/Checkbox';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { SheetStore } from '../../stores/SheetStore';
import { TalentsStore } from '../../stores/TalentsStore';
import { AttributeInstance, TalentInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';
import { sort } from '../../utils/FilterSortUtils';
import { AttributeMods } from './AttributeMods';
import { Sheet } from './Sheet';
import { SheetOptions } from './SheetOptions';
import { SheetWrapper } from './SheetWrapper';
import { SkillsSheetLanguages } from './SkillsSheetLanguages';
import { SkillsSheetQualityLevels } from './SkillsSheetQualityLevels';
import { SkillsSheetRoutineChecks } from './SkillsSheetRoutineChecks';
import { SkillsSheetScripts } from './SkillsSheetScripts';

const getRoutineValue = (sr: number, attributes: number[]) => {
	if (sr > 0 ) {
		const lessAttrPoints = attributes.map(e => e < 13 ? 13 - e : 0).reduce((a, b) => a + b, 0);
		const flatRoutineLevel = Math.floor((sr - 1) / 3);
		const checkMod = flatRoutineLevel * -1 + 3;
		const dependentCheckMod = checkMod + lessAttrPoints;
		return dependentCheckMod < 4 ? [ dependentCheckMod, lessAttrPoints > 0 ] as [number, boolean] : false;
	}
	return false;
};

const iterateList = (arr: TalentInstance[], checkValueVisibility: boolean): JSX.Element[] => sort(arr).map(obj => {
	const { id, name, check, encumbrance, ic, value } = obj;
	const checkValues = check.map(e => (get(e) as AttributeInstance).value);
	const checkString = check.map(e => {
		const attribute = get(e) as AttributeInstance;
		if (checkValueVisibility === true) {
			return attribute.value;
		}
		else {
			return attribute.short;
		}
	}).join('/');
	const encString = encumbrance === 'true' ? translate('charactersheet.gamestats.skills.enc.yes') : encumbrance === 'false' ? translate('charactersheet.gamestats.skills.enc.no') : translate('charactersheet.gamestats.skills.enc.maybe');
	const ics = ['A', 'B', 'C', 'D'];
	const routine = getRoutineValue(value, checkValues);
	const routineSign = routine && routine[0] > 0 ? '+' : '';
	const routineMark = routine && routine[1] ? '!' : '';
	return (<tr key={id}>
		<td className="name">{name}</td>
		<td className="check">{checkString}</td>
		<td className="enc">{encString}</td>
		<td className="ic">{ics[ic - 1]}</td>
		<td className="sr">{value}</td>
		<td className="routine">{routineSign}{Array.isArray(routine) ? routine[0] : '-'}{routineMark}</td>
		<td className="comment"></td>
	</tr>);
});

interface State {
	checkAttributeValueVisibility: boolean;
}

export class SkillsSheet extends React.Component<{}, State> {
	state = SheetStore.getAllForSpellsSheet();

	componentDidMount() {
		SheetStore.addChangeListener(this.updateSheetStore);
	}

	componentWillUnmount() {
		SheetStore.removeChangeListener(this.updateSheetStore);
	}

	render() {
		const { checkAttributeValueVisibility } = this.state;

		const talentsByGroup: TalentInstance[][] = [[], [], [], [], []];
		TalentsStore.getAll().forEach(obj => talentsByGroup[obj.gr - 1].push(obj));

		const groupChecksIds = [
			['COU', 'AGI', 'STR'],
			['INT', 'CHA', 'CHA'],
			['COU', 'AGI', 'CON'],
			['SGC', 'SGC', 'INT'],
			['DEX', 'DEX', 'CON'],
		];
		const groupChecks = groupChecksIds.map(arr => arr.map(e => {
		const attribute = get(e) as AttributeInstance;
			if (checkAttributeValueVisibility === true) {
				return attribute.value;
			}
			else {
				return attribute.short;
			}
		}).join('/'));

		return (
			<SheetWrapper>
				<SheetOptions>
					<Checkbox
						checked={this.state.checkAttributeValueVisibility}
						onClick={this.switchAttributeValueVisibility}
						>
						{translate('charactersheet.options.showattributevalues')}
					</Checkbox>
				</SheetOptions>
				<Sheet id="skills-sheet" title={translate('charactersheet.gamestats.title')}>
					<TextBox label={translate('charactersheet.gamestats.skills.title')}>
						<div className="upper">
							<table>
								<thead>
									<tr>
										<th className="name">{translate('charactersheet.gamestats.skills.headers.skill')}</th>
										<th className="check">{translate('charactersheet.gamestats.skills.headers.check')}</th>
										<th className="enc">{translate('charactersheet.gamestats.skills.headers.enc')}</th>
										<th className="ic">{translate('charactersheet.gamestats.skills.headers.ic')}</th>
										<th className="sr">{translate('charactersheet.gamestats.skills.headers.sr')}</th>
										<th className="routine">{translate('charactersheet.gamestats.skills.headers.r')}</th>
										<th className="comment">{translate('charactersheet.gamestats.skills.headers.notes')}</th>
									</tr>
								</thead>
								<tbody>
									<tr className="group">
										<td className="name">{translate('charactersheet.gamestats.skills.subheaders.physical')}</td>
										<td className="check">{groupChecks[0]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{translate('charactersheet.gamestats.skills.subheaders.physicalpages')}</td>
									</tr>
									{iterateList(talentsByGroup[0], checkAttributeValueVisibility)}
									<tr><td/><td/><td/><td/><td/><td/><td/></tr>
									<tr className="group">
										<td className="name">{translate('charactersheet.gamestats.skills.subheaders.social')}</td>
										<td className="check">{groupChecks[1]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{translate('charactersheet.gamestats.skills.subheaders.socialpages')}</td>
									</tr>
									{iterateList(talentsByGroup[1], checkAttributeValueVisibility)}
									<tr><td/><td/><td/><td/><td/><td/><td/></tr>
									<tr className="group">
										<td className="name">{translate('charactersheet.gamestats.skills.subheaders.nature')}</td>
										<td className="check">{groupChecks[2]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{translate('charactersheet.gamestats.skills.subheaders.naturepages')}</td>
									</tr>
									{iterateList(talentsByGroup[2], checkAttributeValueVisibility)}
								</tbody>
							</table>
							<table>
								<thead>
									<tr>
										<th className="name">{translate('charactersheet.gamestats.skills.headers.skill')}</th>
										<th className="check">{translate('charactersheet.gamestats.skills.headers.check')}</th>
										<th className="enc">{translate('charactersheet.gamestats.skills.headers.enc')}</th>
										<th className="ic">{translate('charactersheet.gamestats.skills.headers.ic')}</th>
										<th className="sr">{translate('charactersheet.gamestats.skills.headers.sr')}</th>
										<th className="routine">{translate('charactersheet.gamestats.skills.headers.r')}</th>
										<th className="comment">{translate('charactersheet.gamestats.skills.headers.notes')}</th>
									</tr>
								</thead>
								<tbody>
									<tr className="group">
										<td className="name">{translate('charactersheet.gamestats.skills.subheaders.knowledge')}</td>
										<td className="check">{groupChecks[3]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{translate('charactersheet.gamestats.skills.subheaders.knowledgepages')}</td>
									</tr>
									{iterateList(talentsByGroup[3], checkAttributeValueVisibility)}
									<tr><td/><td/><td/><td/><td/><td/><td/></tr>
									<tr className="group">
										<td className="name">{translate('charactersheet.gamestats.skills.subheaders.craft')}</td>
										<td className="check">{groupChecks[4]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{translate('charactersheet.gamestats.skills.subheaders.craftpages')}</td>
									</tr>
									{iterateList(talentsByGroup[4], checkAttributeValueVisibility)}
								</tbody>
							</table>
						</div>
					</TextBox>
					<div className="lower">
						<div className="abilites">
							<SkillsSheetLanguages/>
							<SkillsSheetScripts/>
						</div>
						<AttributeMods />
						<SkillsSheetRoutineChecks/>
						<SkillsSheetQualityLevels/>
					</div>
				</Sheet>
			</SheetWrapper>
		);
	}

	private switchAttributeValueVisibility = () => {
		SheetActions.switchAttributeValueVisibility();
	}

	private updateSheetStore = () => {
		this.setState(SheetStore.getAllForSpellsSheet());
	}
}
