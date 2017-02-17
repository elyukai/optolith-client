import * as ProfileActions from '../../actions/ProfileActions';
import * as React from 'react';
import AvatarWrapper from '../../components/Avatar';
import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import TextField from '../../components/TextField';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	sourceType: string;
	url: string;
	file?: File;
	filePreview: string;
	fileValid: boolean;
}

export default class ProfileAvatarChange extends React.Component<Props, State> {
	state = {
		sourceType: '',
		url: '',
		file: undefined,
		filePreview: '',
		fileValid: false
	} as State;

	changeSourceType = (type: string) => this.setState({ sourceType: type } as State);
	changeUrl = (event: InputTextEvent) => this.setState({ url: event.target.value } as State);
	changeFile = (event: InputTextEvent) => {
		const reader = new FileReader();
		const file = event.target.files && event.target.files[0];
		const filetype = file && file.type;
		const mime: (string | null)[] = ['image/jpeg','image/png','image/jpg'];
		if (!file || !mime.includes(filetype) || file.size <= 524288) {
			this.setState({ file, fileValid: false, filePreview: '' } as State);
		} else {
			reader.onload = e => {
				this.setState({ file, fileValid: true, filePreview: e.target.result } as State);
			};
			reader.readAsDataURL(file);
		}
	}
	load = () => {
		const { sourceType, url, file } = this.state;
		ProfileActions.setHeroAvatar(sourceType === 'extern' ? url : file!);
	}

	render() {
		const { sourceType, url, file, fileValid, filePreview } = this.state;

		return (
			<Dialog id="profileavatarchange" title="Portrait ändern" node={this.props.node} buttons={[
				{
					label: 'Ändern',
					onClick: this.load,
					disabled: sourceType === '' || (sourceType === 'extern' && url === '') || (sourceType === 'file' && file && !fileValid)
				}
			]}>
				<Dropdown
					value={sourceType}
					onChange={this.changeSourceType}
					options={[{id:'extern',name:'Externes Bild'},{id:'file',name:'Bilddatei (max. 500KB)'}]}
					hint="Bildquelle auswählen"
					fullWidth />
				{(() => {
					if (sourceType === 'extern') {
						return (
							<div>
								<TextField
									hint="Externer Bildlink"
									value={url}
									onChange={this.changeUrl}
									fullWidth
									/>
								<AvatarWrapper src={url} />
							</div>
						);
					} else if (sourceType === 'file') {
						return (
							<div>
								<TextField
									onChange={this.changeFile}
									type="file"
									fullWidth
									/>
								{fileValid ? (
									<AvatarWrapper src={filePreview} />
								) : (
									<p>Die Datei ist ungültig! Überprüfe bitte das Dateiformat und die Dateigröße!</p>
								)}
							</div>
						);
					}
					return null;
				})()}
			</Dialog>
		);
	}
}
