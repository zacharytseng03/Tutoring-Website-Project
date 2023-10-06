import { useState } from 'react';

export default function SummaryInputComponent() {
	const [showHint, setShowHint] = useState(true);

	return (
		<div className="form-group">
			<label htmlFor="InputSummary">Summary</label>
			<textarea
				className="form-control mt-2"
				id="InputSummary"
				name="summary"
				placeholder="Enter Summary"
				maxLength={512}
				aria-describedby="InputSummaryHint"
				onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
					setShowHint(event.currentTarget.value.length === 0);
				}}
			/>
			{showHint && (
				<small id="InputSummaryHint" className="form-text text-danger">
					Summary cannot be empty
				</small>
			)}
		</div>
	);
}
