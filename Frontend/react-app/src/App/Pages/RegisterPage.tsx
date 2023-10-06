import { useState } from 'react';
import TabsComponent from '../Components/TabsComponent';
import RegisterStudentComponent from '../Components/LoginRegister/Register/Student/RegisterStudentComponent';
import RegisterTutorComponent from '../Components/LoginRegister/Register/Tutor/RegisterTutorComponent';

export default function RegisterPage() {
	const [selectedTab, setSelectedTab] = useState(0);

	return (
		<div className="container">
			<div className="d-flex justify-content-between my-3">
				<a className="nav-link" href="/">
					Home
				</a>
				<h3>Register</h3>
				<a className="nav-link" href="login">
					Log In
				</a>
			</div>
			<div className="w-50 col-md-8 mx-auto">
				<TabsComponent
					Tabs={['Student', 'Tutor']}
					SelectedTab={selectedTab}
					setSelectedTab={setSelectedTab}
				/>
				<div className="border p-3">
					{selectedTab ? (
						<RegisterTutorComponent />
					) : (
						<RegisterStudentComponent />
					)}
				</div>
			</div>
		</div>
	);
}
