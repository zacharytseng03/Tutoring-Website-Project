import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import Qualification from '../../../../Models/Qualification.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface QualificationFilterProp {
	onUpdate(selectedList: Qualification[]): void;
}

export default function QualificationFilterComponent(
	prop: QualificationFilterProp
) {
	const [items, setItems] = useState<Qualification[]>();
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		getItems();
	}, []);

	const getItems = async () => {
		const response = await apiCall('get', 'qualifications');
		if (response.error) {
			setError(response.error);
		} else {
			setItems(response.response);
		}
		setLoading(false);
	};
	return (
		<>
			<Multiselect
				options={items}
				placeholder="Filter Qualifications"
				hidePlaceholder={true}
				loading={isLoading}
				onSelect={prop.onUpdate}
				onRemove={prop.onUpdate}
				emptyRecordMsg={error || 'No Qualification Filters'}
				displayValue="name"
			/>
		</>
	);
}
