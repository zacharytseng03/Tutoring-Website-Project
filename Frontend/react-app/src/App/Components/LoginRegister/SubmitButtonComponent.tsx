interface SubmitButtonProp {
	Text: string;
	Loading: boolean;
	Error?: string;
}

export default function SubmitButtonComponent(prop: SubmitButtonProp) {
	return (
		<div className="d-flex flex-column my-3">
			{prop.Loading ? (
				<div className="spinner-border text-primary my-3 mx-auto" />
			) : (
				<button type="submit" className="btn btn-primary px-5 mx-auto">
					{prop.Text}
				</button>
			)}
			{prop.Error && (
				<h2 className="form-text text-danger mx-auto">{prop.Error}</h2>
			)}
		</div>
	);
}
