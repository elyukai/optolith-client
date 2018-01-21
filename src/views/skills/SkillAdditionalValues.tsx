import * as React from 'react';

export interface AdditionalValue {
	className: string;
	value?: string | number;
}

export interface SkillAdditionalValuesProps {
	addValues?: AdditionalValue[];
}

export function SkillAdditionalValues(props: SkillAdditionalValuesProps) {
	const { addValues = [] } = props;

	return (
		<>
			{...addValues.map(e => {
				return (
					<div key={e.className} className={e.className}>
						{e.value}
					</div>
				);
			})}
		</>
	);
}
