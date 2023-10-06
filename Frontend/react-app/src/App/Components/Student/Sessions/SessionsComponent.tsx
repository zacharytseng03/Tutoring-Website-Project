import { useState, useEffect } from 'react';
import SessionComponent from './SessionComponent';
import LoadingComponent from '../../LoadingComponent';
import Session from '../../../Models/Session.Model';
import apiCall from '../../../Utility/MakeRequest';

interface SessionsProp {
	Email: string;
}

export default function SessionsComponent(prop: SessionsProp) {
	const [sessions, setSessions] = useState<Session[]>();
	const [sessionsLoading, setSessionLoading] = useState(false);
	const [sessionError, setSessionError] = useState('');

	useEffect(() => {
		getSessions();
	}, []);

	const getSessions = async () => {
		setSessionLoading(true);
		const response = await apiCall('get', `student/${prop.Email}/sessions`);
		if (response.error) {
			setSessionError(response.error);
		} else {
			const data: Session[] = response.response;
			setSessionError('');
			setSessions(data);
		}
		setSessionLoading(false);
	};

	return (
		<div className="container w-100">
			{sessionsLoading ? (
				<LoadingComponent />
			) : sessionError ? (
				<h1>{sessionError}</h1>
			) : !sessions ? (
				<h1>Some Error Occurred</h1>
			) : sessions.length === 0 ? (
				<h1>No Sessions Made</h1>
			) : (
				sessions.map((session) => (
					<SessionComponent
						Session={session}
						Email={prop.Email}
						key={session.sessionid}
					/>
				))
			)}
		</div>
	);
}
