import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginStudentComponent from '../Components/LoginRegister/Login/LoginStudentComponent';

export default function LoginPage() {
	const navigate = useNavigate();

	useEffect(() => {
		const loggedInEmail = localStorage.getItem('email');
		if (loggedInEmail) {
			navigate('/student');
		}
	}, []);

	return (
		<div className="container">
			<div className="d-flex justify-content-between my-3">
				<a className="nav-link" href="/">
					Home
				</a>
				<h3>Student</h3>
				<a className="nav-link" href="register">
					Register
				</a>
			</div>
			<h1 className="d-flex justify-content-center">Log In</h1>
			<div className="w-50 col-md-8 mx-auto border p-3">
				<LoginStudentComponent />
			</div>
		</div>
	);
}
