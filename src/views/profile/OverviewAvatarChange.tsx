import { remote } from 'electron';
import * as React from 'react';
import * as ProfileActions from '../../actions/ProfileActions';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { Dialog } from '../../components/Dialog';
import { getLocale } from '../../stores/LocaleStore';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	url: string;
	fileValid: boolean;
}

export class OverviewAvatarChange extends React.Component<Props, State> {
	state = {
		fileValid: false,
		url: ''
	} as State;

	selectFile = () => {
		const extensions = ['jpeg', 'png', 'jpg'];
		remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
			filters: [{ name: 'Bild', extensions }]
		}, fileNames => {
			const fileName = fileNames[0];
			const splitted = fileName.split('.');
			if (extensions.includes(splitted[splitted.length - 1])) {
				this.setState({ fileValid: true, url: 'file://' + fileName.replace(/\\/g, '/') } as State);
			}
			else {
				this.setState({ fileValid: false, url: '' } as State);
			}
		});
	}
	load = () => {
		const { url } = this.state;
		ProfileActions.setHeroAvatar(url);
	}

	render() {
		const { fileValid, url } = this.state;

		return (
			<Dialog
				id="profileavatarchange"
				title={getLocale()['changeheroavatar.title']}
				node={this.props.node}
				buttons={[
					{
						disabled: fileValid === false || url === '',
						label: getLocale()['changeheroavatar.actions.change'],
						onClick: this.load,
					},
				]}
				>
				<BorderButton label={getLocale()['changeheroavatar.options.selectfile']} onClick={this.selectFile} />
				{fileValid === true && url !== '' && <AvatarWrapper src={url} />}
				{fileValid === false && url !== '' && <p>{getLocale()['changeheroavatar.warnings.invalidfile']}</p>}
			</Dialog>
		);
	}
}
