import { useState } from 'react';
import ReactStars from 'react-rating-star-with-type';
import LoadingComponent from '../../../../../LoadingComponent';
import Review from '../../../../../../Models/Review.Model';
import apiCall from '../../../../../../Utility/MakeRequest';

interface CreateReviewProp {
	Email: string;
	onReviewCreated(review: Review): void;
}

export default function CreateReviewComponent(prop: CreateReviewProp) {
	const [starRatings, setStarRatings] = useState(0);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		createReview(starRatings, event.currentTarget.content.value);
	};

	const createReview = async (rating: number, content?: string) => {
		const response = await apiCall('post', `/tutor/${prop.Email}/reviews`, {
			rating: rating,
			content: content,
		});
		if (response.error) {
			setSuccess(false);
			setError(response.error);
		} else {
			const review: Review = response.response;
			prop.onReviewCreated(review);
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
						<label htmlFor="Content">Add Review Message</label>
						<textarea
							className="form-control mt-2"
							name="content"
							id="Content"
							rows={4}
							placeholder="Type review message here. Max character length is 512."
							maxLength={512}
						/>
						<ReactStars
							size={40}
							isEdit={true}
							count={7}
							onChange={(rating: number) => {
								setStarRatings(rating);
							}}
						/>
						<button type="submit" className="btn btn-primary w-100 mt-3">
							Create Review
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
