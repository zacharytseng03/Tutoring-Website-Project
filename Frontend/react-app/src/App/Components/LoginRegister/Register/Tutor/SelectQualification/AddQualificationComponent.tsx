import { useState, createRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import DropDownComponent from '../../DropDownComponent';
import Option from '../../../../../Models/Miscallaneous/Option.Model';

interface AddQualificationProp {
	Qualifications: string[];
	QualificationError: string;
	LoadingQualification: boolean;
	addQualification(qualification: string): void;
}

export default function AddQualificationComponent(prop: AddQualificationProp) {
	const [qualification, setQualification] = useState('');
	const [error, setError] = useState('');

	const qualificationRef = createRef<Multiselect>();

	const onSelectQualification = (_: Option[], selectedItem: Option) => {
		setQualification(selectedItem.id as string);
	};

	const onRemoveQualification = () => {
		setQualification('');
	};

	const onAddBtnClicked = () => {
		if (!qualification) {
			setError('A qualification must be selected');
		} else {
			prop.addQualification(qualification);
			qualificationRef.current?.resetSelectedValues();
			setQualification('');
			setError('');
		}
	};

	const qualifications = prop.Qualifications.map((qualification) => ({
		name: qualification,
		id: qualification,
	}));

	return (
		<>
			<div className="row mt-2">
				<div className="col-10">
					<DropDownComponent
						Id="Qualification"
						Items={qualifications}
						Loading={prop.LoadingQualification}
						Error={prop.QualificationError}
						Ref={qualificationRef}
						PlaceHolder="Select Qualification"
						onRemove={onRemoveQualification}
						onSelect={onSelectQualification}
					/>
				</div>
				<div className="col-2">
					<button
						type="button"
						className="btn btn-primary"
						onClick={onAddBtnClicked}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-plus"
							viewBox="0 0 16 16">
							<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
						</svg>
					</button>
				</div>
			</div>
			{error && <h2 className="form-text text-danger mx-auto">{error}</h2>}
		</>
	);
}
