import { useState, useEffect, createRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import DropDownComponent from './DropDownComponent';
import InputComponent from '../InputComponent';
import Option from '../../../Models/Miscallaneous/Option.Model';
import apiCall from '../../../Utility/MakeRequest';

interface AddressInputProp {
	updateCountry(country: string): void;
	updateRegion(region: string): void;
	updateCity(region: string): void;
	updateStreet(street: string): void;
	updatePostalCode(postalCode: string): void;
	updateHouseNumber(houseNumber: number): void;
}

export default function AddressInputComponent(prop: AddressInputProp) {
	const [countryLoading, setCountryLoading] = useState(false);
	const [countryError, setCountryError] = useState('');
	const [countries, setCountries] = useState<Option[]>();

	useEffect(() => {
		getCountries();
	}, []);

	const getCountries = async () => {
		setCountryLoading(true);
		const response = await apiCall('get', 'countries');
		if (response.error) {
			setCountryError(response.error);
		} else {
			const data: string[] = response.response;
			const options: Option[] = data.map((country) => ({
				name: country,
				id: country,
			}));
			setCountryError('');
			setCountries(options);
		}
		setCountryLoading(false);
	};

	const onSelectCountry = (_: Option[], selectedItem: Option) => {
		prop.updateCountry(selectedItem.id as string);
		regionRef.current?.resetSelectedValues();
		prop.updateRegion('');
		getRegions(selectedItem.id as string);
		cityRef.current?.resetSelectedValues();
		prop.updateCity('');
		getCities('');
	};

	const onRemoveCountry = () => {
		prop.updateCountry('');
	};

	const [regionLoading, setRegionLoading] = useState(false);
	const [regionError, setRegionError] = useState('');
	const [regions, setRegions] = useState<Option[]>();

	const regionRef = createRef<Multiselect>();

	const getRegions = async (country: string) => {
		if (!country) {
			setRegions([]);
			setRegionError('Select a country first.');
			return;
		}
		setRegionLoading(true);
		const response = await apiCall('get', `regions/${country}`);
		console.log(response);
		if (response.error) {
			setRegionError(response.error);
		} else {
			const data: string[] = response.response;
			const options: Option[] = data.map((region) => ({
				name: region,
				id: region,
			}));
			setRegionError('');
			setRegions(options);
		}
		setRegionLoading(false);
	};

	const onSelectRegion = (_: Option[], selectedItem: Option) => {
		prop.updateRegion(selectedItem.id as string);
		cityRef.current?.resetSelectedValues();
		prop.updateCity('');
		getCities(selectedItem.id as string);
	};

	const onRemoveRegion = () => {
		prop.updateRegion('');
	};

	const [cityLoading, setCityLoading] = useState(false);
	const [cityError, setCityError] = useState('');
	const [cities, setCities] = useState<Option[]>();

	const cityRef = createRef<Multiselect>();

	const getCities = async (region: string) => {
		if (!region) {
			setCities([]);
			setCityError('Select a region first.');
			return;
		}
		setCityLoading(true);
		const response = await apiCall('get', `cities/${region}`);
		if (response.error) {
			setCityError(response.error);
		} else {
			const data: string[] = response.response;
			const options: Option[] = data.map((city) => ({
				name: city,
				id: city,
			}));
			setCityError('');
			setCities(options);
		}
		setCityLoading(false);
	};

	const onSelectCity = (_: Option[], selectedItem: Option) => {
		prop.updateCity(selectedItem.id as string);
	};

	const onRemoveCity = () => {
		prop.updateCity('');
	};

	return (
		<div>
			<label>Location</label>
			<div className="my-2">
				<DropDownComponent
					Id={'Country'}
					Items={countries || []}
					Loading={countryLoading}
					Error={countryError || 'No Countries Availabile'}
					PlaceHolder="Select Country"
					onRemove={onRemoveCountry}
					onSelect={onSelectCountry}
				/>
			</div>

			<div className="my-2">
				<DropDownComponent
					Id={'Region'}
					Items={regions || []}
					Loading={regionLoading}
					Error={regionError || 'No Regions Availabile'}
					Ref={regionRef}
					PlaceHolder="Select Region"
					onRemove={onRemoveRegion}
					onSelect={onSelectRegion}
				/>
			</div>

			<div className="my-2">
				<DropDownComponent
					Id={'City'}
					Items={cities || []}
					Loading={cityLoading}
					Error={cityError || 'No Cities Availabile'}
					Ref={cityRef}
					PlaceHolder="Select City"
					onRemove={onRemoveCity}
					onSelect={onSelectCity}
				/>
			</div>

			<div className="my-2">
				<InputComponent
					Id="Street"
					Type="text"
					Name="street"
					Placeholder="Enter Street"
					MaxLength={64}
					onChange={(event) => prop.updateStreet(event.currentTarget.value)}
				/>
			</div>

			<div className="my-2">
				<InputComponent
					Id="PostalCode"
					Type="text"
					Name="postal_code"
					Placeholder="Enter Postal Code"
					MaxLength={16}
					onChange={(event) => prop.updatePostalCode(event.currentTarget.value)}
				/>
			</div>

			<div className="my-2">
				<InputComponent
					Id="HouseNumber"
					Type="number"
					Name="house_num"
					Placeholder="Enter House Number"
					onChange={(event) =>
						prop.updateHouseNumber(event.currentTarget.valueAsNumber)
					}
				/>
			</div>
		</div>
	);
}
