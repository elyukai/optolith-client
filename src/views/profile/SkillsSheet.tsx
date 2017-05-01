import * as React from 'react';
import * as SheetActions from '../../actions/SheetActions';
import { Checkbox } from '../../components/Checkbox';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { getLocale } from '../../stores/LocaleStore';
import { SheetStore } from '../../stores/SheetStore';
import { TalentsStore } from '../../stores/TalentsStore';
import { AttributeInstance, SpecialAbilityInstance, TalentInstance } from '../../types/data.d';
import { getSelectionItem, getSelectionName } from '../../utils/ActivatableUtils';
import { AttributeMods } from './AttributeMods';
import { Sheet } from './Sheet';
import { SheetOptions } from './SheetOptions';
import { SheetWrapper } from './SheetWrapper';

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

const iterateList = (arr: TalentInstance[], checkValueVisibility: boolean): JSX.Element[] => arr.map(obj => {
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
	const encString = encumbrance === 'true' ? getLocale()['charactersheet.gamestats.skills.enc.yes'] : encumbrance === 'false' ? getLocale()['charactersheet.gamestats.skills.enc.no'] : getLocale()['charactersheet.gamestats.skills.enc.maybe'];
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

export class SkillsSheet extends React.Component<undefined, State> {
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

		const SA_30 = get('SA_30') as SpecialAbilityInstance;
		const languages = SA_30.active.map(({ sid, tier }) => {
			const { id, name } = getSelectionItem(SA_30, sid)!;
			return ({ id, name, tier: tier! });
		}).sort((a, b) => a.tier < b.tier ? 1 : a.tier > b.tier ? -1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

		const SA_28 = get('SA_28') as SpecialAbilityInstance;
		const scripts = SA_28.active.map(({ sid }) => getSelectionName(SA_28, sid)).sort();

		return (
			<SheetWrapper>
				<SheetOptions>
					<Checkbox
						checked={this.state.checkAttributeValueVisibility}
						onClick={this.switchAttributeValueVisibility}
						>
						{getLocale()['charactersheet.options.showattributevalues']}
					</Checkbox>
				</SheetOptions>
				<Sheet id="skills-sheet" title={getLocale()['charactersheet.gamestats.title']}>
					<TextBox label={getLocale()['charactersheet.gamestats.skills.title']}>
						<div className="upper">
							<table>
								<thead>
									<tr>
										<th className="name">{getLocale()['charactersheet.gamestats.skills.headers.skill']}</th>
										<th className="check">{getLocale()['charactersheet.gamestats.skills.headers.check']}</th>
										<th className="enc">{getLocale()['charactersheet.gamestats.skills.headers.enc']}</th>
										<th className="ic">{getLocale()['charactersheet.gamestats.skills.headers.ic']}</th>
										<th className="sr">{getLocale()['charactersheet.gamestats.skills.headers.sr']}</th>
										<th className="routine">{getLocale()['charactersheet.gamestats.skills.headers.r']}</th>
										<th className="comment">{getLocale()['charactersheet.gamestats.skills.headers.notes']}</th>
									</tr>
								</thead>
								<tbody>
									<tr className="group">
										<td className="name">{getLocale()['charactersheet.gamestats.skills.subheaders.physical']}</td>
										<td className="check">{groupChecks[0]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{getLocale()['charactersheet.gamestats.skills.subheaders.physicalpages']}</td>
									</tr>
									{iterateList(talentsByGroup[0], checkAttributeValueVisibility)}
									<tr><td/><td/><td/><td/><td/><td/><td/></tr>
									<tr className="group">
										<td className="name">{getLocale()['charactersheet.gamestats.skills.subheaders.social']}</td>
										<td className="check">{groupChecks[1]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{getLocale()['charactersheet.gamestats.skills.subheaders.socialpages']}</td>
									</tr>
									{iterateList(talentsByGroup[1], checkAttributeValueVisibility)}
									<tr><td/><td/><td/><td/><td/><td/><td/></tr>
									<tr className="group">
										<td className="name">{getLocale()['charactersheet.gamestats.skills.subheaders.nature']}</td>
										<td className="check">{groupChecks[2]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{getLocale()['charactersheet.gamestats.skills.subheaders.naturepages']}</td>
									</tr>
									{iterateList(talentsByGroup[2], checkAttributeValueVisibility)}
								</tbody>
							</table>
							<table>
								<thead>
									<tr>
										<th className="name">{getLocale()['charactersheet.gamestats.skills.headers.skill']}</th>
										<th className="check">{getLocale()['charactersheet.gamestats.skills.headers.check']}</th>
										<th className="enc">{getLocale()['charactersheet.gamestats.skills.headers.enc']}</th>
										<th className="ic">{getLocale()['charactersheet.gamestats.skills.headers.ic']}</th>
										<th className="sr">{getLocale()['charactersheet.gamestats.skills.headers.sr']}</th>
										<th className="routine">{getLocale()['charactersheet.gamestats.skills.headers.r']}</th>
										<th className="comment">{getLocale()['charactersheet.gamestats.skills.headers.notes']}</th>
									</tr>
								</thead>
								<tbody>
									<tr className="group">
										<td className="name">{getLocale()['charactersheet.gamestats.skills.subheaders.knowledge']}</td>
										<td className="check">{groupChecks[3]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{getLocale()['charactersheet.gamestats.skills.subheaders.knowledgepages']}</td>
									</tr>
									{iterateList(talentsByGroup[3], checkAttributeValueVisibility)}
									<tr><td/><td/><td/><td/><td/><td/><td/></tr>
									<tr className="group">
										<td className="name">{getLocale()['charactersheet.gamestats.skills.subheaders.craft']}</td>
										<td className="check">{groupChecks[4]}</td>
										<td className="enc"></td>
										<td className="ic"></td>
										<td className="sr"></td>
										<td className="routine"></td>
										<td className="comment">{getLocale()['charactersheet.gamestats.skills.subheaders.craftpages']}</td>
									</tr>
									{iterateList(talentsByGroup[4], checkAttributeValueVisibility)}
								</tbody>
							</table>
						</div>
					</TextBox>
					<div className="lower">
						<div className="abilites">
							<TextBox label={getLocale()['charactersheet.gamestats.languages.title']}>
								<table className="languages-list">
									<tbody>
										{languages.map(e => <tr key={`lang-${e.id}`}>
											<td>{e.name}</td>
											<td>{e.tier === 4 ? getLocale()['charactersheet.gamestats.languages.native'] : e.tier}</td>
										</tr>)}
									</tbody>
								</table>
							</TextBox>
							<TextBox label={getLocale()['charactersheet.gamestats.knownscripts.title']}>
								<div className="scripts-list">
									{scripts.join(', ')}
								</div>
							</TextBox>
						</div>
						<AttributeMods />
						<TextBox className="routine-checks" label={getLocale()['charactersheet.gamestats.routinechecks.title']}>
							<p>{getLocale()['charactersheet.gamestats.routinechecks.texts.first']}</p>
							<p>{getLocale()['charactersheet.gamestats.routinechecks.texts.second']}</p>
							<p>{getLocale()['charactersheet.gamestats.routinechecks.texts.third']}</p>
							<p>{getLocale()['charactersheet.gamestats.routinechecks.texts.fourth']}</p>
							<table>
								<thead>
									<tr>
										<th><div>{getLocale()['charactersheet.gamestats.routinechecks.headers.checkmod']}</div></th>
										<th><div>{getLocale()['charactersheet.gamestats.routinechecks.headers.neededsr']}</div></th>
										<th><div>{getLocale()['charactersheet.gamestats.routinechecks.headers.checkmod']}</div></th>
										<th><div>{getLocale()['charactersheet.gamestats.routinechecks.headers.neededsr']}</div></th>
									</tr>
								</thead>
								<tbody>
									<tr><td>{getLocale()['charactersheet.gamestats.routinechecks.from']} +3</td><td>1</td><td>-1</td><td>13</td></tr>
									<tr><td>+2</td><td>4</td><td>-2</td><td>16</td></tr>
									<tr><td>+1</td><td>7</td><td>-3</td><td>19</td></tr>
									<tr><td>+/-0</td><td>10</td><td></td><td></td></tr>
								</tbody>
							</table>
						</TextBox>
						<TextBox className="quality-levels" label={getLocale()['charactersheet.gamestats.qualitylevels.title']}>
							<table>
								<thead>
									<tr>
										<th><div>{getLocale()['charactersheet.gamestats.qualitylevels.headers.skillpoints']}</div></th>
										<th><div>{getLocale()['charactersheet.gamestats.qualitylevels.headers.qualitylevel']}</div></th>
									</tr>
								</thead>
								<tbody>
									<tr><td>0-3</td><td>1</td></tr>
									<tr><td>4-6</td><td>2</td></tr>
									<tr><td>7-9</td><td>3</td></tr>
									<tr><td>10-12</td><td>4</td></tr>
									<tr><td>13-15</td><td>5</td></tr>
									<tr><td>16+</td><td>6</td></tr>
								</tbody>
							</table>
						</TextBox>
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
