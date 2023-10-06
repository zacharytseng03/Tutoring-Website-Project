import AboveAverageFilterComponent from './AboveAverageFilterComponent';
import CountryFilterComponent from './CountryFilterComponent';
import LanguageFilterComponent from './LanguageFilterComponent';
import OrganizationFilterComponent from './OrganizationFilterComponent';
import QualificationFilterComponent from './QualificationFilterComponent';
import RatingFilterComponent from './RatingFilterComponent';
import SubjectFilterComponent, {
	PseudoSubject,
} from './SubjectFilterComponent';
import Organization from '../../../../Models/Organization.Model';
import Qualification from '../../../../Models/Qualification.Model';
import Option from '../../../../Models/Miscallaneous/Option.Model';

interface FilterBarProp {
	onSelectLanguage(values: Option[]): void;
	onSelectCountry(values: Option[]): void;
	onSelectRating(values: Option[]): void;
	onSelectOrganization(values: Organization[]): void;
	onSelectQualification(values: Qualification[]): void;
	onSelectSubject(values: PseudoSubject[]): void;
	onCheckAboveAverage(checked: boolean): void;
}

export default function FilterBarComponent(prop: FilterBarProp) {
	return (
		<>
			<div className="container">
				<div className="row">
					<div className="col-sm">
						<LanguageFilterComponent onUpdate={prop.onSelectLanguage} />
					</div>
					<div className="col-sm">
						<CountryFilterComponent onUpdate={prop.onSelectCountry} />
					</div>
					<div className="col-sm">
						<RatingFilterComponent onUpdate={prop.onSelectRating} />
					</div>
				</div>

				<div className="row">
					<div className="col-sm">
						<SubjectFilterComponent onUpdate={prop.onSelectSubject} />
					</div>
					<div className="col-sm">
						<OrganizationFilterComponent onUpdate={prop.onSelectOrganization} />
					</div>
					<div className="col-sm">
						<QualificationFilterComponent
							onUpdate={prop.onSelectQualification}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-sm">
						<AboveAverageFilterComponent
							onCheckChanged={(checked: boolean) => {
								prop.onCheckAboveAverage(checked);
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
