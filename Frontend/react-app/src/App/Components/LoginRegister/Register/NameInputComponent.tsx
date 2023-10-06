import InputComponent from '../InputComponent';

export default function NameInputComponent() {
	return (
		<div className="d-flex bd-highlight">
			<div className="p-2 flex-fill bd-highlight">
				<InputComponent
					Label="First Name"
					Id="FirstNameInput"
					Type="text"
					Name="first_name"
					Placeholder="Enter First Name"
					MaxLength={32}
					Hint="First Name cannot be empty"
				/>
			</div>
			<div className="p-2 flex-fill bd-highlight">
				<InputComponent
					Label="Last Name"
					Id="LastNameInput"
					Type="text"
					Name="last_name"
					Placeholder="Enter Last Name"
					MaxLength={32}
					Hint="Last Name cannot be empty"
				/>
			</div>
		</div>
	);
}
