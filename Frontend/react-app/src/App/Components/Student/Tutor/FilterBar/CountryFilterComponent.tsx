import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import Option from '../../../../Models/Miscallaneous/Option.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface CountryFilterProp {
	onUpdate(selectedList: Option[]): void;
}

export default function CountryFilterComponent(prop: CountryFilterProp) {
	const [items, setItems] = useState<Option[]>();
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		getItems();
	}, []);

	const getItems = async () => {
		const response = await apiCall('get', 'countries');
		if (response.error) {
			setError(response.error);
		} else {
			const data: string[] = response.response;
			const options: Option[] = data.map((country) => ({
				name: country,
				id: country,
			}));
			setItems(options);
		}
		setLoading(false);
	};
	return (
		<>
			<Multiselect
				options={items}
				placeholder="Filter Countries"
				hidePlaceholder={true}
				loading={isLoading}
				onSelect={prop.onUpdate}
				onRemove={prop.onUpdate}
				emptyRecordMsg={error || 'No Country Filters'}
				displayValue="name"
			/>
		</>
	);
}
