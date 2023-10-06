import { useState } from 'react';
import Request from '../../../Models/Request.Model';
import apiCall from '../../../Utility/MakeRequest';

interface RequestComponentProp {
	Request: Request;
	Email: string;
}

export default function RequestComponent(prop: RequestComponentProp) {
	const [isOpen, setOpen] = useState(prop.Request.open);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const onClick = () => {
		setLoading(true);
		closeRequest();
	};

	const closeRequest = async () => {
		const response = await apiCall(
			'patch',
			`requests/${prop.Request.requestid}`
		);
		if (response.error) {
			setError(response.error);
		} else if (response.status == 200) {
			setOpen(false);
			setError('');
			prop.Request.open = false;
		} else {
			setError('An error occurred and the request could not be updated.');
		}
		setLoading(false);
	};

	return (
		<div className="container w-100 border border-primary border border-5 my-2">
			<h3>Contact at {prop.Email}</h3>
			<div className="d-flex flex-row">
				<h4 className="text-secondary">
					Status:{' '}
					{isOpen ? (
						<span className="text-success fw-bold">Open</span>
					) : (
						<span className="text-danger fw-bold">Closed</span>
					)}
				</h4>

				{isLoading ? (
					<div className="spinner-border text-primary ms-3" />
				) : (
					isOpen && (
						<button
							type="button"
							className="btn btn-danger ms-3"
							onClick={onClick}>
							Close
						</button>
					)
				)}
			</div>
			{error && (
				<div>
					<h4>Error:</h4>
					<p className="container w-100 border border-dark my-2 text-danger">
						{error}
					</p>
				</div>
			)}
			<h5>
				Date Created:
				<span className="fst-italic">
					{' ' + new Date(prop.Request.datecreated).toDateString()}
				</span>
			</h5>
			<p className="container w-100 border border-dark my-2">
				{prop.Request.content}
			</p>
		</div>
	);
}
