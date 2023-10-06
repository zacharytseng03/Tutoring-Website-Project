import { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import LoadingComponent from '../../../../LoadingComponent';
import Language from '../../../../../Models/Language.Model';
import Subject from '../../../../../Models/Subject.Model';
import Qualification from '../../../../../Models/Qualification.Model';
import apiCall from '../../../../../Utility/MakeRequest';

export interface CollapseLanguageSubjectQualificationProp {
	Email: string;
}

export default function CollapseLanguageSubjectQualificationComponent(
	prop: CollapseLanguageSubjectQualificationProp
) {
	const [showLanguages, setShowLanguages] = useState(false);
	const [languagesError, setLanguagesError] = useState('');
	const [isLanguagesLoading, setLanguagesLoading] = useState(false);
	const [languages, setLanguages] = useState<Language[]>();

	const [showSubjects, setShowSubjects] = useState(false);
	const [subjectsError, setSubjectsError] = useState('');
	const [isSubjectsLoading, setSubjectsLoading] = useState(false);
	const [subjects, setSubjects] = useState<Subject[]>();

	const [showQualifications, setShowQualifications] = useState(false);
	const [qualificationsError, setQualificationsError] = useState('');
	const [isQualificationsLoading, setQualificationsLoading] = useState(false);
	const [qualifications, setQualifications] = useState<Qualification[]>();

	const getLanguages = async () => {
		if (!showLanguages) {
			setShowLanguages(true);
			if (languages === undefined) {
				setLanguagesLoading(true);
				const response = await apiCall('get', `/tutor/${prop.Email}/languages`);
				if (response.error) {
					setLanguagesError(response.error);
				} else {
					setLanguages(response.response);
					setLanguagesError('');
				}
				setLanguagesLoading(false);
			}
		} else {
			setShowLanguages(false);
		}
	};

	const getSubjects = async () => {
		if (!showSubjects) {
			setShowSubjects(true);
			if (subjects === undefined) {
				setSubjectsLoading(true);
				const response = await apiCall('get', `/tutor/${prop.Email}/subjects`);
				if (response.error) {
					setSubjectsError(response.error);
				} else {
					setSubjects(response.response);
					setSubjectsError('');
				}
				setSubjectsLoading(false);
			}
		} else {
			setShowSubjects(false);
		}
	};

	const getQualifications = async () => {
		if (!showQualifications) {
			setShowQualifications(true);
			if (qualifications === undefined) {
				setQualificationsLoading(true);
				const response = await apiCall(
					'get',
					`/tutor/${prop.Email}/qualifications`
				);
				console.log(response);
				if (response.error) {
					setQualificationsError(response.error);
				} else {
					setQualifications(response.response);
					setQualificationsError('');
				}
				setQualificationsLoading(false);
			}
		} else {
			setShowQualifications(false);
		}
	};

	return (
		<>
			<div className="row">
				<button className="btn btn-primary m-2 col" onClick={getLanguages}>
					Languages
				</button>
				<button className="btn btn-primary m-2 col" onClick={getSubjects}>
					Subjects
				</button>
				<button className="btn btn-primary m-2 col" onClick={getQualifications}>
					Qualifications
				</button>
			</div>
			<div className="row">
				<div className="col">
					<Collapse in={showLanguages}>
						<div className="card card-body my-2">
							{isLanguagesLoading ? (
								<LoadingComponent />
							) : languagesError ? (
								<h3>{languagesError}</h3>
							) : (
								languages?.map((language) => (
									<div className="row" key={language.name}>
										<div className="col">Language: {language.name}</div>
										<div className="col">
											Proficiency: {language.proficiency}
										</div>
									</div>
								))
							)}
						</div>
					</Collapse>
				</div>

				<div className="col">
					<Collapse in={showSubjects}>
						<div className="card card-body my-2">
							{isSubjectsLoading ? (
								<LoadingComponent />
							) : subjectsError ? (
								<h3>{subjectsError}</h3>
							) : (
								subjects?.map((subject) => (
									<div className="border-bottom border-3 pb-1 my-1">
										<div
											className="row"
											key={`${subject.course}-${subject.level}`}>
											<div className="col">Course: {subject.course}</div>
											<div className="col">Level: {subject.level}</div>
										</div>
										{subject.description && (
											<p className="border border-primary">
												{subject.description}
											</p>
										)}
									</div>
								))
							)}
						</div>
					</Collapse>
				</div>

				<div className="col">
					<Collapse in={showQualifications}>
						<div className="card card-body my-2">
							{isQualificationsLoading ? (
								<LoadingComponent />
							) : qualificationsError ? (
								<h3>{qualificationsError}</h3>
							) : (
								qualifications?.map((qualification) => (
									<div className="row" key={qualification.name}>
										<div className="col">Title: {qualification.name}</div>
										<div className="col">
											Date Issued:{' '}
											<span className="fst-italic">
												{' ' +
													new Date(qualification.dateissued).toDateString()}
											</span>
										</div>
									</div>
								))
							)}
						</div>
					</Collapse>
				</div>
			</div>
		</>
	);
}
