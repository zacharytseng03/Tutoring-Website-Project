import { useState } from 'react';
import LoadingComponent from '../../LoadingComponent';
import apiCall from '../../../Utility/MakeRequest';

interface CreateRequestProp {
	Email: string;
	onRequestCreated(): void;
}

export default function CreateRequestComponent(prop: CreateRequestProp) {
	const [isLoading, setLoading] = useState(false);
	const [isBtnDisabled, setBtnDisabled] = useState(true);
	const [showHint, setShowHint] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setBtnDisabled(true);
		setLoading(true);
		createRequest(event.currentTarget.content.value);
	};

	const createRequest = async (content: string) => {
		const response = await apiCall('post', `student/${prop.Email}/requests`, {
			content: content,
		});
		if (response.error) {
			setSuccess(false);
			setError(response.error);
		} else {
			prop.onRequestCreated();
			setSuccess(true);
			setError('');
		}
		setLoading(false);
	};

	return (
		<div className="container w-100 my-3">
			<form onSubmit={handleSubmit}>
				{isLoading ? (
					<LoadingComponent />
				) : (
					<div className="form-group">
						<label htmlFor="Content">Add Request Message</label>
						<textarea
							className="form-control mt-2"
							name="content"
							id="Content"
							rows={4}
							placeholder="Type request message here. Max character length is 512."
							maxLength={512}
							onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
								setShowHint(event.currentTarget.value.trim().length === 0);
								setBtnDisabled(event.currentTarget.value.trim().length === 0);
							}}
						/>

						{showHint && (
							<small className="form-text text-danger">
								Request cannot be empty
							</small>
						)}
						<button
							type="submit"
							className="btn btn-primary w-100 mt-3"
							disabled={isBtnDisabled}>
							Create Request
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
