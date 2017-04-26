import * as React from 'react';

export function CombatSheetStates() {
	return (
		<div className="status">
			<div className="status-tiers">
				<header><h4>Zustände</h4><div>I</div><div>II</div><div>III</div><div>IV</div></header>
				<div><span>Animosität</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Belastung</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Berauscht</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Betäubung</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Entrückt</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Furcht</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Paralyse</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Schmerz</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
				<div><span>Verwirrung</span><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
			</div>
			<div className="status-effects">
				<header><h4>Status</h4></header>
				<div><span>Bewegungsunf.</span><div><div></div></div></div>
				<div><span>Bewusstlos</span><div><div></div></div></div>
				<div><span>Blind</span><div><div></div></div></div>
				<div><span>Blutrausch</span><div><div></div></div></div>
				<div><span>Brennend</span><div><div></div></div></div>
				<div><span>Eingeengt</span><div><div></div></div></div>
				<div><span>Fixiert</span><div><div></div></div></div>
				<div><span>Handlungsunf.</span><div><div></div></div></div>
				<div><span>Krank</span><div><div></div></div></div>
			</div>
			<div className="status-effects">
				<div><span>Liegend</span><div><div></div></div></div>
				<div><span>Pechmagnet</span><div><div></div></div></div>
				<div><span>Raserei</span><div><div></div></div></div>
				<div><span>Stumm</span><div><div></div></div></div>
				<div><span>Taub</span><div><div></div></div></div>
				<div><span>Überrascht</span><div><div></div></div></div>
				<div><span>Übler Geruch</span><div><div></div></div></div>
				<div><span>Unsichtbar</span><div><div></div></div></div>
				<div><span>Vergiftet</span><div><div></div></div></div>
				<div><span>Versteinert</span><div><div></div></div></div>
			</div>
		</div>
	);
}
