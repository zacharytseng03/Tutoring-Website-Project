import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import apiCall from '../../../Utility/MakeRequest';

interface TutorOrg {
	email: string;
	tutoraverage: number;
	organizationaverage: number;
}

export default function TutorOrgComponent() {
	const [tutorOrgs, setTutorOrgs] = useState<TutorOrg[]>([]);

	useEffect(() => {
		getTutorOrgs();
	}, []);

	const getTutorOrgs = async () => {
		const response = await apiCall('get', 'tutor_ratings');
		if (!response.error) {
			const data: TutorOrg[] = response.response;
			setTutorOrgs(data);
		}
	};

	return (
		<Table striped bordered hover className="mt-3">
			<thead>
				<tr>
					<th>Email</th>
					<th>Tutor Average</th>
					<th>Organization Average</th>
				</tr>
			</thead>
			{tutorOrgs.map((tutorOrg) => (
				<>
					<tbody key={tutorOrg.email}>
						<tr>
							<th>{tutorOrg.email}</th>
							<th>{tutorOrg.tutoraverage}</th>
							<th>{tutorOrg.organizationaverage}</th>
						</tr>
					</tbody>
				</>
			))}
		</Table>
	);
}
