import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SchoolInputComponent from './SchoolInputComponent';
import AddressInputComponent from '../AddressInputComponent';
import NameInputComponent from '../NameInputComponent';
import PhoneNumberInputComponent from '../PhoneNumberInputComponent';
import EditLanguageComponent from '../SelectLanguage/EditLanguageComponent';
import EmailInputComponent from '../../EmailInputComponent';
import PasswordInputComponent from '../../PasswordInputComponent';
import SubmitButtonComponent from '../../SubmitButtonComponent';
import Language from '../../../../Models/Language.Model';
import PostLocation from '../../../../Models/PostLocation.Model';
import apiCall from '../../../../Utility/MakeRequest';

export default function RegisterStudentComponent() {
	const navigate = useNavigate();

	const [languages, setLanguages] = useState<Language[]>([]);

	const [country, setCountry] = useState('');
	const [region, setRegion] = useState('');
	const [city, setCity] = useState('');
	const [street, setStreet] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [houseNumber, setHouseNumber] = useState(-1);

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const email = event.currentTarget.email.value;
		const password = event.currentTarget.password.value;
		const firstName = event.currentTarget.first_name.value;
		const lastName = event.currentTarget.last_name.value;
		const phoneNum = event.currentTarget.phone_number.value;
		const location: PostLocation = {
			country: country,
			region: region,
			city: city,
			street: street,
			postal_code: postalCode,
			house_number: houseNumber,
		};
		const school = event.currentTarget.school.value;
		const gradeLevel = school ? event.currentTarget.grade_level.value : null;
		if (!email) {
			setError('Email cannot be empty');
		} else if (!password) {
			setError('Password cannot be empty');
		} else if (!firstName) {
			setError('First Name cannot be empty');
		} else if (!lastName) {
			setError('Last Name cannot be empty');
		} else if (!phoneNum) {
			setError('Phone Number cannot be empty');
		} else if (languages.length === 0) {
			setError('Languages cannot be empty');
		} else if (!location.country) {
			setError('Country cannot be empty');
		} else if (!location.region) {
			setError('Region cannot be empty');
		} else if (!location.city) {
			setError('City cannot be empty');
		} else if (!location.street) {
			setError('Street cannot be empty');
		} else if (!location.postal_code) {
			setError('Postal Code cannot be empty');
		} else if (!location.house_number || location.house_number < 0) {
			setError('House Number cannot be empty');
		} else {
			setError('');
			setLoading(true);
			registerStudent(
				email,
				password,
				firstName,
				lastName,
				phoneNum,
				languages,
				location,
				school,
				gradeLevel
			);
		}
	};

	const registerStudent = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		phoneNum: string,
		languages: Language[],
		location: PostLocation,
		school?: string,
		gradeLevel?: string
	) => {
		const response = await apiCall('post', 'student', {
			email: email,
			password: password,
			first_name: firstName,
			last_name: lastName,
			phone_number: phoneNum,
			languages: languages,
			location: location,
			school: school,
			grade_level: gradeLevel,
		});
		response.error ? setError(response.error) : navigate('/login');
		setLoading(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<EmailInputComponent />

				<PasswordInputComponent />

				<NameInputComponent />

				<PhoneNumberInputComponent />

				<EditLanguageComponent
					AddedLanguages={languages}
					onLanguagesUpdated={(languages: Language[]) => {
						setLanguages(languages);
					}}
				/>

				<AddressInputComponent
					updateCountry={(country: string) => {
						setCountry(country);
					}}
					updateRegion={(region: string) => {
						setRegion(region);
					}}
					updateCity={(city: string) => {
						setCity(city);
					}}
					updateStreet={(street: string) => {
						setStreet(street);
					}}
					updatePostalCode={(postalCode: string) => {
						setPostalCode(postalCode);
					}}
					updateHouseNumber={(houseNumber: number) => {
						setHouseNumber(houseNumber);
					}}
				/>
				{(!country ||
					!region ||
					!city ||
					!street ||
					!postalCode ||
					!houseNumber ||
					houseNumber < 0) && (
					<small className="form-text text-danger">
						{!country
							? 'A country must be selected'
							: !region
							? 'A region must be selected'
							: !city
							? 'A city must be selected'
							: !street
							? 'Street cannot be empty'
							: !postalCode
							? 'Postal Code cannot be empty'
							: !houseNumber || houseNumber < 0
							? 'House Number cannot be empty'
							: 'Missing Location'}
					</small>
				)}

				<SchoolInputComponent />

				<SubmitButtonComponent
					Text="Register"
					Loading={isLoading}
					Error={error}
				/>
			</form>
		</>
	);
}
