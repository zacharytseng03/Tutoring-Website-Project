import { useState } from 'react';
import LoadingComponent from '../../LoadingComponent';
import Assignment from '../../../Models/Assignment.Model';
import apiCall from '../../../Utility/MakeRequest';

interface AssignmentProp {
	Assignment: Assignment;
}

export default function AssignmentComponent(prop: AssignmentProp) {
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		updateResponse(event.currentTarget.response.value);
	};

	const updateResponse = async (assignmentResponse: string) => {
		const response = await apiCall(
			'patch',
			`assignment/${prop.Assignment.assignmentname}`,
			{
				response: assignmentResponse,
			}
		);
		if (response.error) {
			setSuccess(false);
			setError(response.error);
		} else {
			setSuccess(true);
			setError('');
		}
		setLoading(false);
	};

	return (
		<div className="container">
			<h3>{prop.Assignment.assignmentname}</h3>
			<h5>
				Deadline:
				<span className="fst-italic">
					{' ' + new Date(prop.Assignment.deadline)}
				</span>
			</h5>
			<p>{prop.Assignment.instruction}</p>
			<h5>
				Grade:{' '}
				{prop.Assignment.grade ? prop.Assignment.grade : 'No Grade Assigned'}
			</h5>
			<form onSubmit={handleSubmit}>
				{isLoading ? (
					<LoadingComponent />
				) : (
					<div className="form-group">
						<label htmlFor="Response">Add Response</label>
						<textarea
							className="form-control mt-2"
							name="response"
							id="Response"
							value={prop.Assignment.response}
							rows={4}
							placeholder="Type request message here. Max character length is 512."
							maxLength={512}
						/>
						<button type="submit" className="btn btn-primary w-100 mt-3">
							Update Response
						</button>
					</div>
				)}
				{error && (
					<div>
						<h4>Error:</h4>
						<p className="container w-100 border border-dark my-2 text-danger">
							{error}
						</p>
					</div>
				)}
				{success && (
					<div>
						<h4>Success:</h4>
						<p className="container w-100 border border-dark my-2 text-success">
							Request Succesfully Created
						</p>
					</div>
				)}
			</form>
		</div>
	);
}
