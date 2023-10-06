import InputComponent from '../InputComponent';

export default function PhoneNumberInputComponent() {
	return (
		<InputComponent
			Label="Phone Number"
			Id="InputPhoneNumber"
			Type="tel"
			Name="phone_number"
			Placeholder="Enter Phone Number"
			MaxLength={16}
			Hint="Phone Number cannot be empty"
		/>
	);
}
