import { get } from '../../stores/ListStore';
import * as Categories from '../../constants/Categories';
import * as React from 'react';
import Dialog from '../../components/Dialog';

const getTalent = (skill: TalentInstance) => {
	const attrPoints = skill.check.map(id => (get(id) as AttributeInstance).value);
	const lessAttrPoints = attrPoints.map(e => e < 13 ? 13 - e : 0).reduce((a,b) => a + b, 0);
	const flatRoutineLevel = Math.floor((skill.value - 1) / 3);
	const checkMod = flatRoutineLevel * -1 + 3;
	const dependentCheckMod = checkMod + lessAttrPoints;
	const routine = skill.value > 0 ? dependentCheckMod < 4 ? [ dependentCheckMod, lessAttrPoints > 0 ] : false : false;
	const routineSign = routine && routine[0] > 0 ? '+' : '';
	const routineOptional = routine && routine[1] ? '!' : '';
	const finalUseAreas = [ ...(skill.specialisation || []), skill.specialisationInput ].filter(e => typeof e === 'string');
	const enc = skill.encumbrance === 'true' ? 'Ja' : skill.encumbrance === 'false' ? 'Nein' : 'Evtl';

	return (
		<div className="talent">
			<div className="talent-header info-header">
				<p className="title">{skill.name}</p>
				<p className="sr">{skill.value}</p>
			</div>
			<div className="test">
				<div className={skill.check[0]}>{(get(skill.check[0]) as AttributeInstance).short}</div>
				<div className={skill.check[1]}>{(get(skill.check[1]) as AttributeInstance).short}</div>
				<div className={skill.check[2]}>{(get(skill.check[2]) as AttributeInstance).short}</div>
				<div className="hr"></div>
				<div className="routine">{routineSign}{Array.isArray(routine) ? routine[0] : '-'}{routineOptional}</div>
			</div>
			<p className="rule">
				<span>Anwendungsgebiete</span>
				<span>{finalUseAreas.join(', ')}</span>
			</p>
			<p className="enc">
				<span>Belastung</span>
				<span>{enc}</span>
			</p>
			<p className="note">
				<span>Werkzeuge</span>
				<span>eventuell Kletterausrüstung</span>
			</p>
			<p className="note">
				<span>Qualität</span>
				<span>Der Held kommt schneller an seinem Ziel an.</span>
			</p>
			<p className="note">
				<span>Misslungene Probe</span>
				<span>Der Held braucht viel länger als üblich, verletzt sich leicht (1W3 SP), traut sich nicht, zu klettern, oder hängt fest.</span>
			</p>
			<p className="note">
				<span>Kritischer Erfolg</span>
				<span>Ohne Schwierigkeiten und viel schneller als gewöhnlich hat der Held den Aufstieg geschafft. Zuschauer halten ihn für den besten Kletterer Deres. Für Qualitätsstufen, Vergleichs- und Sammelproben gilt: FP = doppelter FW.</span>
			</p>
			<p className="note">
				<span>Patzer</span>
				<span>Der Held rutscht ab und fällt (siehe Seite 340, Sturzschaden).</span>
			</p>
			<p className="ic">
				<span>Steigerungskosten</span>
				<span>{['A', 'B', 'C', 'D'][skill.ic - 1]}</span>
			</p>
		</div>
	);
};

interface Props {
	id: string;
	node?: HTMLDivElement;
}

export default class SkillInfo extends React.Component<Props, undefined> {
	render() {
		const skill = get(this.props.id);
		let content: JSX.Element | null;

		switch (skill.category) {
			case Categories.TALENTS:
				content = getTalent(skill);
				break;

			default:
				content = null;
				break;
		}

		return (
			<Dialog id="info" node={this.props.node}>
				{content}
			</Dialog>
		);
	}
}
