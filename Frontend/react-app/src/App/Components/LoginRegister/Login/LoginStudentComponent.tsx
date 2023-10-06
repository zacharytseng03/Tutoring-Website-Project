import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../../../Utility/MakeRequest';
import EmailInputComponent from '../EmailInputComponent';
import PasswordInputComponent from '../PasswordInputComponent';
import SubmitButtonComponent from '../SubmitButtonComponent';

export default function LoginStudentComponent() {
	const navigate = useNavigate();

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const email = event.currentTarget.email.value;
		const password = event.currentTarget.password.value;
		if (!email) {
			setError('Email cannot be empty');
		} else if (!password) {
			setError('Password cannot be empty');
		} else {
			setError('');
			setLoading(true);
			login(email, password);
		}
	};

	const login = async (email: string, password: string) => {
		const response = await apiCall('post', 'login', {
			email: email,
			password: password,
		});
		if (response.error) {
			setError(response.error);
		} else {
			localStorage.setItem('email', email);
			navigate('/student');
		}
		setLoading(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<EmailInputComponent />
				<PasswordInputComponent />
				<SubmitButtonComponent
					Text="Log In"
					Loading={isLoading}
					Error={error}
				/>
			</form>
		</>
	);
}
