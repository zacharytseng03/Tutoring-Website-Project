import Subject from '../../../../../Models/Subject.Model';

interface DeleteSubjectProp {
	Index: number;
	Subject: Subject;
	onSubjectDeleted(subject: Subject): void;
}

export default function DeleteSubjectComponent(prop: DeleteSubjectProp) {
	const onDeleteBtnClicked = () => {
		prop.onSubjectDeleted(prop.Subject);
	};

	return (
		<div className="row my-1">
			<div className="col-10">
				{`Subject ${prop.Index}: `}
				<span className="fw-bold">{`${prop.Subject.course}-${prop.Subject.level}`}</span>
			</div>
			<div className="col-2">
				<button
					type="button"
					className="btn btn-primary"
					onClick={onDeleteBtnClicked}>
					-
				</button>
			</div>
		</div>
	);
}
