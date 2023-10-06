import { useState, useEffect } from 'react';
import AddSubjectComponent from './AddSubjectComponent';
import DeleteSubjectComponent from './DeleteSubjectComponent';
import Subject from '../../../../../Models/Subject.Model';
import apiCall from '../../../../../Utility/MakeRequest';

interface EditSubjectProp {
	AddedSubjects: Subject[];
	onSubjectsUpdated(updatedSubjects: Subject[]): void;
}

export default function EditSubjectComponent(prop: EditSubjectProp) {
	const [subjects, setSubjects] = useState<Subject[]>();
	const [subjectError, setSubjectError] = useState('');
	const [subjectLoading, setSubjectLoading] = useState(false);

	useEffect(() => {
		getSubjects();
	}, []);

	const getSubjects = async () => {
		setSubjectLoading(true);
		const response = await apiCall('get', 'subjects');
		if (response.error) {
			setSubjectError(response.error);
		} else {
			const data: Subject[] = response.response;
			setSubjectError('');
			setSubjects(data);
		}
		setSubjectLoading(false);
	};

	return (
		<div>
			<label>Subjects</label>
			{prop.AddedSubjects.map((addedSubject, index) => (
				<DeleteSubjectComponent
					key={addedSubject.course + addedSubject.level}
					Index={index + 1}
					Subject={addedSubject}
					onSubjectDeleted={(deletedSubject) => {
						const updatedSubjects = prop.AddedSubjects.filter(
							(subject) =>
								subject.course != deletedSubject.course ||
								subject.level != deletedSubject.level
						);
						prop.onSubjectsUpdated(updatedSubjects);
					}}
				/>
			))}
			<AddSubjectComponent
				Subjects={(subjects || []).filter(
					(subject) =>
						!prop.AddedSubjects.some(
							(addedSubject) =>
								addedSubject.course == subject.course &&
								addedSubject.level == subject.level
						)
				)}
				SubjectError={subjectError}
				LoadingSubjects={subjectLoading}
				addSubject={(addedSubject) => {
					const updatedSubjects = prop.AddedSubjects.slice(0);
					updatedSubjects.push(addedSubject);
					prop.onSubjectsUpdated(updatedSubjects);
				}}
			/>
			{prop.AddedSubjects.length === 0 && (
				<small className="form-text text-danger">
					Must select at least one subject
				</small>
			)}
		</div>
	);
}
