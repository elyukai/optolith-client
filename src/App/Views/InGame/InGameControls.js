import { classNames } from 'classnames';
import React, { Component, PropTypes } from 'react';
import { InGameActions } from '../../App/Actions/InGameActions';
import { Checkbox } from '../Universal/Checkbox';
import { IconButton } from '../Universal/IconButton';

export class InGameControls extends Component {

	static propTypes = {
		maxIni: PropTypes.number.isRequired,
		options: PropTypes.object.isRequired,
		status: PropTypes.array.isRequired,
		usedPhases: PropTypes.array.isRequired
	};

	resetAll = () => InGameActions.resetAll();
	resetPhases = () => InGameActions.resetPhases();
	resetHealth = () => InGameActions.resetHealth();
	save = () => InGameActions.save();
	addFighter = () => InGameActions.addFighter();
	previousPhase = () => InGameActions.previousPhase();
	nextPhase = () => InGameActions.nextPhase();
	switchOption = option => InGameActions.switchOption(option);

	render() {

		const previousPhaseClassName = classNames( 'previous-phase', this.props.status[0] === 1 && this.props.status[1] === this.props.maxIni && 'disabled' );

		const nextPhaseIcon = (this.props.status[1] == 1 || this.props.status[1] == this.props.usedPhases[this.props.usedPhases.length - 1]) ? '\uE5C8' : '\uE409';

		return (
			<div className="ingame-controls options">
				<div className="rounds">
					<div className="tag">Phase</div>
					<div className="phase">{this.props.status[1]}</div>
					<div className="round">Runde {this.props.status[0]}</div>
					<div className={previousPhaseClassName} onClick={this.previousPhase}>&#xE408;</div>
					<div className="next-phase" onClick={this.nextPhase}>{nextPhaseIcon}</div>
				</div>
				<div className="resets">
					<IconButton className="reset-phases" icon="&#xE8BA;" onClick={this.resetPhases} />
					<IconButton className="reset-health" icon="&#xE3F3;" onClick={this.resetHealth} />
				</div>
				<div className="options">
					<Checkbox checked={this.props.options.hideDeac} onClick={this.switchOption.bind(null, 'hideDeac')}>Deaktivierte Kämpfer ausblenden</Checkbox>
					<Checkbox checked={this.props.options.hideEnemies} onClick={this.switchOption.bind(null, 'hideEnemies')}>Feinde ausblenden</Checkbox>
				</div>
			</div>
		);
	}
}
