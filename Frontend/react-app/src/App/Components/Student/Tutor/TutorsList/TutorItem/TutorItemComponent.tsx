import CollapseLanguageSubjectQualificationComponent from './CollapseLanguageSubjectQualificationComponent';
import CollapseLocationOrganizationComponent from './CollapseLocationOrganizationComponent';
import CollapseReviewComponent from './Review/CollapseReviewComponent';
import Tutor from '../../../../../Models/Tutor.Model';

interface TutorItemProp {
	Tutor: Tutor;
}

export default function TutorItemComponent(prop: TutorItemProp) {
	return (
		<div className="container w-100 border border-primary border border-5 my-2">
			<h3>
				Name: {prop.Tutor.firstname} {prop.Tutor.lastname}
			</h3>
			<h5>Email: {prop.Tutor.email}</h5>
			<h5>Phone Number: {prop.Tutor.phonenum}</h5>
			<h5>
				Date Created:
				<span className="fst-italic">
					{' ' + new Date(prop.Tutor.datejoined).toDateString()}
				</span>
			</h5>
			<h5>Availability: {prop.Tutor.availability}</h5>
			<h5>Pay Rate: ${prop.Tutor.hourlyrate}/hr</h5>
			<h5>
				Average Rating:{' '}
				{prop.Tutor.averagerating
					? prop.Tutor.averagerating + '/7'
					: 'No Rating'}
			</h5>
			<p className="border border-primary">{prop.Tutor.summary}</p>
			<CollapseLocationOrganizationComponent
				Location={prop.Tutor.location}
				Organization={prop.Tutor.organization}
			/>
			<CollapseLanguageSubjectQualificationComponent Email={prop.Tutor.email} />
			<CollapseReviewComponent Email={prop.Tutor.email} />
		</div>
	);
}
