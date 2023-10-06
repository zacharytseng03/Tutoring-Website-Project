import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarComponent from '../Components/NavBarComponent';
import TabsComponent from '../Components/TabsComponent';
import LoadingComponent from '../Components/LoadingComponent';
import ProfileComponent from '../Components/Student/Profile/ProfileComponent';
import TutorsComponent from '../Components/Student/Tutor/TutorsComponent';
import RequestsComponent from '../Components/Student/Requests/RequestsComponent';
import SessionsComponent from '../Components/Student/Sessions/SessionsComponent';
import Student from '../Models/Student.Model';
import apiCall from '../Utility/MakeRequest';

export default function StudentPage() {
	const navigate = useNavigate();

	const [student, setStudent] = useState<Student>();
	const [isLoading, setLoading] = useState(true);
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		const loggedInEmail = localStorage.getItem('email');
		if (!loggedInEmail) {
			navigate('/login');
		} else {
			getStudent(loggedInEmail);
		}
	}, []);

	const getStudent = async (email: string) => {
		const response = await apiCall('get', `student/${email}`);
		if (response.error) {
			localStorage.removeItem('email');
		} else {
			setStudent(response.response);
		}
		setLoading(false);
	};

	return (
		<>
			{isLoading ? (
				<LoadingComponent />
			) : student ? (
				<>
					<NavBarComponent
						Student={`${student.firstname} ${student.lastname}`}
					/>
					<TabsComponent
						Tabs={['Profile', 'Requests', 'Sessions', 'Tutors']}
						SelectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
					/>
					{(selectedTab === 0 && <ProfileComponent Student={student} />) ||
						(selectedTab == 1 && <RequestsComponent Email={student.email} />) ||
						(selectedTab == 2 && <SessionsComponent Email={student.email} />) ||
						(selectedTab == 3 && <TutorsComponent />)}
				</>
			) : (
				<>
					<NavBarComponent />
					<h1>Student Not Found</h1>
				</>
			)}
		</>
	);
}
