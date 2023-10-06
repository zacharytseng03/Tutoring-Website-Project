import Multiselect from 'multiselect-react-dropdown';
import Option from '../../../../Models/Miscallaneous/Option.Model';

interface RatingFilterProp {
	onUpdate(selectedList: Option[]): void;
}

export default function RatingFilterComponent(prop: RatingFilterProp) {
	const ratings = [0, 1, 2, 3, 4, 5, 6, 7].map((rating) => ({
		name: `>= ${rating}`,
		id: rating,
	}));

	return (
		<>
			<Multiselect
				options={ratings}
				singleSelect={true}
				selectedValues={{ name: '>= 0', id: 0 }}
				placeholder="Filter Rating"
				hidePlaceholder={true}
				onSelect={prop.onUpdate}
				onRemove={prop.onUpdate}
				displayValue="name"
			/>
		</>
	);
}
