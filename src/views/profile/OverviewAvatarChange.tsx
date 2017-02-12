import * as React from 'react';
import AvatarWrapper from '../../components/Avatar';
import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import ProfileActions from '../../_actions/ProfileActions';
import TextField from '../../components/TextField';

const Ext = ({ state, func }) => (
	<div>
		<TextField
			key="ext"
			hint="Externer Bildlink"
			value={state}
			onChange={func}
			fullWidth />
		<AvatarWrapper src={state} />
	</div>
);

const FileValid = ({ func, preview }) => (
	<div>
		<TextField
			key="file"
			onChange={func}
			type="file"
			fullWidth />
		<AvatarWrapper src={preview} />
	</div>
);

const FileInvalid = ({ func, file }) => (
	<div>
		<TextField
			key="file"
			onChange={func}
			type="file"
			fullWidth />
		{ file !== false ? (<p>Die Datei ist ungültig! Überprüfe bitte das Dateiformat!</p>) : null }
	</div>
);

function File({ valid, ...other }) {
	if (valid) {
		return <FileValid {...other} />;
	} else {
		return <FileInvalid {...other} />;
	}
}

function Source({ extern, file, fileValid, filePreview, source, changeExtern, changeFile }) {
	if (source === 'ext') {
		return <Ext state={extern} func={changeExtern} />;
	} else if (source === 'file') {
		return <File valid={fileValid} func={changeFile} preview={filePreview} file={file} />;
	}
	return null;
}

interface Props {
	node?: HTMLDivElement;
}

interface State {
	source: string;
	extern: string;
	file: boolean;
	filePreview: string;
	fileValid: boolean;
}

export default class ProfileAvatarChange extends React.Component<Props, State> {
	state = {
		source: '',
		extern: '',
		file: false,
		filePreview: '',
		fileValid: false
	};

	changeSource = source => this.setState({ source });
	changeExtern = event => this.setState({ extern: event.target.value });
	changeFile = event => {
		let reader = new FileReader();
		let file = event.target.files[0];
		let filetype = file.type;
		let mime = ['image/jpeg','image/png','image/jpg'];
		if (!file || !mime.includes(filetype)) {
			this.setState({ file, fileValid: !file, filePreview: '' });
		} else {
			reader.onload = e => {
				this.setState({ file, fileValid: true, filePreview: e.target.result });
			};
			reader.readAsDataURL(file);
		}
	};
	load = () => ProfileActions.changeAvatar(this.state);

	render() {

		const { source, extern, fileValid } = this.state;

		return (
			<Dialog id="profileavatarchange" title="Portrait ändern" node={this.props.node} buttons={[
				{
					label: 'Ändern',
					onClick: this.load,
					disabled: source === '' || (source === 'ext' && extern === '') || (source === 'file' && !fileValid)
				}
			]}>
				<Dropdown
					value={source}
					onChange={this.changeSource}
					options={[['Externes Bild', 'ext'], ['Bilddatei (max. 500KB)', 'file']]}
					hint="Bildquelle auswählen"
					fullWidth />
				<Source {...this.state} changeExtern={this.changeExtern} changeFile={this.changeFile} />
			</Dialog>
		);
	}
}
