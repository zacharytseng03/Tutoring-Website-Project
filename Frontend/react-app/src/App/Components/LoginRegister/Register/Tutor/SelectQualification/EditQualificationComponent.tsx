import { useState, useEffect } from 'react';
import AddQualificationComponent from './AddQualificationComponent';
import DeleteQualificationComponent from './DeleteQualificationComponent';
import Qualification from '../../../../../Models/Qualification.Model';
import apiCall from '../../../../../Utility/MakeRequest';

interface EditQualificationProp {
	AddedQualifications: string[];
	onQualificationsUpdated(updatedQualifications: string[]): void;
}

export default function EditQualificationComponent(
	prop: EditQualificationProp
) {
	const [qualifications, setQualifications] = useState<string[]>();
	const [qualificationError, setQualificationError] = useState('');
	const [qualificationLoading, setQualificationLoading] = useState(false);

	useEffect(() => {
		getQualifications();
	}, []);

	const getQualifications = async () => {
		setQualificationLoading(true);
		const response = await apiCall('get', 'qualifications');
		if (response.error) {
			setQualificationError(response.error);
		} else {
			const data: Qualification[] = response.response;
			setQualificationError('');
			setQualifications(data.map((qualification) => qualification.name));
		}
		setQualificationLoading(false);
	};

	return (
		<div>
			<label>Qualifications (Optional)</label>
			{prop.AddedQualifications.map((addedQualification, index) => (
				<DeleteQualificationComponent
					key={addedQualification}
					Index={index + 1}
					Qualification={addedQualification}
					onQualificationDeleted={(deletedQualification) => {
						const updatedQualifications = prop.AddedQualifications.filter(
							(qualification) => qualification != deletedQualification
						);
						prop.onQualificationsUpdated(updatedQualifications);
					}}
				/>
			))}
			<AddQualificationComponent
				Qualifications={(qualifications || []).filter(
					(qualification) =>
						!prop.AddedQualifications.some(
							(addedQualification) => addedQualification == qualification
						)
				)}
				QualificationError={qualificationError}
				LoadingQualification={qualificationLoading}
				addQualification={(addedQualification) => {
					const updatedQualifications = prop.AddedQualifications.slice(0);
					updatedQualifications.push(addedQualification);
					prop.onQualificationsUpdated(updatedQualifications);
				}}
			/>
		</div>
	);
}
