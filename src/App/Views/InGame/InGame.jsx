import { classNames } from 'classnames';
import React, { Component } from 'react';
import { InGameActions } from '../../App/Actions/InGameActions';
import { createOverlay } from '../../App/Utils/createOverlay';
import { InGameStore } from '../../stores/InGameStore';
import { BorderButton } from '../Universal/BorderButton';
import { Dialog } from '../Universal/Dialog';
import { IconButton } from '../Universal/IconButton';
import { Scroll } from '../Universal/Scroll';
import { TextField } from '../Universal/TextField';
import { InGameControls } from './InGameControls';
import { InGameEdit } from './InGameEdit';
import { InGameTableHealth } from './InGameTableHealth';
import { InGameTableIni } from './InGameTableIni';
import { InGameTableLeft } from './InGameTableLeft';
import { InGameTableRight } from './InGameTableRight';

export class InGame extends Component {

	state = {
		options: InGameStore.getOptions(),
		fighters: InGameStore.getFighters(),
		status: InGameStore.getStatus(),
		online: InGameStore.getOnline(),
		maxIni: InGameStore.getIni(),
		usedPhases: InGameStore.getUsedPhases(),
		iniArray: InGameStore.getIniArray(),
		editIndex: InGameStore.getEditIndex(),
		editCast: InGameStore.getEditCast(),
		editDuplicate: InGameStore.getEditDuplicate()
	};

	_updateInGameStore = () => this.setState({
		options: InGameStore.getOptions(),
		fighters: InGameStore.getFighters(),
		status: InGameStore.getStatus(),
		online: InGameStore.getOnline(),
		maxIni: InGameStore.getIni(),
		usedPhases: InGameStore.getUsedPhases(),
		iniArray: InGameStore.getIniArray(),
		editIndex: InGameStore.getEditIndex(),
		editCast: InGameStore.getEditCast(),
		editDuplicate: InGameStore.getEditDuplicate()
	});

	componentDidMount() {
		InGameStore.addChangeListener(this._updateInGameStore );
	}

	componentWillUnmount() {
		InGameStore.removeChangeListener(this._updateInGameStore );
	}

	load = () => InGameActions.load();
	resetAll = () => createOverlay(
		<Dialog
			title='Liste zurücksetzen'
			buttons={[
				{ label: 'Ja', onClick: InGameActions.resetAll },
				{ label: 'Nein' }
			]}>
			Bist du dir sicher, dass du die gesamte Liste zurücksetzen möchtest? Der Vorgang kann nicht rückgängig gemacht werden!
		</Dialog>
	);
	addFighter = () => InGameActions.addFighter();

	setOnline = event => InGameActions.setOnline(event.target.value);

	render() {

		var className = classNames('ingame-table', {
			'hide-enemies': this.state.options.hideEnemies,
			'hide-deac': this.state.options.hideDeac
		});

		return (
			<div className="page" id="ingame">
				<InGameEdit
					fighters={this.state.fighters}
					editIndex={this.state.editIndex}
					editCast={this.state.editCast}
					editDuplicate={this.state.editDuplicate}
				/>
				<div className="header-controls">
					<div className="online-link">
						<TextField hint="Online-Link" value={this.state.online} onChangeE={this.setOnline} />
						<BorderButton label="Laden" onClick={this.load} />
					</div>
					<IconButton className="add-fighter" icon="&#xE7FE;" onClick={this.addFighter} />
					<IconButton className="reset-all" icon="&#xE16C;" onClick={this.resetAll} />
				</div>
				<div className="ingame-content">
					<InGameControls
						status={this.state.status}
						usedPhases={this.state.usedPhases}
						maxIni={this.state.maxIni}
						options={this.state.options}
					/>
					<Scroll>
						<div className={className}>
							<InGameTableLeft
								fighters={this.state.fighters}
								options={this.state.options}
							/>
							<InGameTableIni
								fighters={this.state.fighters}
								status={this.state.status}
								iniArray={this.state.iniArray}
								usedPhases={this.state.usedPhases}
								options={this.state.options}
							/>
							<InGameTableHealth
								fighters={this.state.fighters}
								options={this.state.options}
							/>
							<InGameTableRight
								fighters={this.state.fighters}
								options={this.state.options}
							/>
						</div>
					</Scroll>
				</div>
			</div>
		);
	}
}
