import InputComponent from '../../InputComponent';

export default function AvailabilityInputComponent() {
	return (
		<InputComponent
			Label="Availability"
			Id="InputAvailability"
			Type="text"
			Name="availability"
			Placeholder="Enter Availability"
			MaxLength={64}
			Hint="Availability cannot be empty"
		/>
	);
}
