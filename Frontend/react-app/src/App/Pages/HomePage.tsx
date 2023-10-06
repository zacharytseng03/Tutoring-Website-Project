import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarComponent from '../Components/NavBarComponent';
import TabsComponent from '../Components/TabsComponent';
import TutorsComponent from '../Components/Student/Tutor/TutorsComponent';
import StudentsComponent from '../Components/Home/StudentsComponent';
import SelectionComponent from '../Components/Home/SelectionComponent';

export default function HomePage() {
	const navigate = useNavigate();

	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		const loggedInUser = localStorage.getItem('email');
		if (loggedInUser) {
			navigate('/student');
		}
	}, []);

	return (
		<div className="vh-100">
			<NavBarComponent />
			<TabsComponent
				Tabs={['Students', 'Tutors', 'Miscallaneous']}
				SelectedTab={selectedTab}
				setSelectedTab={setSelectedTab}
			/>
			{(selectedTab == 0 && <StudentsComponent />) ||
				(selectedTab == 1 && <TutorsComponent />) ||
				(selectedTab == 2 && <SelectionComponent />)}
		</div>
	);
}
