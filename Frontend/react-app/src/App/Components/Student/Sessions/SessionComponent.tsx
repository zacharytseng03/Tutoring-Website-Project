import CollapseAssignmentsComponent from './CollapseAssignmentsComponent';
import Session from '../../../Models/Session.Model';

interface SessionProp {
	Session: Session;
	Email: string;
}

export default function SessionComponent(prop: SessionProp) {
	return (
		<div className="container w-100 border border-primary border border-5 my-2">
			<h3>
				Session with {prop.Session.firstname} {prop.Session.lastname}
			</h3>
			<h5>
				Scheduled Date:
				<span className="fst-italic">
					{' ' + new Date(prop.Session.sessiondate)}
				</span>
			</h5>
			<h5>Session Time: {prop.Session.sessiontime} Hours</h5>
			<CollapseAssignmentsComponent SessionID={prop.Session.sessionid} />
		</div>
	);
}
