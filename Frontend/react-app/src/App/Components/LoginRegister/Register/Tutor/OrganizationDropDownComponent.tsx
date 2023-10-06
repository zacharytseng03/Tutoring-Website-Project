import { useState, useEffect } from 'react';
import DropDownComponent from '../DropDownComponent';
import Organization from '../../../../Models/Organization.Model';
import Option from '../../../../Models/Miscallaneous/Option.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface OrganizationDropDownProp {
	updateOrganization(orgId: number): void;
}

export default function OrganizationDropDownComponent(
	prop: OrganizationDropDownProp
) {
	const [organizationLoading, setOrganizationLoading] = useState(false);
	const [organizationError, setOrganizationError] = useState('');
	const [organizations, setOrganizations] = useState<Option[]>();

	useEffect(() => {
		getOrganizations();
	}, []);

	const getOrganizations = async () => {
		setOrganizationLoading(true);
		const response = await apiCall('get', 'organizations');
		if (response.error) {
			setOrganizationError(response.error);
		} else {
			const data: Organization[] = response.response;
			const options: Option[] = data.map((organization) => ({
				name: organization.name,
				id: organization.orgid,
			}));
			setOrganizationError('');
			setOrganizations(options);
		}
		setOrganizationLoading(false);
	};

	const onSelectOrganization = (_: Option[], selectedItem: Option) => {
		prop.updateOrganization(selectedItem.id as number);
	};

	const onRemoveOrganization = () => {
		prop.updateOrganization(-1);
	};

	return (
		<div>
			<label>Organization</label>
			<div className="my-2">
				<DropDownComponent
					Id={'Organization'}
					Items={organizations || []}
					Loading={organizationLoading}
					Error={organizationError || 'No Organizations Availabile'}
					PlaceHolder="Select Organization"
					onRemove={onRemoveOrganization}
					onSelect={onSelectOrganization}
				/>
			</div>
		</div>
	);
}
