import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { Hr } from '../../components/Hr';
import { Scroll } from '../../components/Scroll';
import { SegmentedControls } from '../../components/SegmentedControls';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { Book, ExperienceLevel } from '../../types/wiki';
import { _translate } from '../../utils/I18n';

export interface HeroCreationProps extends DialogProps {
	locale: UIMessages;
	experienceLevels: Map<string, ExperienceLevel>;
	sortedBooks: Book[];
	close(): void;
	createHero(name: string, sex: 'm' | 'f', el: string, enableAllRuleBooks: boolean, enabledRuleBooks: Set<string>): void;
}

export interface HeroCreationState {
	name: string;
	gender?: 'm' | 'f';
	el?: string;
	enableAllRuleBooks: boolean;
	enabledRuleBooks: Set<string>;
}

export class HeroCreation extends React.Component<HeroCreationProps, HeroCreationState> {
	state: HeroCreationState = {
		name: '',
		enableAllRuleBooks: false,
		enabledRuleBooks: new Set()
	};

	changeName = (event: InputTextEvent) => this.setState({ name: event.target.value } as HeroCreationState);
	changeGender = (gender: string) => this.setState({ gender } as HeroCreationState);
	changeEL = (el: string) => this.setState({ el } as HeroCreationState);
	create = () => {
		const { name, gender, el, enableAllRuleBooks, enabledRuleBooks } = this.state;
		if (name.length > 0 && gender && el) {
			this.props.createHero(name, gender, el, enableAllRuleBooks, enabledRuleBooks);
		}
	}
	close = () => {
		this.props.close();
		this.setState({ name: '', gender: undefined, el: undefined });
	}

	switchEnableAllRuleBooks = (): void => {
		this.setState(prevState => ({ enableAllRuleBooks: !prevState.enableAllRuleBooks }));
	}

	switchEnableRuleBook = (id: string): void => {
		const { enabledRuleBooks } = this.state;
		if (enabledRuleBooks.has(id)) {
			const set = new Set([...enabledRuleBooks]);
			set.delete(id);
			this.setState(() => ({ enabledRuleBooks: set }));
		}
		else {
			this.setState(() => ({ enabledRuleBooks: new Set([...enabledRuleBooks, id]) }));
		}
	}

	componentWillReceiveProps(nextProps: HeroCreationProps) {
		if (nextProps.isOpened === false && this.props.isOpened === true) {
			this.setState({
				name: '',
				gender: undefined,
				el: undefined
			});
		}
	}

	render() {
		const { experienceLevels: experienceLevelsMap, locale, sortedBooks, ...other } = this.props;
		const { enableAllRuleBooks, enabledRuleBooks } = this.state;
		const experienceLevels = [...experienceLevelsMap.values()].map(e => {
			const { id, name, ap } = e;
			return { id, name: `${name} (${ap} AP)` };
		});

		return (
			<Dialog {...other} id="herocreation" title={_translate(locale, 'herocreation.title')} close={this.close} buttons={[
				{
					disabled: this.state.name === '' || !this.state.gender || !this.state.el,
					label: _translate(locale, 'herocreation.actions.start'),
					onClick: this.create,
					primary: true,
				},
			]}>
				<TextField
					hint={_translate(locale, 'herocreation.options.nameofhero')}
					value={this.state.name}
					onChange={this.changeName}
					fullWidth
					autoFocus
					/>
				<SegmentedControls
					active={this.state.gender}
					onClick={this.changeGender}
					options={[{value: 'm', name: _translate(locale, 'herocreation.options.selectsex.male')}, {value: 'f', name: _translate(locale, 'herocreation.options.selectsex.female')}]}
					/>
				<Dropdown
					value={this.state.el}
					onChange={this.changeEL}
					options={experienceLevels}
					hint={_translate(locale, 'herocreation.options.selectexperiencelevel')}
					fullWidth
					/>
				<Hr/>
				<Scroll>
					<Checkbox
						checked={enableAllRuleBooks === true}
						onClick={this.switchEnableAllRuleBooks}
						label={_translate(locale, 'rules.enableallrulebooks')}
						/>
					{sortedBooks.map(e => {
						const isCore = ['US25001', 'US25002'].includes(e.id);
						return (
							<Checkbox
								key={e.id}
								checked={enableAllRuleBooks === true || enabledRuleBooks.has(e.id) || isCore}
								onClick={() => this.switchEnableRuleBook(e.id)}
								label={e.name}
								disabled={enableAllRuleBooks === true || isCore}
								/>
						);
					})}
				</Scroll>
			</Dialog>
		);
	}
}
