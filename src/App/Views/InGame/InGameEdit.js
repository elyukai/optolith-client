import React, { Component } from 'react';
import { InGameActions } from '../../App/Actions/InGameActions';
import { BorderButton } from '../Universal/BorderButton';
import { Dropdown } from '../Universal/Dropdown';
import { Slidein } from '../Universal/Slidein';
import { TextField } from '../Universal/TextField';

export class InGameEdit extends Component {

	static propTypes = {
		editCast: React.PropTypes.string.isRequired,
		editDuplicate: React.PropTypes.string.isRequired,
		editIndex: React.PropTypes.number.isRequired,
		fighters: React.PropTypes.array.isRequired
	};

	editValue = (tag, event) => InGameActions.editValue(tag, event.target.value);
	editValueDropdown = (tag, value) => InGameActions.editValue(tag, value);
	activateFighter = () => InGameActions.activateFighter();
	deactivateFighter = () => InGameActions.deactivateFighter();
	editCast = event => InGameActions.editCast(event.target.value);
	editDuplicate = event => InGameActions.editDuplicate(event.target.value);
	cast = () => InGameActions.cast();
	stopCast = () => InGameActions.stopCast();
	duplicateFighter = () => InGameActions.duplicateFighter();
	removeFighter = () => InGameActions.removeFighter();
	closeEdit = () => InGameActions.closeEdit();

	render() {
		return (
			<Slidein isOpen={this.props.editIndex > -1} close={this.closeEdit}>
				{
					this.props.editIndex > -1 ? (
						<div className="edit-inner">
							<div className="edit-main">
								<TextField
									labelText="Name"
									value={this.props.fighters[this.props.editIndex].name}
									onChangeE={this.editValue.bind(null, 'name')}
								/>
								<Dropdown
									label="Gesinnung"
									value={this.props.fighters[this.props.editIndex].type}
									onChange={this.editValueDropdown.bind(null, 'type')}
									options={[['Held', 'h'], ['Verbündeter', 'v'], ['Feind', 'f']]}
								/>
								<TextField
									labelText="Aktionsmodifikator"
									value={this.props.fighters[this.props.editIndex].aktm}
									onChangeE={this.editValue.bind(null, 'aktm')}
								/>
								<TextField
									labelText="Verbrauchte Aktionen"
									value={this.props.fighters[this.props.editIndex].aktv}
									onChangeE={this.editValue.bind(null, 'aktv')}
								/>
								<TextField
									labelText="Verbrauchte Freie Aktionen"
									value={this.props.fighters[this.props.editIndex].faktv}
									onChangeE={this.editValue.bind(null, 'faktv')}
								/>
							</div>
							<div className="edit-health">
								<TextField
									labelText="INI"
									value={this.props.fighters[this.props.editIndex].init}
									onChangeE={this.editValue.bind(null, 'init')}
								/>
								<TextField
									labelText="IB"
									value={this.props.fighters[this.props.editIndex].ib}
									onChangeE={this.editValue.bind(null, 'ib')}
								/>
								<TextField
									labelText="LeP"
									value={this.props.fighters[this.props.editIndex].lec}
									onChangeE={this.editValue.bind(null, 'lec')}
								/>
								<TextField
									labelText="LE"
									value={this.props.fighters[this.props.editIndex].le}
									onChangeE={this.editValue.bind(null, 'le')}
								/>
								<TextField
									labelText="AuP"
									value={this.props.fighters[this.props.editIndex].auc}
									onChangeE={this.editValue.bind(null, 'auc')}
								/>
								<TextField
									labelText="AU"
									value={this.props.fighters[this.props.editIndex].au}
									onChangeE={this.editValue.bind(null, 'au')}
								/>
								<TextField
									labelText="AsP"
									value={this.props.fighters[this.props.editIndex].aec}
									onChangeE={this.editValue.bind(null, 'aec')}
								/>
								<TextField
									labelText="AE"
									value={this.props.fighters[this.props.editIndex].ae}
									onChangeE={this.editValue.bind(null, 'ae')}
								/>
								<TextField
									labelText="KaP"
									value={this.props.fighters[this.props.editIndex].kec}
									onChangeE={this.editValue.bind(null, 'kec')}
								/>
								<TextField
									labelText="KE"
									value={this.props.fighters[this.props.editIndex].ke}
									onChangeE={this.editValue.bind(null, 'ke')}
								/>
							</div>
							<div className="edit-options">
								{
									this.props.fighters[this.props.editIndex].deac ? (
										<BorderButton label="Aktivieren" onClick={this.activateFighter} />
									) : (
										<BorderButton label="Deaktivieren" onClick={this.deactivateFighter} />
									)
								}
								<TextField
									hint="Aktion(en) über Zeit"
									value={this.props.editCast}
									onChangeE={this.editCast}
								/>
								<BorderButton label="Aktionen über Zeit addieren" onClick={this.cast} />
								<BorderButton label="Aktion über Zeit abbrechen" onClick={this.stopCast} />
								<TextField
									hint="Duplikate"
									value={this.props.editDuplicate}
									onChangeE={this.editDuplicate}
								/>
								<BorderButton label="Kämpfer duplizieren" onClick={this.duplicateFighter} />
								<BorderButton label="Kämpfer entfernen" onClick={this.removeFighter} />
							</div>
						</div>
					) : null
				}
			</Slidein>
		);
	}
}
