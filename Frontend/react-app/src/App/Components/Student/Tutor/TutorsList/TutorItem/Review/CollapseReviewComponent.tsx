import { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import ReactStars from 'react-rating-star-with-type';
import CreateReviewComponent from './CreateReviewComponent';
import LoadingComponent from '../../../../../LoadingComponent';
import Review from '../../../../../../Models/Review.Model';
import apiCall from '../../../../../../Utility/MakeRequest';

interface CollapseReviewProp {
	Email: string;
}

export default function CollapseReviewComponent(prop: CollapseReviewProp) {
	const [showReviews, setShowReviews] = useState(false);
	const [reviewsError, setReviewsError] = useState('');
	const [isReviewsLoading, setReviewsLoading] = useState(false);
	const [reviews, setReviews] = useState<Review[]>();

	const onReviewCreated = (review: Review) => {
		if (reviews) {
			const updatedReviews = reviews.slice(0);
			updatedReviews.unshift(review);
			setReviews(updatedReviews);
		}
	};

	const getReviews = async () => {
		if (!showReviews) {
			setShowReviews(true);
			if (reviews === undefined) {
				setReviewsLoading(true);
				const response = await apiCall('get', `/tutor/${prop.Email}/reviews`);
				if (response.error) {
					setReviewsError(response.error);
				} else {
					setReviews(response.response);
					setReviewsError('');
				}
				setReviewsLoading(false);
			}
		} else {
			setShowReviews(false);
		}
	};

	return (
		<>
			<div className="row">
				<button className="btn btn-primary m-2 col" onClick={getReviews}>
					Reviews
				</button>
			</div>
			<div className="row">
				<div className="col">
					<Collapse in={showReviews}>
						<div className="card card-body my-2">
							{isReviewsLoading ? (
								<LoadingComponent />
							) : reviewsError ? (
								<h3>{reviewsError}</h3>
							) : !reviews ? (
								<h3>An Error Occurred Retrieving Reviews</h3>
							) : (
								<div className="container">
									<CreateReviewComponent
										Email={prop.Email}
										onReviewCreated={onReviewCreated}
									/>
									{reviews.length === 0 ? (
										<h1>No Reviews</h1>
									) : (
										reviews.map((review) => (
											<div
												className="container border border-3 border border-primary my-1"
												key={review.reviewid}>
												<div>
													Rating:{' '}
													<ReactStars
														size={40}
														count={7}
														value={review.rating}
													/>
												</div>
												{review.recommendation ? (
													<h3 className="font-weight-bold text-success">
														Recommended
													</h3>
												) : (
													<h3 className="font-weight-bold text-danger">
														Not Recommended
													</h3>
												)}
												<p className="container border border-3 border border-success">
													{review.content
														? review.content
														: 'No content exists'}
												</p>
											</div>
										))
									)}
								</div>
							)}
						</div>
					</Collapse>
				</div>
			</div>
		</>
	);
}
