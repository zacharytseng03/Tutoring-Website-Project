import { createRef, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import InputComponent from '../LoginRegister/InputComponent';
import DropDownComponent from '../LoginRegister/Register/DropDownComponent';
import Option from '../../Models/Miscallaneous/Option.Model';
import apiCall from '../../Utility/MakeRequest';
import { Table } from 'react-bootstrap';

interface OrganizationTable {
	orgid: number;
	count: number;
	name?: string;
	email?: string;
	url?: string;
}

interface SubjectTable {
	course: string;
	level: string;
	description?: string;
}

export default function SelectionComponent() {
	const [table, setTable] = useState('');
	const [attributes, setAttributes] = useState<string[]>([]);
	const [condition, setCondition] = useState<string | number>();
	const [finalTable, setFinalTable] = useState('');
	const [organizationTable, setOrganizationTable] =
		useState<OrganizationTable[]>();
	const [subjectTable, setSubjectTable] = useState<SubjectTable[]>();

	const attributesRef = createRef<Multiselect>();
	const conditionRef = createRef<HTMLInputElement>();

	const onSelectTable = (_: Option[], selectedItem: Option) => {
		setTable(selectedItem.id as string);
		attributesRef.current?.resetSelectedValues();
		setAttributes([]);
		if (conditionRef.current) conditionRef.current.value = '';
		setCondition(undefined);
	};

	const onRemoveTable = () => {
		setTable('');
		attributesRef.current?.resetSelectedValues();
		setAttributes([]);
		if (conditionRef.current) conditionRef.current.value = '';
		setCondition(undefined);
	};

	const onSelectAttribute = (selectedList: Option[], _: Option) => {
		setAttributes(selectedList.map((attribute) => attribute.id as string));
	};

	const onRemoveAttribute = (selectedList: Option[], _: Option) => {
		setAttributes(selectedList.map((attribute) => attribute.id as string));
	};

	const search = () => {
		getItems();
	};

	const getItems = async () => {
		const response = await apiCall('get', 'selection', undefined, {
			table: table,
			attributes: attributes,
			condition_value: condition,
		});
		setFinalTable(table);
		if (table == 'Organizations') {
			setOrganizationTable(response.response);
			setSubjectTable(undefined);
		} else if (table == 'Subjects') {
			setSubjectTable(response.response);
			setOrganizationTable(undefined);
		} else {
			setOrganizationTable(undefined);
			setSubjectTable(undefined);
		}
	};

	const organizationTableComponent = (
		<>
			<Table striped bordered hover className="mt-3">
				<thead>
					<tr>
						<th>OrgID</th>
						<th>Tutor Count</th>
						<th>Name</th>
						<th>Email</th>
						<th>URL</th>
					</tr>
				</thead>

				{organizationTable?.map((organization) => (
					<>
						<tbody key={organization.orgid}>
							<tr>
								<th>{organization.orgid}</th>
								<th>{organization.count}</th>
								<th>{organization.name || '-'}</th>
								<th>{organization.email || '-'}</th>
								<th>{organization.url || '-'}</th>
							</tr>
						</tbody>
					</>
				))}
			</Table>
		</>
	);

	const subjectTableComponent = (
		<>
			<Table striped bordered hover className="mt-3">
				<thead>
					<tr>
						<th>Course</th>
						<th>Level</th>
						<th>Description</th>
					</tr>
				</thead>

				{subjectTable?.map((subject) => (
					<>
						<tbody key={subject.course + subject.level}>
							<tr>
								<th>{subject.course}</th>
								<th>{subject.level}</th>
								<th>{subject.description || '-'}</th>
							</tr>
						</tbody>
					</>
				))}
			</Table>
		</>
	);

	return (
		<>
			<div className="d-flex justify-content-center row mt-3">
				<div className="col-4">
					<DropDownComponent
						Id="Table"
						Items={['Organizations', 'Subjects'].map((table) => ({
							name: table,
							id: table,
						}))}
						Loading={false}
						Error=""
						PlaceHolder="Select Table"
						onRemove={onRemoveTable}
						onSelect={onSelectTable}
					/>
				</div>

				<div className="col-4">
					<Multiselect
						id="Attributes"
						options={
							table == 'Organizations'
								? ['name', 'email', 'url'].map((attribute) => ({
										name: attribute,
										id: attribute,
								  }))
								: table == 'Subjects'
								? ['description'].map((attribute) => ({
										name: attribute,
										id: attribute,
								  }))
								: []
						}
						placeholder="Select Attributes"
						hidePlaceholder={true}
						ref={attributesRef}
						displayValue="name"
						onRemove={onRemoveAttribute}
						onSelect={onSelectAttribute}
					/>
				</div>

				<div className="d-flex justify-content-center row mt-3">
					<div className="col-4">
						<InputComponent
							Label={
								table == 'Organizations'
									? 'Minimum Tutors'
									: table == 'Subjects'
									? 'Course Name'
									: ''
							}
							Id="Condition"
							Type={table == 'Organizations' ? 'number' : 'text'}
							Name="Condition"
							Placeholder="Select Condition"
							Ref={conditionRef}
							MaxLength={30}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								setCondition(event.currentTarget.value)
							}
						/>
					</div>
				</div>

				<div className="d-flex justify-content-center mt-2">
					<button
						type="submit"
						className="btn btn-primary px-5 mx-auto"
						disabled={!table || !condition}
						onClick={search}>
						Search
					</button>
				</div>
			</div>
			<>
				{finalTable == 'Organizations' ? (
					organizationTableComponent
				) : finalTable == 'Subjects' ? (
					subjectTableComponent
				) : (
					<></>
				)}
			</>
		</>
	);
}
