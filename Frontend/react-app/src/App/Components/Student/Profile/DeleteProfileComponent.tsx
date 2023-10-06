import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../../../Utility/MakeRequest';

interface DeleteProfileProp {
	email: string;
}

export default function DeleteProfileComponent(prop: DeleteProfileProp) {
	const navigate = useNavigate();

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const onDeleteBtnClicked = () => {
		setLoading(true);
		deleteProfile();
	};

	const deleteProfile = async () => {
		const response = await apiCall('delete', `student/${prop.email}`);

		if (response.error) {
			setError(response.error);
		} else if (response.status == 200) {
			setError('');
			logOut();
		} else {
			setError('An error occurred and the student could not be deleted.');
		}
		setLoading(false);
	};

	const logOut = () => {
		localStorage.removeItem('email');
		navigate('/login');
	};

	return (
		<>
			{isLoading ? (
				<div className="d-flex justify-content-center spinner-border text-primary my-3 mx-auto" />
			) : (
				<button
					type="button"
					className="btn btn-danger mt-4 w-100"
					onClick={onDeleteBtnClicked}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-trash"
						viewBox="0 0 16 16">
						<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
						<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
					</svg>
					{' Delete Profile '}
				</button>
			)}
			{error && <h1 className="d-flex justify-content-center my-3">{error}</h1>}
		</>
	);
}
