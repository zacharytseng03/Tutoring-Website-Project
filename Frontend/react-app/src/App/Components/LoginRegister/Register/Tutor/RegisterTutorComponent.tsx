import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvailabilityInputComponent from './AvailabilityInputComponent';
import OrganizationDropDownComponent from './OrganizationDropDownComponent';
import SummaryInputComponent from './SummaryInputComponent';
import EditQualificationComponent from './SelectQualification/EditQualificationComponent';
import EditSubjectComponent from './SelectSubject/EditSubjectComponent';
import AddressInputComponent from '../AddressInputComponent';
import NameInputComponent from '../NameInputComponent';
import PhoneNumberInputComponent from '../PhoneNumberInputComponent';
import EditLanguageComponent from '../SelectLanguage/EditLanguageComponent';
import EmailInputComponent from '../../EmailInputComponent';
import SubmitButtonComponent from '../../SubmitButtonComponent';
import Language from '../../../../Models/Language.Model';
import PostLocation from '../../../../Models/PostLocation.Model';
import Subject from '../../../../Models/Subject.Model';
import apiCall from '../../../../Utility/MakeRequest';

export default function RegisterTutorComponent() {
	const navigate = useNavigate();

	const [languages, setLanguages] = useState<Language[]>([]);

	const [country, setCountry] = useState('');
	const [region, setRegion] = useState('');
	const [city, setCity] = useState('');
	const [street, setStreet] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [houseNumber, setHouseNumber] = useState(-1);

	const [orgId, setOrgId] = useState(-1);

	const [subjects, setSubjects] = useState<Subject[]>([]);

	const [qualifications, setQualifications] = useState<string[]>([]);

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const email = event.currentTarget.email.value;
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
		const availability = event.currentTarget.availability.value;
		const summary = event.currentTarget.summary.value;
		if (!email) {
			setError('Email cannot be empty');
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
		} else if (!availability) {
			setError('Availability cannot be empty');
		} else if (!summary) {
			setError('Summary cannot be empty');
		} else if (!orgId || orgId < 0) {
			setError('Organization cannot be empty');
		} else if (subjects.length === 0) {
			setError('Subjects cannot be empty');
		} else {
			setError('');
			setLoading(true);
			registerTutor(
				email,
				firstName,
				lastName,
				phoneNum,
				languages,
				location,
				availability,
				summary,
				orgId,
				subjects,
				qualifications
			);
		}
	};

	const registerTutor = async (
		email: string,
		firstName: string,
		lastName: string,
		phoneNum: string,
		languages: Language[],
		location: PostLocation,
		availability: string,
		summary: string,
		orgId: number,
		subjects: Subject[],
		qualifications?: string[]
	) => {
		const response = await apiCall('post', 'tutor', {
			email: email,
			first_name: firstName,
			last_name: lastName,
			phone_number: phoneNum,
			languages: languages,
			location: location,
			availability: availability,
			summary: summary,
			org_id: orgId,
			subjects: subjects,
			qualifications: qualifications,
		});
		response.error ? setError(response.error) : navigate('/login');
		setLoading(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<EmailInputComponent />

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

				<OrganizationDropDownComponent
					updateOrganization={(orgId: number) => {
						setOrgId(orgId);
					}}
				/>
				{(!orgId || orgId < 0) && (
					<small className="form-text text-danger">Missing Organization</small>
				)}

				<EditSubjectComponent
					AddedSubjects={subjects}
					onSubjectsUpdated={(subjects: Subject[]) => {
						setSubjects(subjects);
					}}
				/>

				<AvailabilityInputComponent />

				<SummaryInputComponent />

				<EditQualificationComponent
					AddedQualifications={qualifications}
					onQualificationsUpdated={(qualifications: string[]) => {
						setQualifications(qualifications);
					}}
				/>

				<SubmitButtonComponent
					Text="Register"
					Loading={isLoading}
					Error={error}
				/>
			</form>
		</>
	);
}
