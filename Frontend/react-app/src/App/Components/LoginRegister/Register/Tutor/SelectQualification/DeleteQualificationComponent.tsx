interface DeleteQualificationProp {
	Index: number;
	Qualification: string;
	onQualificationDeleted(qualification: string): void;
}

export default function DeleteQualificationComponent(
	prop: DeleteQualificationProp
) {
	const onDeleteBtnClicked = () => {
		prop.onQualificationDeleted(prop.Qualification);
	};

	return (
		<div className="row my-1">
			<div className="col-10">
				{`Qualification ${prop.Index}: `}
				<span className="fw-bold">{`${prop.Qualification}`}</span>
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
