import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import Option from '../../../../Models/Miscallaneous/Option.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface LanguageFilterProp {
	onUpdate(selectedList: Option[]): void;
}

export default function LanguageFilterComponent(prop: LanguageFilterProp) {
	const [items, setItems] = useState<Option[]>();
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		getItems();
	}, []);

	const getItems = async () => {
		const response = await apiCall('get', 'languages');
		if (response.error) {
			setError(response.error);
		} else {
			const data: string[] = response.response;
			const options: Option[] = data.map((language) => ({
				name: language,
				id: language,
			}));
			setItems(options);
		}
		setLoading(false);
	};
	return (
		<>
			<Multiselect
				options={items}
				placeholder="Filter Languages"
				hidePlaceholder={true}
				loading={isLoading}
				onSelect={prop.onUpdate}
				onRemove={prop.onUpdate}
				emptyRecordMsg={error || 'No Language Filters'}
				displayValue="name"
			/>
		</>
	);
}
