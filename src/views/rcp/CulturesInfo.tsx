import * as React from 'react';
import { Aside } from '../../components/Aside';
import { Scroll } from '../../components/Scroll';
import { Culture, UIMessages } from '../../types/view.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface CulturesProps {
	cultures: Culture[];
	currentId?: string;
	locale: UIMessages;
}

export function CulturesInfo(props: CulturesProps) {
	const { currentId, locale, cultures } = props;

	const culture = currentId && cultures.find(e => currentId === e.id);

	return (
		<Aside>
			{culture ? (() => {
				return (
					<Scroll>
						<div className="info culture-info">
							<div className="culture-header info-header">
								<p className="title">{culture.name}</p>
							</div>
							<p>
								<span>{_translate(locale, 'info.language')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.script')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.areaknowledge')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.socialstatus')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.commonprofessions')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.commonadvantages')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.commondisadvantages')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.uncommonadvantages')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.uncommondisadvantages')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.commonskills')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.uncommonskills')}</span>
								<span></span>
							</p>
							<p>
								<span>{_translate(locale, 'info.commonnames')}</span>
								<span></span>
							</p>
							<p className="cultural-package">
								<span>{_translate(locale, 'info.culturalpackage', culture.name, culture.culturalPackageAp)}</span>
								<span>
									{sortObjects(culture.culturalPackageSkills, locale.id).map(skill => {
										return `${skill.name} +${skill.value}`;
									}).join(', ')}
								</span>
							</p>
						</div>
					</Scroll>
				);
			})() : (
				<div className="info-placeholder">
					&#xE88F;
				</div>
			)}
		</Aside>
	);
}
