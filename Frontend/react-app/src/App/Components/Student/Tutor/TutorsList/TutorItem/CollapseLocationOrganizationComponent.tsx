import { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import Location from '../../../../../Models/Location.Model';
import Organization from '../../../../../Models/Organization.Model';

interface CollapseLocationOrganizationProp {
	Location: Location;
	Organization: Organization;
}

export default function CollapseLocationOrganizationComponent(
	prop: CollapseLocationOrganizationProp
) {
	const [showLocation, setShowLocation] = useState(false);
	const [showOrganization, setShowOrganization] = useState(false);

	return (
		<>
			<div className="row">
				<button
					className="btn btn-primary m-2 col"
					onClick={() => setShowLocation(!showLocation)}>
					Location
				</button>
				<button
					className="btn btn-primary m-2 col"
					onClick={() => setShowOrganization(!showOrganization)}>
					Organization
				</button>
			</div>
			<div className="row">
				<div className="col">
					<Collapse in={showLocation}>
						<div className="card card-body my-2">
							<h6>Country: {prop.Location.country}</h6>
							<h6>Region: {prop.Location.region}</h6>
							<h6>City: {prop.Location.city}</h6>
							<h6>
								Time Zone:{' '}
								{prop.Location.timezone < 0
									? `UTC${prop.Location.timezone}`
									: `UTC+${prop.Location.timezone}`}
							</h6>
							<h6>Street: {prop.Location.street}</h6>
							<h6>House Number: {prop.Location.housenum}</h6>
							<h6>Postal Code: {prop.Location.postalcode}</h6>
						</div>
					</Collapse>
				</div>
				<div className="col">
					<Collapse in={showOrganization}>
						<div className="card card-body my-2">
							<h6>Name: {prop.Organization.name}</h6>
							<h6>Email: {prop.Organization.email}</h6>
							<h6>URL: {prop.Organization.url}</h6>
						</div>
					</Collapse>
				</div>
			</div>
		</>
	);
}
