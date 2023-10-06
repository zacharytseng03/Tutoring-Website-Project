import Language from '../../../../Models/Language.Model';

interface DeleteLanguageProp {
	Index: number;
	Language: Language;
	onLanguageDeleted(language: string): void;
}

export default function DeleteLanguageComponent(prop: DeleteLanguageProp) {
	const onDeleteBtnClicked = () => {
		prop.onLanguageDeleted(prop.Language.name);
	};

	return (
		<div className="row my-1">
			<div className="col-10">
				{`Language ${prop.Index}: `}
				<span className="fw-bold">{`${prop.Language.name} - ${prop.Language.proficiency}`}</span>
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
