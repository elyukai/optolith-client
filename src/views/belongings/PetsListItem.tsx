import * as React from 'react';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { VerticalList } from '../../components/VerticalList';
import { PetInstance } from '../../types/data.d';

export interface PetsListItemProps extends PetInstance {
	editPet(id: string): void;
	deletePet(id: string): void;
}

export class PetsListItem extends React.Component<PetsListItemProps, {}> {
	edit = () => {
		const { editPet, id } = this.props;
		editPet(id!);
	}
	delete = () => {
		const { deletePet, id } = this.props;
		deletePet(id!);
	}

	render() {
		const { avatar, name, type } = this.props;
		return (
			<ListItem>
				<AvatarWrapper src={avatar} />
				<ListItemName name={name} large>
					<VerticalList>
						<span>{type}</span>
					</VerticalList>
				</ListItemName>
				<ListItemSeparator/>
				<ListItemButtons>
					<IconButton icon="&#xE872;" onClick={this.delete} />
					<IconButton icon="&#xE254;" onClick={this.edit} />
				</ListItemButtons>
			</ListItem>
		);
	}
}
