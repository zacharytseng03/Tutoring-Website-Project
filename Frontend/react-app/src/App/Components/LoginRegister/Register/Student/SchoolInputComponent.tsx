import { useState } from 'react';

export default function SchoolInputComponent() {
	const [school, setSchool] = useState('');

	return (
		<>
			<div className="form-group">
				<label htmlFor="InputSchool">School (Optional)</label>
				<input
					type="text"
					className="form-control mt-2"
					id="InputSchool"
					name="school"
					placeholder="Enter School"
					maxLength={64}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setSchool(event.currentTarget.value);
					}}
				/>
			</div>
			{school && (
				<div className="form-group">
					<label htmlFor="InputGradeLevel">GradeLevel (Optional)</label>
					<input
						type="text"
						className="form-control mt-2"
						id="InputGradeLevel"
						name="grade_level"
						placeholder="Enter Grade Level"
						maxLength={16}
					/>
				</div>
			)}
		</>
	);
}
