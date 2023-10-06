import { useEffect, useState } from 'react';
import TutorItemComponent from './TutorItem/TutorItemComponent';
import Organization from '../../../../Models/Organization.Model';
import Qualification from '../../../../Models/Qualification.Model';
import Subject from '../../../../Models/Subject.Model';
import Tutor from '../../../../Models/Tutor.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface TutorListProp {
	LanguageFilter: string[];
	CountryFilter: string[];
	RatingFilter: number | undefined;
	SubjectFilter: Subject[];
	OrganizationFilter: Organization[];
	QualificationFilter: Qualification[];
	AboveAverageFilter: boolean;
}

export default function TutorListComponent(prop: TutorListProp) {
	const [tutors, setTutors] = useState<Tutor[]>([]);

	const getTutors = async () => {
		const response = await apiCall('get', 'tutors', undefined, {
			languages: prop.LanguageFilter,
			countries: prop.CountryFilter,
			rating: prop.RatingFilter,
			subjects: prop.SubjectFilter.map(
				(subject) => `${subject.course}-${subject.level}`
			),
			organizations: prop.OrganizationFilter.map(
				(organization) => organization.orgid
			),
			qualifications: prop.QualificationFilter.map(
				(qualification) => qualification.name
			),
			above_average: prop.AboveAverageFilter ? true : undefined,
		});
		if (!response.error) {
			const data: Tutor[] = response.response;
			setTutors(data);
		}
	};

	useEffect(() => {
		getTutors();
	}, [
		prop.LanguageFilter,
		prop.CountryFilter,
		prop.RatingFilter,
		prop.SubjectFilter,
		prop.OrganizationFilter,
		prop.QualificationFilter,
		prop.AboveAverageFilter,
	]);

	return (
		<div className="w-75 mx-auto my-5">
			<h1>Tutors</h1>
			<div className="container">
				{tutors.length === 0 ? (
					<h1>No Tutors Matching Requests Found</h1>
				) : (
					tutors.map((tutor) => (
						<TutorItemComponent Tutor={tutor} key={tutor.email} />
					))
				)}
			</div>
		</div>
	);
}
