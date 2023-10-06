import { useState } from 'react';
import Student from '../../../Models/Student.Model';
import apiCall from '../../../Utility/MakeRequest';

interface EditableInputProp {
	Student?: Student;
	StudentEmail: string;
	Field: string;
	Type: string;
	Text: string;
	Name: string;
	MaxLength: number;
}

export default function EditableInputComponent(prop: EditableInputProp) {
	const [inputValue, setInputValue] = useState(prop.Text);
	const [isInputDisabled, disableInput] = useState(true);
	const [isEditBtnDisabled, disableEditBtn] = useState(false);
	const [isSaveBtnDisabled, disableSaveBtn] = useState(true);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const onInputChanged = (input: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(input.currentTarget.value);
		disableSaveBtn(input.currentTarget.value === prop.Text);
	};

	const onEditBtnClicked = () => {
		disableInput(false);
		disableEditBtn(true);
		disableSaveBtn(inputValue === prop.Text);
	};

	const onSaveBtnClicked = () => {
		disableInput(true);
		disableEditBtn(false);
		disableSaveBtn(true);
		setLoading(true);
		setError('');
		setSuccess(false);
		saveChanges();
	};

	const saveChanges = async () => {
		const response = await apiCall('patch', `student/${prop.StudentEmail}`, {
			[prop.Name]: inputValue,
		});

		if (response.error) {
			setError(response.error);
		} else if (response.status == 200) {
			setSuccess(true);
			if (prop.Student) prop.Student.firstname = inputValue;
		} else {
			setError('An error occurred and the student could not be updated.');
		}
		setLoading(false);
	};

	return (
		<>
			<div className="container">
				<h2>{prop.Field}</h2>
				<div className="row">
					<input
						type={prop.Text}
						className="form-control col-sm"
						value={inputValue}
						onChange={onInputChanged}
						disabled={isInputDisabled}
						maxLength={prop.MaxLength}
					/>
					<button
						type="button"
						className="btn btn-primary ms-2 col-sm"
						onClick={onEditBtnClicked}
						disabled={isEditBtnDisabled}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-pen"
							viewBox="0 0 16 16">
							<path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
						</svg>
						{' Edit '}
					</button>
					{isLoading ? (
						<div className="spinner-border text-primary" />
					) : (
						<button
							type="button"
							className="btn btn-primary ms-2 col-sm"
							disabled={isSaveBtnDisabled}
							onClick={onSaveBtnClicked}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-save"
								viewBox="0 0 16 16">
								<path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
							</svg>
							{' Save '}
						</button>
					)}
					{success && (
						<div className="col-1">
							<h4>Saved</h4>
						</div>
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
			</div>
		</>
	);
}
