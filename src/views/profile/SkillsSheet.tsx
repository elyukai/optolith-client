import { get } from '../../stores/ListStore';
import * as React from 'react';
import AttributeMods from './AttributeMods';
import SheetHeader from './SheetHeader';
import TalentsStore from '../../stores/TalentsStore';
import TextBox from '../../components/TextBox';

const getRoutineValue = (sr: number, attributes: number[]) => {
	if (sr > 0 ) {
		const lessAttrPoints = attributes.map(e => e < 13 ? 13 - e : 0).reduce((a,b) => a + b, 0);
		const flatRoutineLevel = Math.floor((sr - 1) / 3);
		const checkMod = flatRoutineLevel * -1 + 3;
		const dependentCheckMod = checkMod + lessAttrPoints;
		return dependentCheckMod < 4 ? [ dependentCheckMod, lessAttrPoints > 0 ] as [number, boolean] : false;
	}
	return false;
};

const iterateList = (arr: TalentInstance[]): JSX.Element[] => arr.map(obj => {
	const { id, name, check, encumbrance, ic, value } = obj;
	const checkValues = check.map(e => (get(e) as AttributeInstance).value);
	const checkString = check.map(e => (get(e) as AttributeInstance).short).join('/');
	const encString = encumbrance === 'true' ? 'Ja' : encumbrance === 'false' ? 'Nein' : 'Evtl';
	const ics = ['A','B','C','D'];
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

export default () => {
	const talentsByGroup: TalentInstance[][] = [[],[],[],[],[]];
	TalentsStore.getAll().forEach(obj => talentsByGroup[obj.gr - 1].push(obj));

	const groupChecksIds = [
		['COU','AGI','STR'],
		['INT','CHA','CHA'],
		['COU','AGI','CON'],
		['SGC','SGC','INT'],
		['DEX','DEX','CON']
	];
	const groupChecks = groupChecksIds.map(arr => arr.map(e => (get(e) as AttributeInstance).short).join('/'));

	const SA_30 = get('SA_30') as SpecialAbilityInstance;
	const languages = SA_30.active.map(({ sid, tier }) => {
		const { id, name } = SA_30.sel[(sid as number) - 1];
		return ({ id, name, tier: tier! });
	}).sort((a,b) => a.tier < b.tier ? 1 : a.tier > b.tier ? -1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

	const SA_28 = get('SA_28') as SpecialAbilityInstance;
	const scripts = SA_28.active.map(({ sid }) => SA_30.sel[(sid as number) - 1].name).sort();

	return (
		<div className="sheet" id="skills-sheet">
			<SheetHeader title="Spielwerte" />
			<TextBox label="Fertigkeiten">
				<div className="upper">
					<table>
						<thead>
							<tr>
								<td className="name">Talent</td>
								<td className="check">Probe</td>
								<td className="enc">BE</td>
								<td className="ic">Sf.</td>
								<td className="sr">Fw</td>
								<td className="routine">R</td>
								<td className="comment">Anmerkung</td>
							</tr>
						</thead>
						<tbody>
							<tr className="group">
								<td className="name">Körpertalente</td>
								<td className="check">{groupChecks[0]}</td>
								<td className="enc"></td>
								<td className="ic"></td>
								<td className="sr"></td>
								<td className="routine"></td>
								<td className="comment">S. 188-194</td>
							</tr>
							{iterateList(talentsByGroup[0])}
							<tr><td/><td/><td/><td/><td/><td/><td/></tr>
							<tr className="group">
								<td className="name">Gesellschaftstalente</td>
								<td className="check">{groupChecks[1]}</td>
								<td className="enc"></td>
								<td className="ic"></td>
								<td className="sr"></td>
								<td className="routine"></td>
								<td className="comment">S. 194-198</td>
							</tr>
							{iterateList(talentsByGroup[1])}
							<tr><td/><td/><td/><td/><td/><td/><td/></tr>
							<tr className="group">
								<td className="name">Naturtalente</td>
								<td className="check">{groupChecks[2]}</td>
								<td className="enc"></td>
								<td className="ic"></td>
								<td className="sr"></td>
								<td className="routine"></td>
								<td className="comment">S. 198-201</td>
							</tr>
							{iterateList(talentsByGroup[2])}
						</tbody>
					</table>
					<table>
						<thead>
							<tr>
								<td className="name">Talent</td>
								<td className="check">Probe</td>
								<td className="enc">BE</td>
								<td className="ic">Sf.</td>
								<td className="sr">Fw</td>
								<td className="routine">R</td>
								<td className="comment">Anmerkung</td>
							</tr>
						</thead>
						<tbody>
							<tr className="group">
								<td className="name">Wissenstalente</td>
								<td className="check">{groupChecks[3]}</td>
								<td className="enc"></td>
								<td className="ic"></td>
								<td className="sr"></td>
								<td className="routine"></td>
								<td className="comment">S. 201-206</td>
							</tr>
							{iterateList(talentsByGroup[3])}
							<tr><td/><td/><td/><td/><td/><td/><td/></tr>
							<tr className="group">
								<td className="name">Handwerkstalente</td>
								<td className="check">{groupChecks[4]}</td>
								<td className="enc"></td>
								<td className="ic"></td>
								<td className="sr"></td>
								<td className="routine"></td>
								<td className="comment">S. 206-213</td>
							</tr>
							{iterateList(talentsByGroup[4])}
						</tbody>
					</table>
				</div>
			</TextBox>
			<div className="lower">
				<div className="abilites">
					<TextBox label="Sprachen">
						<table className="languages-list">
							<tbody>
								{languages.map(e => <tr key={`lang-${e.id}`}>
									<td>{e.name}</td>
									<td>{e.tier === 4 ? 'MS' : e.tier}</td>
								</tr>)}
							</tbody>
						</table>
					</TextBox>
					<TextBox label="Schriften">
						<div className="scripts-list">
							{scripts.join(', ')}
						</div>
					</TextBox>
				</div>
				<AttributeMods />
				<TextBox className="routine-checks" label="Routineproben">
					<p>Alle Proben-Eigenschaften auf 13+</p>
					<p>Optional:</p>
					<p>Je fehlendem Eigenschaftspunkt</p>
					<p>Fw um drei höher als angegeben</p>
					<table>
						<thead>
							<tr><td><div>Proben-<br/>Mod.</div></td><td><div>Nötiger<br/>Fw</div></td><td><div>Proben-<br/>Mod.</div></td><td><div>Nötiger<br/>Fw</div></td></tr>
						</thead>
						<tbody>
							<tr><td>ab +3</td><td>1</td><td>-1</td><td>13</td></tr>
							<tr><td>+2</td><td>4</td><td>-2</td><td>16</td></tr>
							<tr><td>+1</td><td>7</td><td>-3</td><td>19</td></tr>
							<tr><td>+/-0</td><td>10</td><td></td><td></td></tr>
						</tbody>
					</table>
				</TextBox>
				<TextBox className="quality-levels" label="Qualitätsstufen">
					<table>
						<thead>
							<tr><td><div>Fertigkeits-<br/>punkte</div></td><td><div>Qualitäts-<br/>stufe</div></td></tr>
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
		</div>
	);
};
