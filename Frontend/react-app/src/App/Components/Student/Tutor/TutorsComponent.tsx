import { useState } from 'react';
import FilterBarComponent from './FilterBar/FilterBarComponent';
import { PseudoSubject } from './FilterBar/SubjectFilterComponent';
import TutorListComponent from './TutorsList/TutorsListComponent';
import Organization from '../../../Models/Organization.Model';
import Qualification from '../../../Models/Qualification.Model';
import Subject from '../../../Models/Subject.Model';
import Option from '../../../Models/Miscallaneous/Option.Model';
import TutorOrgComponent from './TutorOrgComponent';

export default function TutorsComponent() {
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
	const [selectedRating, setSelectedRating] = useState<number>();
	const [selectedOrganizations, setSelectedOrganizations] = useState<
		Organization[]
	>([]);
	const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
	const [selectedQualifications, setSelectedQualifications] = useState<
		Qualification[]
	>([]);
	const [filterAboveAverage, setAboveAverageFilter] = useState(false);

	const onSelectLanguage = (selectedList: Option[]) => {
		setSelectedLanguages(selectedList.map((option) => option.id as string));
	};

	const onSelectCountry = (selectedList: Option[]) => {
		setSelectedCountries(selectedList.map((option) => option.id as string));
	};

	const onSelectRating = (selectedList: Option[]) => {
		if (selectedList.length === 0 || selectedList[0].id === 0)
			setSelectedRating(undefined);
		else setSelectedRating(selectedList[0].id as number);
	};

	const onSelectOrganization = (selectedList: Organization[]) => {
		setSelectedOrganizations(selectedList.slice());
	};

	const onSelectSubect = (selectedList: PseudoSubject[]) => {
		const subjects = selectedList.map((pseudoSubject) => ({
			course: pseudoSubject.courseString.split('-', 2)[0],
			level: pseudoSubject.courseString.split('-', 2)[1],
			description: pseudoSubject.description,
		}));
		setSelectedSubjects(subjects);
	};

	const onSelectQualification = (selectedList: Qualification[]) => {
		setSelectedQualifications(selectedList.slice());
	};

	return (
		<>
			<div>
				<FilterBarComponent
					onSelectLanguage={onSelectLanguage}
					onSelectCountry={onSelectCountry}
					onSelectRating={onSelectRating}
					onSelectSubject={onSelectSubect}
					onSelectOrganization={onSelectOrganization}
					onSelectQualification={onSelectQualification}
					onCheckAboveAverage={setAboveAverageFilter}
				/>
				{filterAboveAverage && <TutorOrgComponent />}
				<TutorListComponent
					LanguageFilter={selectedLanguages}
					CountryFilter={selectedCountries}
					RatingFilter={selectedRating}
					SubjectFilter={selectedSubjects}
					OrganizationFilter={selectedOrganizations}
					QualificationFilter={selectedQualifications}
					AboveAverageFilter={filterAboveAverage}
				/>
			</div>
		</>
	);
}
