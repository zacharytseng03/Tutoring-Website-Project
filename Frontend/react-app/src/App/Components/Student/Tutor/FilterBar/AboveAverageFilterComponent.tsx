interface AboveAverageFilterProp {
	onCheckChanged(checked: boolean): void;
}

export default function AboveAverageFilterComponent(
	prop: AboveAverageFilterProp
) {
	return (
		<div className="form-check">
			<input
				className="form-check-input"
				type="checkbox"
				id="AboveAverageCheck"
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					const checked = event.currentTarget.checked;
					prop.onCheckChanged(checked);
				}}
			/>
			<label className="form-check-label" htmlFor="AboveAverageCheck">
				Get Above Average Tutors
			</label>
		</div>
	);
}
