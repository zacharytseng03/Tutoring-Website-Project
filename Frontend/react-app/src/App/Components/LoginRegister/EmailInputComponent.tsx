import InputComponent from './InputComponent';

export default function EmailInputComponent() {
	return (
		<InputComponent
			Label="Email Address"
			Id="EmailInput"
			Type="email"
			Name="email"
			Placeholder="Enter Email"
			MaxLength={64}
			Hint="Email Address cannot be empty"
		/>
	);
}
