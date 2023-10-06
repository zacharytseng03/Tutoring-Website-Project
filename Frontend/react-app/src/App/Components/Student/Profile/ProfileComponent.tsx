import DeleteProfileComponent from './DeleteProfileComponent';
import EditableInputComponent from './EditableInputComponent';
import Student from '../../../Models/Student.Model';

interface ProfileProp {
	Student: Student;
}

export default function ProfileComponent(prop: ProfileProp) {
	return (
		<div className="ms-3 me-3">
			<EditableInputComponent
				Student={prop.Student}
				StudentEmail={prop.Student.email}
				Field="First Name"
				Type="text"
				Text={prop.Student.firstname}
				Name="firstname"
				MaxLength={32}
			/>
			<EditableInputComponent
				StudentEmail={prop.Student.email}
				Field="Last Name"
				Type="text"
				Text={prop.Student.lastname}
				Name="lastname"
				MaxLength={32}
			/>
			<EditableInputComponent
				StudentEmail={prop.Student.email}
				Field="Email"
				Type="email"
				Text={prop.Student.email}
				Name="email"
				MaxLength={64}
			/>
			<EditableInputComponent
				StudentEmail={prop.Student.email}
				Field="Phone Number"
				Type="tel"
				Text={prop.Student.phonenum}
				Name="phonenum"
				MaxLength={16}
			/>
			<DeleteProfileComponent email={prop.Student.email} />
		</div>
	);
}
