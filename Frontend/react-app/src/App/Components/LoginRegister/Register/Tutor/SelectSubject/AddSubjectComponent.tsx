import { useState, createRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import DropDownComponent from '../../DropDownComponent';
import Subject from '../../../../../Models/Subject.Model';
import Option from '../../../../../Models/Miscallaneous/Option.Model';

interface AddSubjectProp {
	Subjects: Subject[];
	SubjectError: string;
	LoadingSubjects: boolean;
	addSubject(subject: Subject): void;
}

export default function AddSubjectComponent(prop: AddSubjectProp) {
	const [subject, setSubject] = useState<Subject>();
	const [error, setError] = useState('');

	const subjectRef = createRef<Multiselect>();

	const onSelectSubject = (_: Option[], selectedItem: Option) => {
		setSubject({
			course: (selectedItem.id as string).split('-', 2)[0],
			level: (selectedItem.id as string).split('-', 2)[1],
		});
	};

	const onRemoveSubject = () => {
		setSubject(undefined);
	};

	const onAddBtnClicked = () => {
		if (!subject) {
			setError('A subject must be selected');
		} else {
			prop.addSubject(subject);
			subjectRef.current?.resetSelectedValues();
			setSubject(undefined);
			setError('');
		}
	};

	const subjects = prop.Subjects.map((subject) => ({
		name: `${subject.course}-${subject.level}`,
		id: `${subject.course}-${subject.level}`,
	}));

	return (
		<>
			<div className="row mt-2">
				<div className="col-10">
					<DropDownComponent
						Id="Subject"
						Items={subjects}
						Loading={prop.LoadingSubjects}
						Error={prop.SubjectError}
						Ref={subjectRef}
						PlaceHolder="Select Subject"
						onRemove={onRemoveSubject}
						onSelect={onSelectSubject}
					/>
				</div>
				<div className="col-2">
					<button
						type="button"
						className="btn btn-primary"
						onClick={onAddBtnClicked}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-plus"
							viewBox="0 0 16 16">
							<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
						</svg>
					</button>
				</div>
			</div>
			{error && <h2 className="form-text text-danger mx-auto">{error}</h2>}
		</>
	);
}
