import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import Organization from '../../../../Models/Organization.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface OrganizationFilterProp {
	onUpdate(selectedList: Organization[]): void;
}

export default function OrganizationFilterComponent(
	prop: OrganizationFilterProp
) {
	const [items, setItems] = useState<Organization[]>([]);
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		getItems();
	}, []);

	const getItems = async () => {
		const response = await apiCall('get', 'organizations');

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
				placeholder="Filter Organizations"
				hidePlaceholder={true}
				loading={isLoading}
				onSelect={prop.onUpdate}
				onRemove={prop.onUpdate}
				emptyRecordMsg={error || 'No Organization Filters'}
				displayValue="name"
			/>
		</>
	);
}
