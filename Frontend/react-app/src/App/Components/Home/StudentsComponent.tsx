import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import apiCall from '../../Utility/MakeRequest';

interface ProjectedStudent {
	email: string;
	firstname: string;
	lastname: string;
}

export default function StudentsComponent() {
	const [students, setStudents] = useState<ProjectedStudent[]>([]);

	useEffect(() => {
		getStudents();
	}, []);

	const getStudents = async () => {
		const response = await apiCall('get', 'students');
		if (!response.error) {
			const data: ProjectedStudent[] = response.response;
			setStudents(data);
		}
	};

	return (
		<Table striped bordered hover className="mt-3">
			<thead>
				<tr>
					<th>Email</th>
					<th>First Name</th>
					<th>Last Name</th>
				</tr>
			</thead>
			{students.map((student) => (
				<>
					<tbody key={student.email}>
						<tr>
							<th>{student.email}</th>
							<th>{student.firstname}</th>
							<th>{student.lastname}</th>
						</tr>
					</tbody>
				</>
			))}
		</Table>
	);
}
