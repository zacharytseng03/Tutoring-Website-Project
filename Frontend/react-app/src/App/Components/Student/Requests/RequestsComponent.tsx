import { useState, useEffect } from 'react';
import CreateRequestComponent from './CreateRequestComponent';
import RequestComponent from './RequestComponent';
import LoadingComponent from '../../LoadingComponent';
import Request from '../../../Models/Request.Model';
import apiCall from '../../../Utility/MakeRequest';

interface RequestsProp {
	Email: string;
}

export default function RequestsComponent(prop: RequestsProp) {
	const [requests, setRequests] = useState<Request[]>();
	const [requestLoading, setRequestLoading] = useState(false);
	const [requestError, setRequestError] = useState('');

	useEffect(() => {
		getRequests();
	}, []);

	const getRequests = async () => {
		setRequestLoading(true);
		const response = await apiCall('get', `student/${prop.Email}/requests`);
		if (response.error) {
			setRequestError(response.error);
		} else {
			const data: Request[] = response.response;
			setRequestError('');
			setRequests(data);
		}
		setRequestLoading(false);
	};

	const onRequestCreated = () => {
		getRequests();
	};

	return (
		<>
			<CreateRequestComponent
				Email={prop.Email}
				onRequestCreated={onRequestCreated}
			/>
			<div className="container w-100 border border-secondary my-3">
				{requestLoading ? (
					<LoadingComponent />
				) : requestError ? (
					<h1>{requestError}</h1>
				) : !requests ? (
					<h1>Some Error Occurred</h1>
				) : requests.length === 0 ? (
					<h1>No Requests Made</h1>
				) : (
					requests.map((request) => (
						<RequestComponent
							Request={request}
							Email={prop.Email}
							key={request.requestid}
						/>
					))
				)}
			</div>
		</>
	);
}
