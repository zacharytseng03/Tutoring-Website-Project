import { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import AssignmentComponent from './AssignmentComponent';
import LoadingComponent from '../../LoadingComponent';
import Assignment from '../../../Models/Assignment.Model';
import apiCall from '../../../Utility/MakeRequest';

interface CollapseAssignmentsProp {
	SessionID: number;
}

export default function CollapseAssignmentsComponent(
	prop: CollapseAssignmentsProp
) {
	const [showAssignments, setShowAssignments] = useState(false);
	const [assignmentsError, setAssignmentsError] = useState('');
	const [isAssignmentsLoading, setAssignmentsLoading] = useState(false);
	const [assignments, setAssignments] = useState<Assignment[]>();

	const getAssignments = async () => {
		if (!showAssignments) {
			setShowAssignments(true);
			if (assignments === undefined) {
				setAssignmentsLoading(true);
				const response = await apiCall(
					'get',
					`session/${prop.SessionID}/assignments`
				);
				if (response.error) {
					setAssignmentsError(response.error);
				} else {
					setAssignments(response.response);
					setAssignmentsError('');
				}
				setAssignmentsLoading(false);
			}
		} else {
			setShowAssignments(false);
		}
	};

	return (
		<>
			<div className="row">
				<button className="btn btn-primary m-2 col" onClick={getAssignments}>
					Assignments
				</button>
			</div>
			<div className="row">
				<div className="col">
					<Collapse in={showAssignments}>
						<div className="card card-body my-2">
							{isAssignmentsLoading ? (
								<LoadingComponent />
							) : assignmentsError ? (
								<h3>{assignmentsError}</h3>
							) : !assignments ? (
								<h3>An Error Occurred Receiving Assignments</h3>
							) : assignments.length === 0 ? (
								<h1>No Assignments</h1>
							) : (
								assignments.map((assignment) => (
									<AssignmentComponent Assignment={assignment} />
								))
							)}
						</div>
					</Collapse>
				</div>
			</div>
		</>
	);
}
